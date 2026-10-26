const { spawn } = require('child_process');
const os = require('os');
const path = require('path');
const fs = require('fs');

const root = 'A:\\trí tuệ nhân tạo\\BAI_3\\hue-travel-pro';
const evidenceDir = path.join(root, 'reports', 'gravity', 'evidence', 'GATE-08', 'fixes');
fs.mkdirSync(evidenceDir, { recursive: true });

async function main() {
  const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.join(os.tmpdir(), 'edge_retest_' + Date.now());
  const edgeProc = spawn(edge, [
    '--headless=new',
    '--remote-debugging-port=9232',
    '--remote-allow-origins=*',
    '--user-data-dir=' + profileDir,
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 2000));
  const listRes = await fetch('http://127.0.0.1:9232/json/list');
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

  // Test M01 320x568 on /cam-nang
  await send('Emulation.setDeviceMetricsOverride', {
    width: 320,
    height: 568,
    deviceScaleFactor: 2,
    mobile: true
  });

  await send('Page.navigate', { url: 'http://localhost:3000/cam-nang' });
  await new Promise(res => setTimeout(res, 1000));

  const evalRes = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const docWidth = document.documentElement.clientWidth;
        const scrollWidth = document.documentElement.scrollWidth;
        const bodyScrollWidth = document.body ? document.body.scrollWidth : 0;
        const maxScroll = Math.max(scrollWidth, bodyScrollWidth);
        const hasHorizontalOverflow = maxScroll > docWidth + 1;
        const overflowDelta = maxScroll - docWidth;

        return {
          docWidth,
          docHeight: document.documentElement.clientHeight,
          maxScroll,
          hasHorizontalOverflow,
          overflowDelta
        };
      })()
    `,
    returnByValue: true
  });

  const metrics = (evalRes.result && evalRes.result.result && evalRes.result.result.value) || {};
  console.log('Retest metrics for /cam-nang @ M01 (320x568):', JSON.stringify(metrics, null, 2));

  const ssRes = await send('Page.captureScreenshot', { format: 'png' });
  const afterScreenshot = path.join(evidenceDir, 'cam-nang_M01_320x568_after_fix.png');
  fs.writeFileSync(afterScreenshot, Buffer.from(ssRes.result.data, 'base64'));
  console.log('Saved after-fix screenshot to:', afterScreenshot);

  ws.close();
  edgeProc.kill();
}

main().catch(console.error);
