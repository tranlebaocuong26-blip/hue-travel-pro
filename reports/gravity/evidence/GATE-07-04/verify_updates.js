const { spawn } = require('child_process');
const os = require('os');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const EVIDENCE_DIR = 'A:\\trí tuệ nhân tạo\\BAI_3\\hue-travel-pro\\reports\\gravity\\evidence\\GATE-07-04';
const BASE_URL = 'http://localhost:3000';

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function run() {
  const profileDir = path.join(os.tmpdir(), 'edge_check_cards_' + Date.now());
  const edgeProc = spawn(EDGE_PATH, [
    '--headless=new',
    '--remote-debugging-port=9243',
    '--remote-allow-origins=*',
    '--user-data-dir=' + profileDir,
    'about:blank'
  ]);
  await sleep(1500);

  const listRes = await fetch('http://127.0.0.1:9243/json/list');
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
  await send('Runtime.enable');

  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: BASE_URL + '/' });
  await sleep(2000);

  // Capture full homepage
  const homeShot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(EVIDENCE_DIR, 'homepage_with_new_cards.png'), Buffer.from(homeShot.result.data, 'base64'));

  // Get DOM bounds of Tagline and Cards
  const domRes = await send('Runtime.evaluate', {
    expression: `(() => {
      const taglineP = document.querySelector('p.font-editorial');
      const card1 = document.querySelector('a[href="/kham-pha"]');
      const card2 = document.querySelectorAll('a[href="/kham-pha"]')[1];
      const card1Img = card1 ? card1.querySelector('img') : null;
      const card2Img = card2 ? card2.querySelector('img') : null;
      return JSON.stringify({
        tagline: taglineP ? {
          text: taglineP.innerText.trim(),
          rect: taglineP.getBoundingClientRect()
        } : null,
        card1: card1Img ? card1Img.getAttribute('src') : null,
        card2: card2Img ? card2Img.getAttribute('src') : null
      });
    })()`,
    returnByValue: true
  });
  console.log('DOM check:', JSON.parse(domRes.result.result.value));

  ws.close();
  edgeProc.kill();
  console.log('Screenshot and checks saved successfully!');
}

run().catch(console.error);
