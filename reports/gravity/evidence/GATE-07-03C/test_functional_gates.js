const { spawn } = require('child_process');
const os = require('os');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const EVIDENCE_DIR = __dirname;
const BASE_URL = 'http://localhost:3000';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  const profileDir = path.join(os.tmpdir(), 'edge_gates_' + Date.now());
  const edgeProc = spawn(EDGE_PATH, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--remote-allow-origins=*',
    '--user-data-dir=' + profileDir,
    'about:blank'
  ]);

  await sleep(1500);

  const listRes = await fetch('http://127.0.0.1:9222/json/list');
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
  await send('DOM.enable');

  await send('Emulation.setDeviceMetricsOverride', {
    width: 1366,
    height: 768,
    deviceScaleFactor: 1,
    mobile: false
  });

  const results = {
    t05: null,
    t07: null,
    a01: null
  };

  console.log('--- TESTING T05: RENTAL FOOTER & CARDS (/cam-nang) ---');
  await send('Page.navigate', { url: BASE_URL + '/cam-nang' });
  await sleep(1500);

  const t05Eval = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const rentalSection = document.getElementById('thue-xe-danh-sach');
        const cards = Array.from(document.querySelectorAll('#thue-xe-danh-sach a, div[id*="thue-xe"] a'));
        const links = Array.from(document.querySelectorAll('a[href*="/cam-nang/thue-xe/"]'));
        return {
          sectionExists: !!rentalSection,
          rentalLinksCount: links.length,
          sampleLinks: links.slice(0, 6).map(l => ({ text: l.innerText.replace(/\\n/g, ' ').slice(0, 40), href: l.getAttribute('href') }))
        };
      })()
    `,
    returnByValue: true
  });
  results.t05 = t05Eval.result && t05Eval.result.result ? t05Eval.result.result.value : t05Eval.result.value;
  console.log('T05 Results:', JSON.stringify(results.t05, null, 2));

  console.log('\n--- TESTING T07: ACCOMMODATION FILTER (/luu-tru) ---');
  await send('Page.navigate', { url: BASE_URL + '/luu-tru' });
  await sleep(1500);

  const t07Eval = await send('Runtime.evaluate', {
    expression: `
      (() => {
        // Buttons for categories
        const buttons = Array.from(document.querySelectorAll('button'));
        const catButtons = buttons.filter(b => ['Tất cả', 'Homestay', 'Khách sạn', 'Resort'].some(cat => b.innerText.includes(cat)));
        
        // Cards count
        const cards = Array.from(document.querySelectorAll('a[href*="/luu-tru/"]'));
        
        // Inputs
        const inputs = Array.from(document.querySelectorAll('input'));

        return {
          categoryButtons: catButtons.map(b => b.innerText.trim()),
          totalCards: cards.length,
          inputsCount: inputs.length,
          sampleCards: cards.slice(0, 4).map(c => ({ text: c.innerText.replace(/\\n/g, ' ').slice(0, 30), href: c.getAttribute('href') }))
        };
      })()
    `,
    returnByValue: true
  });
  results.t07 = t07Eval.result && t07Eval.result.result ? t07Eval.result.result.value : t07Eval.result.value;
  console.log('T07 Results:', JSON.stringify(results.t07, null, 2));

  console.log('\n--- TESTING A01: KEYBOARD ACCESSIBILITY & FOCUS ---');
  // Dispatch tab keypresses
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
  await sleep(200);
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
  await sleep(200);

  const a01Eval = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const active = document.activeElement;
        const cs = active ? window.getComputedStyle(active) : null;
        return {
          activeTag: active ? active.tagName : null,
          activeText: active ? active.innerText.slice(0, 30) : null,
          outline: cs ? cs.outline : null,
          boxShadow: cs ? cs.boxShadow : null
        };
      })()
    `,
    returnByValue: true
  });
  results.a01 = a01Eval.result && a01Eval.result.result ? a01Eval.result.result.value : a01Eval.result.value;
  console.log('A01 Results:', JSON.stringify(results.a01, null, 2));

  fs.writeFileSync(path.join(EVIDENCE_DIR, 'functional-gates-results.json'), JSON.stringify(results, null, 2));

  ws.close();
  edgeProc.kill();
  console.log('Functional gates testing complete!');
}

run().catch(err => {
  console.error('Functional gate testing error:', err);
  process.exit(1);
});
