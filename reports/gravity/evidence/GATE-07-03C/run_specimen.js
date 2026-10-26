const { spawn } = require('child_process');
const os = require('os');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const SPECIMEN_DIR = path.join(__dirname, 'specimen');
const HTML_FILE = path.join(SPECIMEN_DIR, 'index.html');

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  const profileDir = path.join(os.tmpdir(), 'edge_specimen_' + Date.now());
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
    width: 1200,
    height: 1400,
    deviceScaleFactor: 1,
    mobile: false
  });

  const fileUrl = 'file:///' + HTML_FILE.replace(/\\/g, '/');
  console.log('Navigating to:', fileUrl);
  await send('Page.navigate', { url: fileUrl });
  await sleep(2000);

  // Check fonts loaded
  const fontsStatus = await send('Runtime.evaluate', {
    expression: `
      (async () => {
        await document.fonts.ready;
        const faces = [];
        for (const f of document.fonts) {
          faces.push({ family: f.family, status: f.status, weight: f.weight });
        }
        return { status: document.fonts.status, count: faces.length, faces };
      })()
    `,
    awaitPromise: true,
    returnByValue: true
  });
  const fsVal = fontsStatus.result && fontsStatus.result.result ? fontsStatus.result.result.value : (fontsStatus.result ? fontsStatus.result.value : null);
  console.log('Fonts status:', JSON.stringify(fsVal, null, 2));

  // Capture full specimen screenshot
  const fullShot = await send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: true
  });
  fs.writeFileSync(path.join(SPECIMEN_DIR, 'specimen-full.png'), Buffer.from(fullShot.result.data, 'base64'));
  console.log('Saved specimen-full.png');

  // Measure all cards and placeholders
  const measurements = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const cards = ['card-1a', 'card-1b', 'card-1c', 'card-2a', 'card-2b', 'card-2c', 'card-3a', 'card-3b', 'card-3c'];
        const results = {};
        for (const id of cards) {
          const el = document.getElementById(id);
          if (!el) continue;
          const rect = el.getBoundingClientRect();
          const spans = Array.from(el.querySelectorAll('.card-placeholder span'));
          const s1 = spans[0];
          const s2 = spans[1];
          const cs1 = window.getComputedStyle(s1);
          const cs2 = window.getComputedStyle(s2);
          const r1 = s1.getBoundingClientRect();
          const r2 = s2.getBoundingClientRect();
          results[id] = {
            card: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
            line1: {
              text: s1.innerText,
              fontFamily: cs1.fontFamily,
              fontSize: cs1.fontSize,
              fontWeight: cs1.fontWeight,
              lineHeight: cs1.lineHeight,
              letterSpacing: cs1.letterSpacing,
              color: cs1.color,
              rect: { x: r1.x, y: r1.y, width: r1.width, height: r1.height }
            },
            line2: {
              text: s2.innerText,
              fontFamily: cs2.fontFamily,
              fontSize: cs2.fontSize,
              fontWeight: cs2.fontWeight,
              lineHeight: cs2.lineHeight,
              letterSpacing: cs2.letterSpacing,
              color: cs2.color,
              rect: { x: r2.x, y: r2.y, width: r2.width, height: r2.height }
            }
          };
        }
        return results;
      })()
    `,
    returnByValue: true
  });

  const cardData = measurements.result && measurements.result.result ? measurements.result.result.value : (measurements.result ? measurements.result.value : null);
  fs.writeFileSync(path.join(SPECIMEN_DIR, 'measurements.json'), JSON.stringify(cardData, null, 2));

  // Capture individual card screenshots
  for (const [id, data] of Object.entries(cardData)) {
    const c = data.card;
    const shot = await send('Page.captureScreenshot', {
      format: 'png',
      clip: {
        x: Math.round(c.x),
        y: Math.round(c.y),
        width: Math.round(c.width),
        height: Math.round(c.height),
        scale: 1
      }
    });
    fs.writeFileSync(path.join(SPECIMEN_DIR, `${id}.png`), Buffer.from(shot.result.data, 'base64'));
    console.log(`Saved ${id}.png`);

    // Also tight crop of placeholder
    const pX = Math.min(data.line1.rect.x, data.line2.rect.x) - 10;
    const pY = data.line1.rect.y - 8;
    const pW = Math.max(data.line1.rect.width, data.line2.rect.width) + 20;
    const pH = (data.line2.rect.y + data.line2.rect.height) - data.line1.rect.y + 16;
    const tightShot = await send('Page.captureScreenshot', {
      format: 'png',
      clip: {
        x: Math.max(0, Math.round(pX)),
        y: Math.max(0, Math.round(pY)),
        width: Math.round(pW),
        height: Math.round(pH),
        scale: 1
      }
    });
    fs.writeFileSync(path.join(SPECIMEN_DIR, `${id}-tight.png`), Buffer.from(tightShot.result.data, 'base64'));
  }

  console.log('Specimen test complete!');
  ws.close();
  edgeProc.kill();
}

run().catch(err => {
  console.error('Error running specimen test:', err);
  process.exit(1);
});
