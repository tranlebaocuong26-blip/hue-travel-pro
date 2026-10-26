const { spawn } = require('child_process');
const os = require('os');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const EVIDENCE_DIR = 'A:\\trí tuệ nhân tạo\\BAI_3\\hue-travel-pro\\reports\\gravity\\evidence\\GATE-07-03D';

const VIEWPORTS = [
  { name: '1366', width: 1366, height: 768, scale: 1, mobile: false },
  { name: '1440', width: 1440, height: 900, scale: 1, mobile: false },
  { name: '1650', width: 1650, height: 786, scale: 1, mobile: false },
  { name: '1920', width: 1920, height: 1080, scale: 1, mobile: false },
  { name: '390', width: 390, height: 844, scale: 3, mobile: true }
];

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function run() {
  const edge = spawn(EDGE_PATH, [
    '--headless=new',
    '--remote-debugging-port=9235',
    '--user-data-dir=' + path.join(os.tmpdir(), 'edge_meas2_' + Date.now()),
    'about:blank'
  ]);
  await sleep(1500);

  const res = await fetch('http://127.0.0.1:9235/json/list');
  const [t] = await res.json();
  const ws = new WebSocket(t.webSocketDebuggerUrl);
  let id = 1;
  const map = new Map();
  ws.onmessage = e => {
    const m = JSON.parse(e.data);
    if (m.id && map.has(m.id)) {
      map.get(m.id)(m);
      map.delete(m.id);
    }
  };
  await new Promise(r => ws.onopen = r);
  const send = (method, params) => new Promise(res => {
    const i = id++;
    map.set(i, res);
    ws.send(JSON.stringify({ id: i, method, params }));
  });
  await send('Page.enable');
  await send('Runtime.enable');

  const results = {};

  for (const vp of VIEWPORTS) {
    await send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: vp.scale,
      mobile: vp.mobile
    });
    await send('Page.navigate', { url: 'http://localhost:3000/' });
    await sleep(1800);

    const evalRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const nav = document.getElementById("desktop-adaptive-nav");
        const cta = document.querySelector('main a[href="/kham-pha"]');
        const header = document.querySelector("header");
        const logoImg = header ? header.querySelector("img") : null;
        const logoHue = header ? header.querySelector("span.font-serif") : null;
        const logoTravel = header ? header.querySelector("span.uppercase") : null;
        const cards = Array.from(document.querySelectorAll("main h3")).map(h => h.innerText.trim());
        const capsuleLinks = nav ? Array.from(nav.querySelectorAll("#capsule-content-layer a")).map(a => a.innerText.trim()).filter(Boolean) : [];
        const body = document.body;
        
        return JSON.stringify({
          viewport: { w: window.innerWidth, h: window.innerHeight },
          scroll: {
            scrollH: document.documentElement.scrollHeight,
            clientH: document.documentElement.clientHeight,
            hasVerticalScroll: document.documentElement.scrollHeight > document.documentElement.clientHeight
          },
          nav: nav ? {
            width: window.getComputedStyle(nav).width,
            left: window.getComputedStyle(nav).left,
            top: window.getComputedStyle(nav).top,
            height: window.getComputedStyle(nav).height,
            items: capsuleLinks
          } : null,
          logo: logoImg ? {
            imgW: logoImg.getBoundingClientRect().width,
            imgH: logoImg.getBoundingClientRect().height,
            hueFontSize: logoHue ? window.getComputedStyle(logoHue).fontSize : null,
            travelFontSize: logoTravel ? window.getComputedStyle(logoTravel).fontSize : null
          } : null,
          cta: cta ? {
            text: cta.innerText.trim(),
            bg: window.getComputedStyle(cta).backgroundColor,
            color: window.getComputedStyle(cta).color
          } : null,
          cards: cards
        });
      })()`,
      returnByValue: true
    });

    results[vp.name] = JSON.parse(evalRes.result.result.value);

    const shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(EVIDENCE_DIR, `after-overhaul-${vp.name}.png`), Buffer.from(shot.result.data, 'base64'));
    console.log(`Saved after-overhaul-${vp.name}.png`);
  }

  fs.writeFileSync(path.join(EVIDENCE_DIR, 'final-dom-measurements.json'), JSON.stringify(results, null, 2));
  console.log('Final DOM measurements:', JSON.stringify(results, null, 2));

  ws.close();
  edge.kill();
}

run().catch(console.error);
