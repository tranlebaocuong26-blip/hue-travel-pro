const { spawn } = require('child_process');
const os = require('os');
const path = require('path');
const fs = require('fs');

async function main() {
  console.log('Starting Functional Regression Tests...');
  const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.join(os.tmpdir(), 'edge_func_' + Date.now());
  const edgeProc = spawn(edge, [
    '--headless=new',
    '--remote-debugging-port=9234',
    '--remote-allow-origins=*',
    '--user-data-dir=' + profileDir,
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 2000));
  const listRes = await fetch('http://127.0.0.1:9234/json/list');
  const targets = await listRes.json();
  const pageTarget = targets.find(t => t.type === 'page') || targets[0];
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

  let idCounter = 1;
  const pending = new Map();

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    }
  };

  await new Promise(r => ws.onopen = r);

  function send(method, params = {}) {
    return new Promise((resolve) => {
      const id = idCounter++;
      pending.set(id, resolve);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await send('Page.enable');
  await send('Runtime.enable');

  const testResults = [];

  // 1. Navigation Flow: Home -> Kham Pha -> An Uong -> Cam Nang -> Luu Tru -> Ve Hue -> Home
  const navRoutes = ['/kham-pha', '/an-uong', '/cam-nang', '/luu-tru', '/ve-hue', '/'];
  for (const r of navRoutes) {
    await send('Page.navigate', { url: `http://localhost:3000${r}` });
    await new Promise(res => setTimeout(res, 600));
    const evalRes = await send('Runtime.evaluate', {
      expression: '({ title: document.title, pathname: window.location.pathname, hasHeader: !!document.querySelector("header, [class*=\'navbar\'], [class*=\'nav\']") })',
      returnByValue: true
    });
    const val = (evalRes.result && evalRes.result.result && evalRes.result.result.value) || {};
    const pass = val.pathname === r;
    testResults.push({ test: `Nav to ${r}`, pass, details: val });
    console.log(`Navigation test to ${r}: ${pass ? 'PASS' : 'FAIL'}`);
  }

  // 2. Search & Filter on /kham-pha with diacritics and no-diacritics
  await send('Page.navigate', { url: 'http://localhost:3000/kham-pha?q=dai+noi' });
  await new Promise(res => setTimeout(res, 800));
  const searchKhamPha = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const text = document.body.innerText;
        return {
          foundDaiNoi: text.includes('Đại Nội') || text.includes('Đại nội'),
          hasCards: document.querySelectorAll('[class*="Card"], [class*="card"], article').length > 0
        };
      })()
    `,
    returnByValue: true
  });
  const valSearch = (searchKhamPha.result && searchKhamPha.result.result && searchKhamPha.result.result.value) || {};
  testResults.push({ test: 'Search q=dai noi on /kham-pha', pass: valSearch.foundDaiNoi, details: valSearch });
  console.log(`Search q=dai noi test: ${valSearch.foundDaiNoi ? 'PASS' : 'FAIL'}`);

  // 3. Category Chip filter on /cam-nang (vehicle filter)
  await send('Page.navigate', { url: 'http://localhost:3000/cam-nang?vehicle=oto' });
  await new Promise(res => setTimeout(res, 800));
  const filterCamNang = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const sel = document.querySelector('select[aria-label="Loại xe"]');
        return {
          selectValue: sel ? sel.value : null,
          hasContent: document.body.innerText.includes('thuê xe') || document.body.innerText.includes('cơ sở')
        };
      })()
    `,
    returnByValue: true
  });
  const valFilterCamNang = (filterCamNang.result && filterCamNang.result.result && filterCamNang.result.result.value) || {};
  const passFilterCamNang = valFilterCamNang.selectValue === 'oto';
  testResults.push({ test: 'Vehicle filter vehicle=oto on /cam-nang', pass: passFilterCamNang, details: valFilterCamNang });
  console.log(`Vehicle filter test: ${passFilterCamNang ? 'PASS' : 'FAIL'}`);

  // 4. Reset Filters on /cam-nang
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Xóa bộ lọc'));
        if (btn) btn.click();
      })()
    `
  });
  await new Promise(res => setTimeout(res, 500));
  const resetCamNang = await send('Runtime.evaluate', {
    expression: 'window.location.search',
    returnByValue: true
  });
  const valReset = (resetCamNang.result && resetCamNang.result.result && resetCamNang.result.result.value);
  const passReset = valReset === '' || valReset === '?';
  testResults.push({ test: 'Reset filters on /cam-nang', pass: passReset, details: valReset });
  console.log(`Reset filters test: ${passReset ? 'PASS' : 'FAIL'}`);

  ws.close();
  edgeProc.kill();

  const allPass = testResults.every(t => t.pass);
  console.log(`\nFunctional Regression Finished: ${allPass ? 'ALL TESTS PASSED (100%)' : 'SOME TESTS FAILED'}`);
}

main().catch(console.error);
