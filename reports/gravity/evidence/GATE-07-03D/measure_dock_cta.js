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

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function run() {
  const profileDir = path.join(os.tmpdir(), 'edge_meas_' + Date.now());
  const edgeProc = spawn(EDGE_PATH, [
    '--headless=new',
    '--remote-debugging-port=9225',
    '--remote-allow-origins=*',
    '--user-data-dir=' + profileDir,
    'about:blank'
  ]);
  await sleep(1500);

  const listRes = await fetch('http://127.0.0.1:9225/json/list');
  const targets = await listRes.json();
  const pageTarget = targets.find(t => t.type === 'page') || targets[0];
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

  let idCounter = 1;
  const pending = new Map();
  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    }
  };
  await new Promise(r => ws.onopen = r);

  function send(method, params = {}) {
    return new Promise(res => {
      const id = idCounter++;
      pending.set(id, res);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await send('Page.enable');
  await send('DOM.enable');

  const out = {};
  for (const vp of VIEWPORTS) {
    await send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: vp.scale,
      mobile: vp.mobile
    });
    await send('Page.navigate', { url: BASE_URL + '/' });
    await sleep(1500);

    const res = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const cta = Array.from(document.querySelectorAll('a')).find(a => a.innerText.includes('Khám phá Huế ngay'));
          const dock = Array.from(document.querySelectorAll('div')).find(d => d.className && d.className.includes('backdrop-blur-md') && d.querySelector('a[href*="/kham-pha"]'));
          const header = document.querySelector('header.hidden.md\\\\:flex');
          const brandLink = header ? header.querySelector('a[href="/"]') : null;
          const logo = brandLink ? brandLink.querySelector('img') : null;
          const capsule = document.getElementById('desktop-adaptive-nav');
          const outer = document.querySelector('main > div');

          const ctaR = cta ? cta.getBoundingClientRect() : null;
          const dockR = dock ? dock.getBoundingClientRect() : null;
          const logoR = logo ? logo.getBoundingClientRect() : null;
          const capR = capsule ? capsule.getBoundingClientRect() : null;
          const outR = outer ? outer.getBoundingClientRect() : null;

          return {
            windowH: window.innerHeight,
            scrollHeight: document.documentElement.scrollHeight,
            hasVerticalScroll: document.documentElement.scrollHeight > window.innerHeight,
            outerTop: outR ? Math.round(outR.top) : null,
            logoTop: logoR ? Math.round(logoR.top) : null,
            logoSize: logoR ? (Math.round(logoR.width) + 'x' + Math.round(logoR.height)) : null,
            capsuleTop: capR ? Math.round(capR.top) : null,
            capsuleH: capR ? Math.round(capR.height) : null,
            ctaBottom: ctaR ? Math.round(ctaR.bottom * 10) / 10 : null,
            dockTop: dockR ? Math.round(dockR.top * 10) / 10 : null,
            dockBottom: dockR ? Math.round(dockR.bottom * 10) / 10 : null,
            gapCtaToDock: (dockR && ctaR) ? Math.round((dockR.top - ctaR.bottom) * 10) / 10 : null
          };
        })()
      `,
      returnByValue: true
    });
    out[vp.name] = res.result?.result?.value ?? res.result?.value;
    console.log(vp.name, JSON.stringify(out[vp.name]));
  }

  ws.close();
  edgeProc.kill();
  fs.writeFileSync(path.join(EVIDENCE_DIR, 'current-dom-measurements.json'), JSON.stringify(out, null, 2));
}

run();
