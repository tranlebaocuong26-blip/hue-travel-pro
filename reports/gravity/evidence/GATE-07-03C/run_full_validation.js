const { spawn } = require('child_process');
const os = require('os');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const EVIDENCE_DIR = __dirname;
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
  const profileDir = path.join(os.tmpdir(), 'edge_val_' + Date.now());
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

  console.log('--- STARTING 25-CASE RUNTIME VALIDATION (GATE-07-03C) ---');

  const afterMatrix = [];
  const foodCardResults = {};
  const lockupResults = [];
  const homeDisplayResults = {};
  const h1Results = [];

  for (const vp of VIEWPORTS) {
    console.log(`\n=================== VIEWPORT ${vp.width}x${vp.height} ===================`);
    await send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      mobile: vp.width < 768
    });

    for (const route of ROUTES) {
      const url = BASE_URL + route.path;
      console.log(`Checking ${route.name} (${url}) at ${vp.name}...`);
      await send('Page.navigate', { url });
      await sleep(1200);

      // Measure document scroll, fontStatus, H1, brands, and items
      const evalRes = await send('Runtime.evaluate', {
        expression: `
          (async () => {
            await document.fonts.ready;
            const doc = [document.documentElement.clientWidth, document.documentElement.scrollWidth];
            const vp = [window.innerWidth, window.innerHeight];
            const fontStatus = document.fonts.status;

            // Brand logo lockups
            const brands = [];
            const brandLinks = Array.from(document.querySelectorAll('a')).filter(a => {
              const text = a.innerText || '';
              return text.includes('HUẾ') && text.toLowerCase().includes('travel pro');
            });
            for (const bl of brandLinks) {
              const r = bl.getBoundingClientRect();
              const wordmark = bl.querySelector('.font-brand') || bl.querySelector('div:last-child');
              const cs = wordmark ? window.getComputedStyle(wordmark) : null;
              brands.push({
                visible: r.width > 0 && r.height > 0 && r.top < window.innerHeight,
                rect: { x: r.x, y: r.y, width: r.width, height: r.height },
                wordmarkFamily: cs ? cs.fontFamily : null
              });
            }

            // H1
            const h1El = document.querySelector('h1');
            let h1Data = null;
            if (h1El) {
              const r = h1El.getBoundingClientRect();
              const cs = window.getComputedStyle(h1El);
              h1Data = {
                text: h1El.innerText.replace(/\\n/g, ' '),
                family: cs.fontFamily,
                size: cs.fontSize,
                weight: cs.fontWeight,
                line: cs.lineHeight,
                spacing: cs.letterSpacing,
                height: r.height,
                width: r.width,
                x: r.x,
                y: r.y
              };
            }

            // Specific route inspections
            let extra = {};
            if ('${route.name}' === 'home') {
              // Food card placeholder
              const links = Array.from(document.querySelectorAll('a'));
              const foodCard = links.find(a => a.textContent && a.textContent.includes('Ẩm thực Huế'));
              if (foodCard) {
                const cr = foodCard.getBoundingClientRect();
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
                    rect: { x: r.x, y: r.y, width: r.width, height: r.height }
                  };
                }

                extra.foodCard = {
                  cardRect: { x: cr.x, y: cr.y, width: cr.width, height: cr.height },
                  span1: getStyles(s1),
                  span2: getStyles(s2),
                  title: getStyles(h3)
                };
              }

              // Home 3 display lines
              const h1Display = document.querySelector('h1');
              const h1Divs = h1Display ? h1Display.parentElement.querySelectorAll('*') : [];
              extra.homeDisplay = Array.from(h1Divs).map(el => {
                const cs = window.getComputedStyle(el);
                const r = el.getBoundingClientRect();
                return {
                  text: el.innerText,
                  tag: el.tagName,
                  fontFamily: cs.fontFamily,
                  fontSize: cs.fontSize,
                  rect: { x: r.x, y: r.y, width: r.width, height: r.height }
                };
              });
            }

            return { doc, vp, fontStatus, brands, h1Data, extra };
          })()
        `,
        awaitPromise: true,
        returnByValue: true
      });

      const res = evalRes.result && evalRes.result.result ? evalRes.result.result.value : (evalRes.result ? evalRes.result.value : null);
      if (!res) {
        console.error(`Evaluation failed for ${route.name} at ${vp.name}`);
        continue;
      }

      const overflow = res.doc[1] - res.doc[0];
      console.log(`  -> FontStatus: ${res.fontStatus}, Overflow: ${overflow}px, H1: ${res.h1Data ? res.h1Data.size : 'none'}`);

      afterMatrix.push({
        route: route.name,
        viewport: `${vp.width}x${vp.height}`,
        fontStatus: res.fontStatus,
        docWidth: res.doc[0],
        scrollWidth: res.doc[1],
        overflow: overflow,
        h1: res.h1Data
      });

      // Capture full screenshot
      const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
      fs.writeFileSync(path.join(EVIDENCE_DIR, `after-${route.name}-${vp.name}.png`), Buffer.from(shot.result.data, 'base64'));

      // If home, handle food card close-up
      if (route.name === 'home' && res.extra.foodCard) {
        foodCardResults[vp.name] = res.extra.foodCard;
        const fc = res.extra.foodCard;

        // Card screenshot
        const cShot = await send('Page.captureScreenshot', {
          format: 'png',
          clip: {
            x: Math.max(0, fc.cardRect.x - 4),
            y: Math.max(0, fc.cardRect.y - 4),
            width: fc.cardRect.width + 8,
            height: fc.cardRect.height + 8,
            scale: 1
          }
        });
        fs.writeFileSync(path.join(EVIDENCE_DIR, `after-food-card-${vp.name}.png`), Buffer.from(cShot.result.data, 'base64'));

        // Tight crop
        if (fc.span1 && fc.span2) {
          const pX = Math.min(fc.span1.rect.x, fc.span2.rect.x) - 10;
          const pY = fc.span1.rect.y - 10;
          const pW = Math.max(fc.span1.rect.width, fc.span2.rect.width) + 20;
          const pH = (fc.span2.rect.y + fc.span2.rect.height) - fc.span1.rect.y + 20;
          const tightShot = await send('Page.captureScreenshot', {
            format: 'png',
            clip: {
              x: Math.max(0, pX),
              y: Math.max(0, pY),
              width: pW,
              height: pH,
              scale: 1
            }
          });
          fs.writeFileSync(path.join(EVIDENCE_DIR, `after-placeholder-tight-${vp.name}.png`), Buffer.from(tightShot.result.data, 'base64'));
        }
      }
    }
  }

  fs.writeFileSync(path.join(EVIDENCE_DIR, 'after-25-case-matrix.json'), JSON.stringify(afterMatrix, null, 2));
  fs.writeFileSync(path.join(EVIDENCE_DIR, 'after-food-card-metrics.json'), JSON.stringify(foodCardResults, null, 2));

  console.log('\n--- 25-CASE RUNTIME VALIDATION COMPLETE ---');
  ws.close();
  edgeProc.kill();
}

run().catch(err => {
  console.error('Validation error:', err);
  process.exit(1);
});
