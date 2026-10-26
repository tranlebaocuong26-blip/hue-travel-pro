const { spawn } = require('child_process');
const os = require('os');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const EVIDENCE_DIR = 'A:\\trí tuệ nhân tạo\\BAI_3\\hue-travel-pro\\reports\\gravity\\evidence\\GATE-07-03D';

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function run() {
  const edge = spawn(EDGE_PATH, [
    '--headless=new',
    '--remote-debugging-port=9238',
    '--user-data-dir=' + path.join(os.tmpdir(), 'edge_verify_' + Date.now()),
    'about:blank'
  ]);
  await sleep(1500);

  const res = await fetch('http://127.0.0.1:9238/json/list');
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

  const measurements = {};

  for (const [w, h, name] of [[1366, 768, '1366'], [1440, 900, '1440'], [1920, 1080, '1920'], [390, 844, '390']]) {
    await send('Emulation.setDeviceMetricsOverride', {
      width: w,
      height: h,
      deviceScaleFactor: (name === '390' ? 3 : 1),
      mobile: (name === '390')
    });
    await send('Page.navigate', { url: 'http://localhost:3000/' });
    await sleep(1800);

    const evalRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const header = document.querySelector("header");
        const logoImg = header ? header.querySelector("img") : null;
        const logoHue = header ? header.querySelector("span.font-serif") : null;
        const logoTravel = header ? header.querySelector("span.uppercase") : null;
        const h1Hue = document.querySelector("main h1");
        const divTravel = h1Hue ? h1Hue.nextElementSibling : null;
        const pScript = divTravel ? divTravel.nextElementSibling.querySelector("p") : null;

        return JSON.stringify({
          viewport: { w: window.innerWidth, h: window.innerHeight },
          scroll: {
            scrollH: document.documentElement.scrollHeight,
            clientH: document.documentElement.clientHeight,
            hasVerticalScroll: document.documentElement.scrollHeight > document.documentElement.clientHeight
          },
          logo: logoImg ? {
            imgW: logoImg.getBoundingClientRect().width,
            imgH: logoImg.getBoundingClientRect().height,
            hueFontSize: logoHue ? window.getComputedStyle(logoHue).fontSize : null,
            travelFontSize: logoTravel ? window.getComputedStyle(logoTravel).fontSize : null
          } : null,
          headings: {
            hue: h1Hue ? {
              text: h1Hue.innerText.trim(),
              fontSize: window.getComputedStyle(h1Hue).fontSize,
              fontFamily: window.getComputedStyle(h1Hue).fontFamily
            } : null,
            travelPro: divTravel ? {
              text: divTravel.innerText.trim(),
              fontSize: window.getComputedStyle(divTravel).fontSize,
              fontFamily: window.getComputedStyle(divTravel).fontFamily
            } : null,
            script: pScript ? {
              text: pScript.innerText.trim(),
              fontSize: window.getComputedStyle(pScript).fontSize,
              fontFamily: window.getComputedStyle(pScript).fontFamily
            } : null
          }
        });
      })()`,
      returnByValue: true
    });

    measurements[name] = JSON.parse(evalRes.result.result.value);

    const shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(EVIDENCE_DIR, `verify-after-${name}.png`), Buffer.from(shot.result.data, 'base64'));
    console.log(`Saved verify-after-${name}.png`);
  }

  fs.writeFileSync(path.join(EVIDENCE_DIR, 'verify-user-req-measurements.json'), JSON.stringify(measurements, null, 2));
  console.log('Measurements:', JSON.stringify(measurements, null, 2));

  ws.close();
  edge.kill();
}

run().catch(console.error);
