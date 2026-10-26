const { spawn } = require('child_process');
const os = require('os');
const path = require('path');
const fs = require('fs');

async function main() {
  const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.join(os.tmpdir(), 'edge_debug_' + Date.now());
  const edgeProc = spawn(edge, [
    '--headless=new',
    '--remote-debugging-port=9225',
    '--remote-allow-origins=*',
    '--user-data-dir=' + profileDir,
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1500));

  const listRes = await fetch('http://127.0.0.1:9225/json/list');
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

  const outDir = path.join(__dirname, '..', 'reports', 'gravity', 'evidence', 've-hue');
  fs.mkdirSync(outDir, { recursive: true });

  await send('Page.enable');
  await send('DOM.enable');
  await send('Runtime.enable');

  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 1200,
    deviceScaleFactor: 1,
    mobile: false
  });

  console.log('Navigating to http://localhost:3000/ve-hue ...');
  await send('Page.navigate', { url: 'http://localhost:3000/ve-hue' });
  await new Promise(r => setTimeout(r, 2000));

  // Screenshot 1: 4 cards resting, equal height, no Hình 2
  const snap1 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(outDir, '01_resting_cards_equal_height.png'), Buffer.from(snap1.result.data, 'base64'));
  console.log('Captured 01_resting_cards_equal_height.png');

  // Verify heights of the 4 cards
  const heightsRes = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const cards = Array.from(document.querySelectorAll('.grid > div > div.rounded-2xl'));
        return cards.map(c => ({
          title: c.querySelector('h3') ? c.querySelector('h3').textContent : '',
          height: c.getBoundingClientRect().height
        }));
      })()
    `,
    returnByValue: true
  });
  console.log('Cards bounding rect heights:', heightsRes.result ? heightsRes.result.value : heightsRes);

  // Click Card 1 (Lịch sử hình thành)
  console.log('Clicking Card 1 (Lịch sử hình thành)...');
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const btn = document.querySelector('button[aria-label*="Lịch sử hình thành"]');
        if (btn) btn.click();
      })()
    `
  });
  await new Promise(r => setTimeout(r, 800));

  const snap2 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(outDir, '02_wide_panel_history.png'), Buffer.from(snap2.result.data, 'base64'));
  console.log('Captured 02_wide_panel_history.png');

  // Click Card 3 (Huế ngày nay)
  console.log('Clicking Card 3 (Huế ngày nay)...');
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const btn = document.querySelector('button[aria-label*="Huế ngày nay"]');
        if (btn) btn.click();
      })()
    `
  });
  await new Promise(r => setTimeout(r, 800));

  const snap3 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(outDir, '03_wide_panel_modern.png'), Buffer.from(snap3.result.data, 'base64'));
  console.log('Captured 03_wide_panel_modern.png');

  // Verify Hình 2 is completely gone
  const sectionCheck = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const text = document.body.innerText;
        return {
          hasTimelineHeading: text.includes('DÒNG THỜI GIAN'),
          hasHanhTrinhLichSu: text.includes('Hành trình lịch sử của Huế'),
          hasNetDepCoDo: text.includes('Nét đẹp cố đô Huế'),
        };
      })()
    `,
    returnByValue: true
  });
  console.log('Hình 2 removal check:', sectionCheck.result ? sectionCheck.result.value : sectionCheck);

  // Click Thu gọn tư liệu
  console.log('Clicking Thu gọn tư liệu...');
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Thu gọn tư liệu'));
        if (btn) btn.click();
      })()
    `
  });
  await new Promise(r => setTimeout(r, 800));

  const snap4 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(outDir, '04_collapsed_after_close.png'), Buffer.from(snap4.result.data, 'base64'));
  console.log('Captured 04_collapsed_after_close.png');

  edgeProc.kill();
  console.log('Test completed successfully!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
