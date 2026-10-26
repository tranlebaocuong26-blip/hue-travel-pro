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

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  const profileDir = path.join(os.tmpdir(), 'edge_h01_base_' + Date.now());
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

  console.log('--- MEASURING BASELINE FOR GATE 07-03D (H01 & H02) ---');

  const baselineData = {};

  for (const vp of VIEWPORTS) {
    console.log(`\nMeasuring Viewport: ${vp.width}x${vp.height}`);
    await send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      mobile: vp.width < 768
    });

    await send('Page.navigate', { url: BASE_URL + '/' });
    await sleep(1500);

    const evalRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          function getBox(el) {
            if (!el) return null;
            const r = el.getBoundingClientRect();
            const cs = window.getComputedStyle(el);
            return {
              x: Math.round(r.x * 100) / 100,
              y: Math.round(r.y * 100) / 100,
              width: Math.round(r.width * 100) / 100,
              height: Math.round(r.height * 100) / 100,
              top: Math.round(r.top * 100) / 100,
              bottom: Math.round(r.bottom * 100) / 100,
              paddingTop: cs.paddingTop,
              paddingBottom: cs.paddingBottom,
              marginTop: cs.marginTop,
              marginBottom: cs.marginBottom,
              fontSize: cs.fontSize,
              lineHeight: cs.lineHeight
            };
          }

          // Outer landing panel
          const outerPanel = document.querySelector('main > div[style*="hero"]');
          
          // Header & Brand Logo
          const header = document.querySelector('header');
          const navCapsule = document.getElementById('desktop-adaptive-nav');
          const headerLogoLink = document.querySelector('header a[href="/"]');
          const logoImg = headerLogoLink ? headerLogoLink.querySelector('img') : null;
          const wordmark = headerLogoLink ? headerLogoLink.querySelector('.font-brand') : null;
          const wordmarkHue = wordmark ? Array.from(wordmark.querySelectorAll('span')).find(s => s.innerText.trim() === 'HUẾ') : null;
          const wordmarkTravel = wordmark ? Array.from(wordmark.querySelectorAll('span')).find(s => s.innerText.toLowerCase().includes('travel')) : null;

          // Hero components
          const tagline = document.querySelector('main div:has(> svg):has(> span)');
          const h1 = document.querySelector('h1');
          const heroTitlesDiv = h1 ? h1.parentElement : null;
          const travelProDiv = heroTitlesDiv ? Array.from(heroTitlesDiv.children).find(el => el.innerText.includes('TRAVEL PRO')) : null;
          const taglineP = heroTitlesDiv ? Array.from(heroTitlesDiv.children).find(el => el.innerText.includes('Huế có chi hay?')) : null;
          const heroDesc = Array.from(document.querySelectorAll('main p')).find(p => p.innerText && p.innerText.includes('Khám phá vẻ đẹp'));
          const ctaBtn = document.querySelector('main a[href="/kham-pha"] button');
          const ctaContainer = ctaBtn ? ctaBtn.closest('div') : null;

          // Bottom dock
          const dock = Array.from(document.querySelectorAll('main > div > div')).find(d => d.className && d.className.includes('backdrop-blur'));
          const dockCards = dock ? Array.from(dock.querySelectorAll('.grid > *')) : [];

          return {
            viewport: {
              width: window.innerWidth,
              height: window.innerHeight,
              docScrollWidth: document.documentElement.scrollWidth,
              docScrollHeight: document.documentElement.scrollHeight,
              bodyScrollHeight: document.body.scrollHeight,
              hasVerticalScroll: document.documentElement.scrollHeight > window.innerHeight
            },
            outerPanel: getBox(outerPanel),
            header: getBox(header),
            navCapsule: getBox(navCapsule),
            logoIcon: getBox(logoImg),
            wordmark: getBox(wordmark),
            wordmarkHue: getBox(wordmarkHue),
            wordmarkTravel: getBox(wordmarkTravel),
            tagline: getBox(tagline),
            h1: getBox(h1),
            travelPro: getBox(travelProDiv),
            taglineP: getBox(taglineP),
            heroTitles: getBox(heroTitlesDiv),
            heroDesc: getBox(heroDesc),
            ctaContainer: getBox(ctaContainer),
            ctaBtn: getBox(ctaBtn),
            dock: getBox(dock),
            dockCardsCount: dockCards.length
          };
        })()
      `,
      returnByValue: true
    });

    console.log('evalRes raw:', JSON.stringify(evalRes));
    const data = evalRes.result && evalRes.result.result ? evalRes.result.result.value : (evalRes.result ? evalRes.result.value : null);
    if (!data) {
      console.error('Failed to evaluate at viewport:', vp.name);
      continue;
    }
    baselineData[vp.name] = data;

    // Capture full-page screenshot
    const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    fs.writeFileSync(path.join(EVIDENCE_DIR, `before-home-${vp.name}.png`), Buffer.from(shot.result.data, 'base64'));

    // Capture header brand crop
    if (data && data.header && data.logoIcon && data.wordmark) {
      const bX = Math.max(0, data.logoIcon.x - 10);
      const bY = Math.max(0, data.logoIcon.y - 10);
      const bW = (data.wordmark.x + data.wordmark.width) - bX + 20;
      const bH = Math.max(data.logoIcon.height, data.wordmark.height) + 20;
      const brandShot = await send('Page.captureScreenshot', {
        format: 'png',
        clip: { x: bX, y: bY, width: Math.max(120, bW), height: Math.max(50, bH), scale: 1 }
      });
      fs.writeFileSync(path.join(EVIDENCE_DIR, `before-brand-lockup-${vp.name}.png`), Buffer.from(brandShot.result.data, 'base64'));
    }

    console.log(`Viewport ${vp.name} measurements summary:`, {
      windowH: data.viewport.height,
      outerPanelH: data.outerPanel ? data.outerPanel.height : null,
      outerPanelBottom: data.outerPanel ? data.outerPanel.bottom : null,
      dockTop: data.dock ? data.dock.top : null,
      dockH: data.dock ? data.dock.height : null,
      dockBottom: data.dock ? data.dock.bottom : null,
      hasVerticalScroll: data.viewport.hasVerticalScroll,
      scrollHeight: data.viewport.docScrollHeight,
      logoW: data.logoIcon ? data.logoIcon.width : null,
      logoH: data.logoIcon ? data.logoIcon.height : null,
      hueFont: data.wordmarkHue ? data.wordmarkHue.fontSize : null,
      travelFont: data.wordmarkTravel ? data.wordmarkTravel.fontSize : null
    });
  }

  fs.writeFileSync(path.join(EVIDENCE_DIR, 'baseline-measurements.json'), JSON.stringify(baselineData, null, 2));
  console.log('\nBaseline measurement complete!');

  ws.close();
  edgeProc.kill();
}

run().catch(err => {
  console.error('Error in baseline measurement:', err);
  process.exit(1);
});
