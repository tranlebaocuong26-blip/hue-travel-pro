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
  console.log('Target WS:', pageTarget.webSocketDebuggerUrl);

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

  async function checkPage(url, width, height) {
    console.log(`\n=== Checking ${url} at ${width}x${height} ===`);
    await send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: width < 768
    });

    await send('Page.navigate', { url });
    await new Promise(r => setTimeout(r, 1200));

    const evalRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const docScroll = document.documentElement.scrollWidth;
          const bodyScroll = document.body.scrollWidth;
          const winWidth = window.innerWidth;
          
          const overflowing = [];
          const all = document.querySelectorAll('*');
          for (const el of all) {
            const rect = el.getBoundingClientRect();
            if (rect.right > winWidth + 1) {
              overflowing.push({
                tag: el.tagName,
                id: el.id,
                className: el.className ? (typeof el.className === 'string' ? el.className.slice(0, 100) : '') : '',
                text: el.innerText ? el.innerText.slice(0, 40).replace(/\\n/g, ' ') : '',
                rect: { left: Math.round(rect.left), right: Math.round(rect.right), width: Math.round(rect.width) }
              });
            }
          }
          return {
            winWidth,
            docScroll,
            bodyScroll,
            isOverflow: docScroll > winWidth,
            overflowCount: overflowing.length,
            overflowing: overflowing.slice(0, 15)
          };
        })()
      `,
      returnByValue: true
    });

    console.log(JSON.stringify(evalRes.result ? (evalRes.result.result ? evalRes.result.result.value : evalRes.result) : evalRes, null, 2));
  }

  await checkPage('http://localhost:3005/kham-pha', 390, 844);
  await checkPage('http://localhost:3005/kham-pha', 320, 600);
  await checkPage('http://localhost:3005/', 390, 844);
  await checkPage('http://localhost:3005/ve-hue', 390, 844);
  await checkPage('http://localhost:3005/cam-nang', 390, 844);
  await checkPage('http://localhost:3005/luu-tru', 390, 844);

  ws.close();
  edgeProc.kill();
}

run().catch(console.error);
