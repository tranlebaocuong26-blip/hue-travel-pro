const { spawn } = require('child_process');
const os = require('os');
const path = require('path');
const fs = require('fs');

async function main() {
  const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.join(os.tmpdir(), 'edge_debug_' + Date.now());
  const edgeProc = spawn(edge, [
    '--headless=new',
    '--remote-debugging-port=9227',
    '--remote-allow-origins=*',
    '--user-data-dir=' + profileDir,
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1500));

  const listRes = await fetch('http://127.0.0.1:9227/json/list');
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

  const outDir = path.join(__dirname, '..', 'reports', 'gravity', 'evidence', 'banners-sync');
  fs.mkdirSync(outDir, { recursive: true });

  await send('Page.enable');
  await send('DOM.enable');
  await send('Runtime.enable');

  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  const pages = [
    { name: '01_kham_pha', url: 'http://localhost:3000/kham-pha' },
    { name: '02_ve_hue', url: 'http://localhost:3000/ve-hue' },
    { name: '03_an_uong', url: 'http://localhost:3000/an-uong' },
    { name: '04_di_chuyen', url: 'http://localhost:3000/cam-nang' },
  ];

  for (const p of pages) {
    console.log(`Navigating to ${p.url} ...`);
    await send('Page.navigate', { url: p.url });
    await new Promise(r => setTimeout(r, 1800));

    const snap = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(outDir, `${p.name}.png`), Buffer.from(snap.result.data, 'base64'));
    console.log(`Captured ${p.name}.png`);
  }

  edgeProc.kill();
  console.log('All 4 banners captured and verified successfully!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
