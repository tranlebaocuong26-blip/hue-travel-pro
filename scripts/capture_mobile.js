const { spawn } = require('child_process');
const os = require('os');
const path = require('path');
const fs = require('fs');

async function run() {
  const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.join(os.tmpdir(), 'edge_debug_' + Date.now());
  const edgeProc = spawn(edge, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--remote-allow-origins=*',
    '--user-data-dir=' + profileDir,
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1500));

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

  async function capture(url, width, height, outputFile) {
    await send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: width < 768
    });

    await send('Page.navigate', { url });
    await new Promise(r => setTimeout(r, 1500));

    const shot = await send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(shot.result.data, 'base64');
    fs.writeFileSync(outputFile, buffer);
    console.log(`Saved screenshot to ${outputFile}`);
  }

  const outDir = 'A:\\trí tuệ nhân tạo\\BAI_3\\screenshots';
  await capture('http://localhost:3005/kham-pha', 390, 844, path.join(outDir, 'cdp_kham_pha_390.png'));
  await capture('http://localhost:3005/kham-pha', 320, 568, path.join(outDir, 'cdp_kham_pha_320.png'));
  await capture('http://localhost:3005/kham-pha', 375, 667, path.join(outDir, 'cdp_kham_pha_375.png'));

  ws.close();
  edgeProc.kill();
}

run().catch(console.error);
