const { spawn } = require('child_process');
const os = require('os');
const path = require('path');

const routes = ['/', '/ve-hue', '/kham-pha', '/an-uong', '/cam-nang', '/luu-tru'];

async function checkConsoleAndClipping() {
  const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.join(os.tmpdir(), 'edge_inspect_' + Date.now());
  const edgeProc = spawn(edge, [
    '--headless=new',
    '--remote-debugging-port=9231',
    '--remote-allow-origins=*',
    '--user-data-dir=' + profileDir,
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 2000));
  const listRes = await fetch('http://127.0.0.1:9231/json/list');
  const targets = await listRes.json();
  const pageTarget = targets.find(t => t.type === 'page') || targets[0];
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

  let idCounter = 1;
  const pending = new Map();
  const consoleMessages = [];

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.method === 'Runtime.consoleAPICalled') {
      consoleMessages.push(msg.params);
    }
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

  for (const r of routes) {
    console.log(`Checking ${r}...`);
    await send('Page.navigate', { url: `http://localhost:3000${r}` });
    await new Promise(res => setTimeout(res, 1200));

    // Check for clipped text, missing buttons, overlapping elements
    const checkRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const issues = [];
          
          // Check for all buttons and links: are they visible and have width/height > 0?
          const interactives = document.querySelectorAll('button, a[href]');
          let hiddenCount = 0;
          for (const el of interactives) {
            const rect = el.getBoundingClientRect();
            const style = window.getComputedStyle(el);
            if (style.display !== 'none' && style.visibility !== 'hidden') {
              if (rect.width === 0 && rect.height === 0) {
                hiddenCount++;
              }
            }
          }

          // Check if any headings have empty text or broken fonts
          const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4')).map(h => ({
            tag: h.tagName,
            text: h.textContent.trim().slice(0, 40),
            fontSize: window.getComputedStyle(h).fontSize,
            fontFamily: window.getComputedStyle(h).fontFamily.split(',')[0],
            lineHeight: window.getComputedStyle(h).lineHeight
          }));

          return {
            hiddenInteractives: hiddenCount,
            headingsSample: headings.slice(0, 5)
          };
        })()
      `,
      returnByValue: true
    });

    const val = (checkRes.result && checkRes.result.result && checkRes.result.result.value) || {};
    console.log(`Route ${r}:`, JSON.stringify(val));
  }

  console.log(`Console messages captured (${consoleMessages.length}):`);
  consoleMessages.forEach(m => console.log('Console:', m.type, m.args.map(a => a.value).join(' ')));

  ws.close();
  edgeProc.kill();
}

checkConsoleAndClipping().catch(console.error);
