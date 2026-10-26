const { spawn } = require('child_process');
const os = require('os');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const EVIDENCE_DIR = path.join(__dirname);
const BASE_URL = 'http://localhost:3000';

const VIEWPORTS = [
  { width: 1366, height: 768, name: '1366' },
  { width: 1440, height: 900, name: '1440' },
  { width: 1650, height: 786, name: '1650' },
  { width: 1920, height: 1080, name: '1920' },
  { width: 390, height: 844, name: '390' }
];

const ROUTES = [
  { path: '/', name: 'home' },
  { path: '/ve-hue', name: 've-hue' },
  { path: '/kham-pha', name: 'kham-pha' },
  { path: '/cam-nang', name: 'cam-nang' },
  { path: '/luu-tru', name: 'luu-tru' }
];

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  const profileDir = path.join(os.tmpdir(), 'edge_baseline_' + Date.now());
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

  console.log('--- CAPTURING BEFORE BASELINE (GATE-07-03C) ---');

  const baselineData = {
    foodCardPlaceholder: {},
    routes: {}
  };

  for (const vp of VIEWPORTS) {
    console.log(`\nViewport: ${vp.width}x${vp.height}`);
    await send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      mobile: vp.width < 768
    });

    // 1. Visit Home and capture Food card placeholder close-up
    await send('Page.navigate', { url: BASE_URL + '/' });
    await sleep(1200);

    // Get food card placeholder bounds & computed styles
    const foodCardEval = await send('Runtime.evaluate', {
      expression: `
        (() => {
          try {
            const links = Array.from(document.querySelectorAll('a'));
            const foodCard = links.find(a => a.innerText && a.innerText.includes('Ẩm thực Huế'));
            if (!foodCard) return { error: 'foodCard not found', links: links.map(l => l.innerText) };
            const rect = foodCard.getBoundingClientRect();
            const spans = Array.from(foodCard.querySelectorAll('span'));
            const s1 = spans.find(s => s.textContent && s.textContent.toLowerCase().includes('đang chờ'));
            const s2 = spans.find(s => s.textContent && s.textContent.toLowerCase().includes('cố đô'));
            const h3 = foodCard.querySelector('h3');
            
            function getStyles(el) {
              if (!el) return null;
              const cs = window.getComputedStyle(el);
              const r = el.getBoundingClientRect();
              return {
                text: el.innerText,
                tag: el.tagName,
                fontFamily: cs.fontFamily,
                fontSize: cs.fontSize,
                fontWeight: cs.fontWeight,
                lineHeight: cs.lineHeight,
                letterSpacing: cs.letterSpacing,
                color: cs.color,
                textTransform: cs.textTransform,
                rect: { x: r.x, y: r.y, width: r.width, height: r.height }
              };
            }

            return {
              cardRect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
              span1: getStyles(s1),
              span2: getStyles(s2),
              title: getStyles(h3)
            };
          } catch (e) {
            return { error: e.toString(), stack: e.stack };
          }
        })()
      `,
      returnByValue: true
    });

    console.log('foodCardEval raw:', JSON.stringify(foodCardEval));
    const fcData = foodCardEval.result && foodCardEval.result.result ? foodCardEval.result.result.value : (foodCardEval.result ? foodCardEval.result.value : null);
    baselineData.foodCardPlaceholder[vp.name] = fcData;
    console.log(`Food Card data at ${vp.name}:`, JSON.stringify(fcData, null, 2));

    // Capture food card close-up screenshot
    if (fcData && fcData.cardRect) {
      const cr = fcData.cardRect;
      // Clip to card area
      const clipRes = await send('Page.captureScreenshot', {
        format: 'png',
        clip: {
          x: Math.max(0, cr.x - 4),
          y: Math.max(0, cr.y - 4),
          width: cr.width + 8,
          height: cr.height + 8,
          scale: 1
        }
      });
      if (clipRes.result && clipRes.result.data) {
        fs.writeFileSync(
          path.join(EVIDENCE_DIR, `before-food-card-${vp.name}.png`),
          Buffer.from(clipRes.result.data, 'base64')
        );
        console.log(`Saved before-food-card-${vp.name}.png`);
      }

      // Also clip tightly to the text placeholder area
      if (fcData.span1 && fcData.span2) {
        const pX = Math.min(fcData.span1.rect.x, fcData.span2.rect.x) - 10;
        const pY = fcData.span1.rect.y - 10;
        const pW = Math.max(fcData.span1.rect.width, fcData.span2.rect.width) + 20;
        const pH = (fcData.span2.rect.y + fcData.span2.rect.height) - fcData.span1.rect.y + 20;
        const textClip = await send('Page.captureScreenshot', {
          format: 'png',
          clip: {
            x: Math.max(0, pX),
            y: Math.max(0, pY),
            width: pW,
            height: pH,
            scale: 1
          }
        });
        if (textClip.result && textClip.result.data) {
          fs.writeFileSync(
            path.join(EVIDENCE_DIR, `before-placeholder-tight-${vp.name}.png`),
            Buffer.from(textClip.result.data, 'base64')
          );
          console.log(`Saved before-placeholder-tight-${vp.name}.png`);
        }
      }
    }

    // Capture full-page screenshot of all 5 routes at this viewport
    for (const route of ROUTES) {
      await send('Page.navigate', { url: BASE_URL + route.path });
      await sleep(1000);

      const shot = await send('Page.captureScreenshot', {
        format: 'png',
        captureBeyondViewport: false
      });
      if (shot.result && shot.result.data) {
        fs.writeFileSync(
          path.join(EVIDENCE_DIR, `before-${route.name}-${vp.name}.png`),
          Buffer.from(shot.result.data, 'base64')
        );
      }
    }
  }

  fs.writeFileSync(
    path.join(EVIDENCE_DIR, 'before-baseline-metrics.json'),
    JSON.stringify(baselineData, null, 2)
  );

  console.log('Baseline capture complete!');
  ws.close();
  edgeProc.kill();
}

run().catch(err => {
  console.error('Error running baseline capture:', err);
  process.exit(1);
});
