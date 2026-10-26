const { spawn } = require('child_process');
const os = require('os');
const path = require('path');
const fs = require('fs');

async function main() {
  const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.join(os.tmpdir(), 'edge_debug_' + Date.now());
  const edgeProc = spawn(edge, [
    '--headless=new',
    '--remote-debugging-port=9226',
    '--remote-allow-origins=*',
    '--user-data-dir=' + profileDir,
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1500));

  const listRes = await fetch('http://127.0.0.1:9226/json/list');
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

  const outDir = path.join(__dirname, '..', 'reports', 'gravity', 'evidence', 'kham-pha');
  fs.mkdirSync(outDir, { recursive: true });

  await send('Page.enable');
  await send('DOM.enable');
  await send('Runtime.enable');

  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 1800,
    deviceScaleFactor: 1,
    mobile: false
  });

  console.log('Navigating to http://localhost:3000/kham-pha ...');
  await send('Page.navigate', { url: 'http://localhost:3000/kham-pha' });
  await new Promise(r => setTimeout(r, 2500));

  // Screenshot of the full page
  const snap = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(outDir, 'kham_pha_updated.png'), Buffer.from(snap.result.data, 'base64'));
  console.log('Captured kham_pha_updated.png');

  // DOM Checks
  const evalRes = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const text = document.body.innerText;
        const userIcon = document.querySelector('svg.lucide-user');
        const h1 = document.querySelector('h1');
        return {
          h1Text: h1 ? h1.innerText : '',
          hasDeletedKhamPhaTag: !text.includes('KHÁM PHÁ HUẾ'),
          hasUserIcon: !!userIcon,
        };
      })()
    `,
    returnByValue: true
  });
  console.log('DOM checks:', evalRes.result ? evalRes.result.value : evalRes);

  edgeProc.kill();
  console.log('Verification finished successfully!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
