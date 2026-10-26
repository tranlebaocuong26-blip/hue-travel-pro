const { spawn } = require('child_process');
const os = require('os');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const EVIDENCE_DIR = 'A:\\trí tuệ nhân tạo\\BAI_3\\hue-travel-pro\\reports\\gravity\\evidence\\GATE-07-04';
const BASE_URL = 'http://localhost:3000';

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function run() {
  const profileDir = path.join(os.tmpdir(), 'edge_check_final_lock_' + Date.now());
  const edgeProc = spawn(EDGE_PATH, [
    '--headless=new',
    '--remote-debugging-port=9245',
    '--remote-allow-origins=*',
    '--user-data-dir=' + profileDir,
    'about:blank'
  ]);
  await sleep(1500);

  const listRes = await fetch('http://127.0.0.1:9245/json/list');
  const targets = await listRes.json();
  const pageTarget = targets.find(t => t.type === 'page') || targets[0];
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

  let idCounter = 1;
  const pending = new Map();
  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    }
  };
  await new Promise(r => ws.onopen = r);

  function send(method, params = {}) {
    return new Promise(res => {
      const id = idCounter++;
      pending.set(id, res);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await send('Page.enable');
  await send('DOM.enable');
  await send('Runtime.enable');

  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: BASE_URL + '/' });
  await sleep(2000);

  const shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(EVIDENCE_DIR, 'homepage_final_locked.png'), Buffer.from(shot.result.data, 'base64'));

  const metricsRes = await send('Runtime.evaluate', {
    expression: `(() => {
      const header = document.querySelector('header');
      const brandA = header ? header.querySelector('a') : null;
      const nav = document.getElementById('desktop-adaptive-nav');
      const logoRect = brandA ? brandA.getBoundingClientRect() : null;
      const navRect = nav ? nav.getBoundingClientRect() : null;
      return JSON.stringify({
        headerPaddingTop: header ? window.getComputedStyle(header).paddingTop : null,
        navTop: nav ? window.getComputedStyle(nav).top : null,
        logoBounds: logoRect ? { x: Math.round(logoRect.x), y: Math.round(logoRect.y), w: Math.round(logoRect.width), h: Math.round(logoRect.height) } : null,
        navBounds: navRect ? { x: Math.round(navRect.x), y: Math.round(navRect.y), w: Math.round(navRect.width), h: Math.round(navRect.height) } : null
      });
    })()`,
    returnByValue: true
  });
  console.log('Final Metrics:', JSON.parse(metricsRes.result.result.value));

  ws.close();
  edgeProc.kill();
  console.log('Saved homepage_final_locked.png successfully!');
}

run().catch(console.error);
