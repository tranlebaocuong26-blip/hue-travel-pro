const { spawn } = require('child_process');
const os = require('os');
const path = require('path');
const fs = require('fs');

async function main() {
  const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.join(os.tmpdir(), 'edge_debug_' + Date.now());
  const edgeProc = spawn(edge, [
    '--headless=new',
    '--remote-debugging-port=9228',
    '--remote-allow-origins=*',
    '--user-data-dir=' + profileDir,
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1500));

  const listRes = await fetch('http://127.0.0.1:9228/json/list');
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
  await send('Runtime.enable');

  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  console.log('Navigating to http://localhost:3000/cam-nang ...');
  await send('Page.navigate', { url: 'http://localhost:3000/cam-nang' });
  await new Promise(r => setTimeout(r, 2200));

  const snap = await send('Page.captureScreenshot', { format: 'png' });
  const buf = Buffer.from(snap.result.data, 'base64');

  const reportPath = path.join(__dirname, '..', 'reports', 'gravity', 'evidence', 'di_chuyen_updated.png');
  const brainPath = 'C:\\Users\\cường\\.gemini\\antigravity\\brain\\9055662a-146a-489b-b3ca-059ddd2d278f\\di_chuyen_updated.png';

  fs.writeFileSync(reportPath, buf);
  fs.writeFileSync(brainPath, buf);

  console.log('Successfully saved screenshot to:', reportPath, 'and', brainPath);

  edgeProc.kill();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
