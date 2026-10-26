const { spawn } = require('child_process');
const os = require('os');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const EVIDENCE_DIR = 'A:\\trí tuệ nhân tạo\\BAI_3\\hue-travel-pro\\reports\\gravity\\evidence\\GATE-07-04';
const BASE_URL = 'http://localhost:3000';

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function run() {
  const profileDir = path.join(os.tmpdir(), 'edge_anuong_' + Date.now());
  const edgeProc = spawn(EDGE_PATH, [
    '--headless=new',
    '--remote-debugging-port=9241',
    '--remote-allow-origins=*',
    '--user-data-dir=' + profileDir,
    'about:blank'
  ]);
  await sleep(1500);

  const listRes = await fetch('http://127.0.0.1:9241/json/list');
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

  // 1. Kiểm tra Trang chủ (1440x900)
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: BASE_URL + '/' });
  await sleep(2000);

  const homeRes = await send('Runtime.evaluate', {
    expression: `(() => {
      const nav = document.getElementById("desktop-adaptive-nav");
      const items = nav ? Array.from(nav.querySelectorAll("#capsule-content-layer a")).map(a => ({ text: a.innerText.trim(), href: a.getAttribute("href") })) : [];
      const foodCta = document.querySelector('a[href="/an-uong"]');
      const foodCard = document.querySelector('main a[href="/an-uong"] h3');
      return JSON.stringify({
        capsuleItems: items,
        hasFoodCta: !!foodCta,
        card3Text: foodCard ? foodCard.innerText.trim() : null
      });
    })()`,
    returnByValue: true
  });
  console.log('Homepage DOM Check:', JSON.parse(homeRes.result.result.value));

  const homeShot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(EVIDENCE_DIR, 'homepage_with_an_uong_nav.png'), Buffer.from(homeShot.result.data, 'base64'));

  // 2. Kiểm tra Trang /an-uong
  await send('Page.navigate', { url: BASE_URL + '/an-uong' });
  await sleep(2000);

  const anUongRes = await send('Runtime.evaluate', {
    expression: `(() => {
      const nav = document.getElementById("desktop-adaptive-nav");
      const h1 = document.querySelector("h1");
      const cards = Array.from(document.querySelectorAll("h3")).map(h => h.innerText.trim());
      const categoryButtons = Array.from(document.querySelectorAll("button")).map(b => b.innerText.trim()).filter(Boolean);
      return JSON.stringify({
        morphState: nav ? nav.getAttribute("data-morph-state") : null,
        navWidth: nav ? window.getComputedStyle(nav).width : null,
        h1Text: h1 ? h1.innerText.trim() : null,
        foodCardsCount: cards.length,
        foodNames: cards.slice(0, 5),
        sampleCategories: categoryButtons.slice(0, 6)
      });
    })()`,
    returnByValue: true
  });
  const anUongData = JSON.parse(anUongRes.result.result.value);
  console.log('An Uong Subpage DOM Check:', anUongData);

  const anUongShot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(EVIDENCE_DIR, 'an_uong_subpage.png'), Buffer.from(anUongShot.result.data, 'base64'));

  ws.close();
  edgeProc.kill();
  console.log('Verification completed successfully!');
}

run().catch(console.error);
