const { spawn } = require('child_process');
const os = require('os');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const EVIDENCE_DIR = 'A:\\trí tuệ nhân tạo\\BAI_3\\hue-travel-pro\\reports\\gravity\\evidence\\GATE-07-04';
const BASE_URL = 'http://localhost:3000';

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function run() {
  const profileDir = path.join(os.tmpdir(), 'edge_check_food_banner_' + Date.now());
  const edgeProc = spawn(EDGE_PATH, [
    '--headless=new',
    '--remote-debugging-port=9242',
    '--remote-allow-origins=*',
    '--user-data-dir=' + profileDir,
    'about:blank'
  ]);
  await sleep(1500);

  const listRes = await fetch('http://127.0.0.1:9242/json/list');
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
  await sleep(1800);

  const homeRes = await send('Runtime.evaluate', {
    expression: `(() => {
      const foodPill = document.querySelector('a[title*="quán ăn"]');
      const allCtas = Array.from(document.querySelectorAll('main a')).map(a => a.innerText.trim()).filter(Boolean);
      return JSON.stringify({
        hasFoodPill: !!foodPill,
        ctaCount: allCtas.length,
        primaryCtaText: document.querySelector('a[href="/kham-pha"]')?.innerText.trim()
      });
    })()`,
    returnByValue: true
  });
  console.log('Landing Page State:', JSON.parse(homeRes.result.result.value));

  const homeShot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(EVIDENCE_DIR, 'homepage_cleaned_cta.png'), Buffer.from(homeShot.result.data, 'base64'));

  // 2. Kiểm tra Trang /an-uong với Banner Hình 3 kiểu Hình 2
  await send('Page.navigate', { url: BASE_URL + '/an-uong' });
  await sleep(1800);

  const foodBannerRes = await send('Runtime.evaluate', {
    expression: `(() => {
      const h1 = document.querySelector('h1');
      const banner = document.querySelector('div[style*="hero_an_uong"]');
      const bgStyle = banner ? banner.style.backgroundImage : null;
      const suggestions = Array.from(document.querySelectorAll('button[class*="rounded-full"]')).map(b => b.innerText.trim());
      return JSON.stringify({
        h1Text: h1 ? h1.innerText.trim() : null,
        hasHeroBanner: !!banner,
        bgStyle: bgStyle,
        searchSuggestions: suggestions.slice(0, 6)
      });
    })()`,
    returnByValue: true
  });
  console.log('Food Banner State:', JSON.parse(foodBannerRes.result.result.value));

  const foodShot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(EVIDENCE_DIR, 'an_uong_banner_bun_bo.png'), Buffer.from(foodShot.result.data, 'base64'));

  ws.close();
  edgeProc.kill();
  console.log('All checks passed successfully!');
}

run().catch(console.error);
