const { spawn } = require('child_process');
const os = require('os');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const EVIDENCE_DIR = __dirname;
const BASE_URL = 'http://localhost:3000';

const VIEWPORTS = [
  { name: '1366', width: 1366, height: 768, scale: 1, mobile: false },
  { name: '1440', width: 1440, height: 900, scale: 1, mobile: false },
  { name: '1650', width: 1650, height: 786, scale: 1, mobile: false },
  { name: '1920', width: 1920, height: 1080, scale: 1, mobile: false },
  { name: '390', width: 390, height: 844, scale: 3, mobile: true }
];

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  const profileDir = path.join(os.tmpdir(), 'edge_v2_' + Date.now());
  const edgeProc = spawn(EDGE_PATH, [
    '--headless=new',
    '--remote-debugging-port=9224',
    '--remote-allow-origins=*',
    '--user-data-dir=' + profileDir,
    'about:blank'
  ]);

  await sleep(1500);

  const listRes = await fetch('http://127.0.0.1:9224/json/list');
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

  const afterData = {};

  for (const vp of VIEWPORTS) {
    console.log(`\nCapturing AFTER V2 for viewport ${vp.name} (${vp.width}x${vp.height})...`);

    await send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: vp.scale,
      mobile: vp.mobile
    });

    await send('Page.navigate', { url: BASE_URL + '/' });
    await sleep(1800);

    const evalRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          function getMetrics(el) {
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
              fontSize: cs.fontSize,
              lineHeight: cs.lineHeight
            };
          }

          const outerPanel = document.querySelector('main > div');
          const header = document.querySelector('header.hidden.md\\\\:flex');
          const navCapsule = document.getElementById('desktop-adaptive-nav');
          const brandLink = header ? header.querySelector('a[href="/"]') : null;
          const logoIcon = brandLink ? brandLink.querySelector('img') : null;
          const wordmark = brandLink ? brandLink.querySelector('.font-brand') : null;
          const wordmarkHue = wordmark ? wordmark.querySelector('span:first-child') : null;
          const wordmarkTravel = wordmark ? wordmark.querySelector('span:last-child') : null;
          const navPills = navCapsule ? Array.from(navCapsule.querySelectorAll('a')) : [];

          const h1 = document.querySelector('h1');
          const ctaBtn = Array.from(document.querySelectorAll('a')).find(a => a.innerText.includes('Khám phá Huế ngay'));
          const dock = document.querySelector('div.backdrop-blur-xl');

          return {
            viewport: {
              width: window.innerWidth,
              height: window.innerHeight,
              docScrollHeight: document.documentElement.scrollHeight,
              hasVerticalScroll: document.documentElement.scrollHeight > window.innerHeight
            },
            outerPanel: getMetrics(outerPanel),
            header: getMetrics(header),
            navCapsule: getMetrics(navCapsule),
            logoIcon: getMetrics(logoIcon),
            wordmark: getMetrics(wordmark),
            wordmarkHue: getMetrics(wordmarkHue),
            wordmarkTravel: getMetrics(wordmarkTravel),
            navPillsCount: navPills.length,
            sampleNavPillFont: navPills[0] ? window.getComputedStyle(navPills[0]).fontSize : null,
            h1: getMetrics(h1),
            ctaBtn: getMetrics(ctaBtn),
            dock: getMetrics(dock)
          };
        })()
      `,
      returnByValue: true
    });

    const data = evalRes.result?.result?.value ?? evalRes.result?.value;
    afterData[vp.name] = data;

    // Full page screenshot
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(EVIDENCE_DIR, `after-home-${vp.name}.png`), Buffer.from(shot.result.data, 'base64'));

    // Brand lockup clip
    if (data.brandLink || (data.logoIcon && data.wordmark)) {
      const x = Math.max(0, data.logoIcon.x - 10);
      const y = Math.max(0, data.logoIcon.y - 10);
      const w = Math.min(vp.width - x, (data.wordmark.x + data.wordmark.width) - x + 20);
      const h = Math.max(data.logoIcon.height, data.wordmark.height) + 20;

      const bShot = await send('Page.captureScreenshot', {
        format: 'png',
        clip: { x, y, width: w, height: h, scale: 1 }
      });
      fs.writeFileSync(path.join(EVIDENCE_DIR, `after-brand-lockup-${vp.name}.png`), Buffer.from(bShot.result.data, 'base64'));
    }

    // Top Header clip (Region commented by user)
    if (vp.name !== '390') {
      const topHeaderShot = await send('Page.captureScreenshot', {
        format: 'png',
        clip: { x: 0, y: 0, width: vp.width, height: 110, scale: 1 }
      });
      fs.writeFileSync(path.join(EVIDENCE_DIR, `after-top-header-${vp.name}.png`), Buffer.from(topHeaderShot.result.data, 'base64'));
    }

    console.log(`Viewport ${vp.name} summary:`, {
      windowH: data.viewport.height,
      outerPanelTop: data.outerPanel?.top,
      headerTop: data.header?.top,
      capsuleTop: data.navCapsule?.top,
      capsuleH: data.navCapsule?.height,
      logoTop: data.logoIcon?.top,
      logoSize: `${data.logoIcon?.width}x${data.logoIcon?.height}`,
      wordmarkHue: data.wordmarkHue?.fontSize,
      wordmarkTravel: data.wordmarkTravel?.fontSize,
      navPillFont: data.sampleNavPillFont,
      gapCtaToDock: (data.dock && data.ctaBtn) ? Math.round(data.dock.top - data.ctaBtn.bottom) : null,
      dockBottom: data.dock?.bottom,
      hasVerticalScroll: data.viewport.hasVerticalScroll
    });
  }

  fs.writeFileSync(path.join(EVIDENCE_DIR, 'after-measurements-v2.json'), JSON.stringify(afterData, null, 2));
  console.log('\nAFTER V2 measurements complete!');

  ws.close();
  edgeProc.kill();
}

run().catch(err => {
  console.error('Error in V2 measurement:', err);
  process.exit(1);
});
