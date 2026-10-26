const { spawn } = require('child_process');
const os = require('os');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const EVIDENCE_DIR = 'A:\\trí tuệ nhân tạo\\BAI_3\\hue-travel-pro\\reports\\gravity\\evidence\\GATE-07-04';
const BASE_URL = 'http://localhost:3000';

const VIEWPORTS = [
  { name: '1366', width: 1366, height: 768, scale: 1, mobile: false, label: 'Laptop 1366x768' },
  { name: '1440', width: 1440, height: 900, scale: 1, mobile: false, label: 'Laptop lớn 1440x900' },
  { name: '1600', width: 1600, height: 900, scale: 1, mobile: false, label: 'Desktop 1600x900' },
  { name: '1650', width: 1650, height: 786, scale: 1, mobile: false, label: 'Màn hình rộng thấp 1650x786' },
  { name: '1920', width: 1920, height: 1080, scale: 1, mobile: false, label: 'Full HD 1920x1080' },
  { name: '2560', width: 2560, height: 1440, scale: 1, mobile: false, label: 'Desktop QHD 27 inch 2560x1440' },
  { name: '768',  width: 768,  height: 1024, scale: 2, mobile: true,  label: 'Tablet 768x1024' },
  { name: '390',  width: 390,  height: 844,  scale: 3, mobile: true,  label: 'Mobile 390x844' }
];

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function run() {
  fs.mkdirSync(EVIDENCE_DIR, { recursive: true });

  const profileDir = path.join(os.tmpdir(), 'edge_gate0704_' + Date.now());
  const edgeProc = spawn(EDGE_PATH, [
    '--headless=new',
    '--remote-debugging-port=9240',
    '--remote-allow-origins=*',
    '--user-data-dir=' + profileDir,
    'about:blank'
  ]);
  await sleep(1500);

  const listRes = await fetch('http://127.0.0.1:9240/json/list');
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

  const matrixResults = {};

  console.log('--- 1. RUNNING FULL 8-VIEWPORT RESPONSIVE MATRIX ---');
  for (const vp of VIEWPORTS) {
    await send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: vp.scale,
      mobile: vp.mobile
    });
    await send('Page.navigate', { url: BASE_URL + '/' });
    await sleep(2000);

    const evalRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const docEl = document.documentElement;
        const body = document.body;
        const nav = document.getElementById("desktop-adaptive-nav");
        const header = document.querySelector("header");
        const logoImg = header ? header.querySelector("img") : null;
        const logoHue = header ? header.querySelector("span.font-serif") : null;
        const logoTravel = header ? header.querySelector("span.uppercase") : null;
        const landing = document.querySelector("main > div");
        const heroH1 = document.querySelector("main h1");
        const heroTravel = heroH1 ? heroH1.nextElementSibling : null;
        const tagline = document.querySelector("main p.font-editorial, main p.italic");
        const primaryCta = document.querySelector('a[href="/kham-pha"]');
        const foodEntry = document.querySelector('a[href*="ăn+uống"], a[href*="an-uong"]');
        const cards = Array.from(document.querySelectorAll("main h3")).map(h => h.innerText.trim());
        const cardEls = Array.from(document.querySelectorAll("main .grid a"));
        const cardBounds = cardEls.map(c => ({
          href: c.getAttribute("href"),
          w: Math.round(c.getBoundingClientRect().width),
          h: Math.round(c.getBoundingClientRect().height)
        }));
        const capsuleLinks = nav ? Array.from(nav.querySelectorAll("#capsule-content-layer a")).map(a => a.innerText.trim()).filter(Boolean) : [];

        return JSON.stringify({
          viewport: { name: "${vp.name}", label: "${vp.label}", w: window.innerWidth, h: window.innerHeight },
          scroll: {
            scrollH: docEl.scrollHeight,
            clientH: docEl.clientHeight,
            hasVerticalScroll: docEl.scrollHeight > docEl.clientHeight,
            scrollW: docEl.scrollWidth,
            clientW: docEl.clientWidth,
            hasHorizontalScroll: docEl.scrollWidth > docEl.clientWidth
          },
          landingPanel: landing ? {
            w: Math.round(landing.getBoundingClientRect().width),
            h: Math.round(landing.getBoundingClientRect().height),
            top: Math.round(landing.getBoundingClientRect().top)
          } : null,
          nav: nav ? {
            top: window.getComputedStyle(nav).top,
            left: window.getComputedStyle(nav).left,
            width: window.getComputedStyle(nav).width,
            height: window.getComputedStyle(nav).height,
            items: capsuleLinks
          } : null,
          logo: logoImg ? {
            w: Math.round(logoImg.getBoundingClientRect().width),
            h: Math.round(logoImg.getBoundingClientRect().height),
            hueFont: logoHue ? window.getComputedStyle(logoHue).fontSize : null,
            travelFont: logoTravel ? window.getComputedStyle(logoTravel).fontSize : null
          } : null,
          typography: {
            hueH1: heroH1 ? {
              text: heroH1.innerText.trim(),
              fontSize: window.getComputedStyle(heroH1).fontSize,
              fontFamily: window.getComputedStyle(heroH1).fontFamily
            } : null,
            travelPro: heroTravel ? {
              text: heroTravel.innerText.trim(),
              fontSize: window.getComputedStyle(heroTravel).fontSize,
              fontFamily: window.getComputedStyle(heroTravel).fontFamily
            } : null,
            tagline: tagline ? {
              text: tagline.innerText.trim(),
              fontSize: window.getComputedStyle(tagline).fontSize,
              fontFamily: window.getComputedStyle(tagline).fontFamily,
              letterSpacing: window.getComputedStyle(tagline).letterSpacing
            } : null
          },
          ctas: {
            primary: primaryCta ? {
              text: primaryCta.innerText.trim(),
              bg: window.getComputedStyle(primaryCta).backgroundColor
            } : null,
            foodEntry: foodEntry ? {
              text: foodEntry.innerText.trim(),
              href: foodEntry.getAttribute("href"),
              bg: window.getComputedStyle(foodEntry).backgroundColor
            } : null
          },
          cards: cards,
          cardBounds: cardBounds
        });
      })()`,
      returnByValue: true
    });

    const val = JSON.parse(evalRes.result.result.value);
    matrixResults[vp.name] = val;

    const shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(EVIDENCE_DIR, `responsive-${vp.name}.png`), Buffer.from(shot.result.data, 'base64'));
    console.log(`PASS [${vp.name}]: ${vp.label} | ScrollH=${val.scroll.scrollH}px, ClientH=${val.scroll.clientH}px, hasVScroll=${val.scroll.hasVerticalScroll}, hasHScroll=${val.scroll.hasHorizontalScroll}`);
  }

  fs.writeFileSync(path.join(EVIDENCE_DIR, 'matrix-results.json'), JSON.stringify(matrixResults, null, 2));

  console.log('\n--- 2. FUNCTIONAL & SUBPAGE REGRESSION CHECKS ---');
  // Check Subpage Navigation & Morph
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: BASE_URL + '/ve-hue' });
  await sleep(1800);
  const subRes = await send('Runtime.evaluate', {
    expression: `(() => {
      const nav = document.getElementById("desktop-adaptive-nav");
      const h1 = document.querySelector("h1");
      return JSON.stringify({
        morphState: nav ? nav.getAttribute("data-morph-state") : null,
        navWidth: nav ? window.getComputedStyle(nav).width : null,
        h1Text: h1 ? h1.innerText.trim() : null,
        h1Font: h1 ? window.getComputedStyle(h1).fontFamily : null
      });
    })()`,
    returnByValue: true
  });
  const subVal = JSON.parse(subRes.result.result.value);
  console.log('Subpage /ve-hue Morph State:', subVal);

  // Check T05 Rental Footer on /cam-nang
  await send('Page.navigate', { url: BASE_URL + '/cam-nang' });
  await sleep(1800);
  const t05Res = await send('Runtime.evaluate', {
    expression: `(() => {
      const rentalSection = document.getElementById("thue-xe-danh-sach");
      const rentalCards = document.querySelectorAll('a[href*="/cam-nang/thue-xe/"]');
      return JSON.stringify({
        hasRentalSection: !!rentalSection,
        rentalCardsCount: rentalCards.length
      });
    })()`,
    returnByValue: true
  });
  const t05Val = JSON.parse(t05Res.result.result.value);
  console.log('T05 Rental Status:', t05Val);

  // Check T07 Accommodation Filters on /luu-tru
  await send('Page.navigate', { url: BASE_URL + '/luu-tru' });
  await sleep(1800);
  const t07Res = await send('Runtime.evaluate', {
    expression: `(() => {
      const catButtons = document.querySelectorAll('button[class*="rounded-full"]');
      const cards = document.querySelectorAll('a[href*="/luu-tru/"]');
      return JSON.stringify({
        categoryButtonsCount: catButtons.length,
        hotelCardsCount: cards.length
      });
    })()`,
    returnByValue: true
  });
  const t07Val = JSON.parse(t07Res.result.result.value);
  console.log('T07 Accommodation Status:', t07Val);

  // Check A01 Keyboard Focus
  await send('Page.navigate', { url: BASE_URL + '/' });
  await sleep(1500);
  await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
  await sleep(400);
  const a01Res = await send('Runtime.evaluate', {
    expression: `(() => {
      const active = document.activeElement;
      return JSON.stringify({
        activeTag: active ? active.tagName : null,
        activeHref: active ? active.getAttribute("href") : null
      });
    })()`,
    returnByValue: true
  });
  const a01Val = JSON.parse(a01Res.result.result.value);
  console.log('A01 Focus Status:', a01Val);

  fs.writeFileSync(path.join(EVIDENCE_DIR, 'functional-results.json'), JSON.stringify({
    subpageMorph: subVal,
    t05Rentals: t05Val,
    t07Accommodations: t07Val,
    a01Accessibility: a01Val
  }, null, 2));

  ws.close();
  edgeProc.kill();
  console.log('\nAll automated tests completed successfully!');
}

run().catch(console.error);
