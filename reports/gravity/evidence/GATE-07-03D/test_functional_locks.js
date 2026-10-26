const { spawn } = require('child_process');
const os = require('os');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const EVIDENCE_DIR = __dirname;
const BASE_URL = 'http://localhost:3000';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  const profileDir = path.join(os.tmpdir(), 'edge_gates_0703d_' + Date.now());
  const edgeProc = spawn(EDGE_PATH, [
    '--headless=new',
    '--remote-debugging-port=9223',
    '--remote-allow-origins=*',
    '--user-data-dir=' + profileDir,
    'about:blank'
  ]);

  await sleep(1500);

  const listRes = await fetch('http://127.0.0.1:9223/json/list');
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

  await send('Emulation.setDeviceMetricsOverride', {
    width: 1366,
    height: 768,
    deviceScaleFactor: 1,
    mobile: false
  });

  const report = {};

  // 1. Check Home: Brand Lockup, 3 Display Lines, Food Placeholder
  console.log('--- 1. VERIFYING HOME PAGE LOCKS ---');
  await send('Page.navigate', { url: BASE_URL + '/' });
  await sleep(1500);

  const homeLocks = await send('Runtime.evaluate', {
    expression: `
      (() => {
        // Desktop Brand Lockup
        const dBrand = document.querySelector('header.hidden.md\\\\:flex a[href="/"]');
        const dImg = dBrand ? dBrand.querySelector('img') : null;
        const dHue = dBrand ? dBrand.querySelector('.font-brand span:first-child') : null;
        const dTravel = dBrand ? dBrand.querySelector('.font-brand span:last-child') : null;

        // 3 Display Lines
        const h1 = document.querySelector('h1');
        const travelPro = Array.from(document.querySelectorAll('span')).find(s => s.innerText.trim() === 'TRAVEL PRO');
        const hueCoChiHay = Array.from(document.querySelectorAll('p')).find(p => p.innerText.includes('Huế có chi hay'));

        // Food Card Placeholder
        const phCard = Array.from(document.querySelectorAll('div')).find(d => d.innerText.includes('ĐANG CHỜ TƯ LIỆU ẢNH'));
        let phL1 = null, phL2 = null;
        if (phCard) {
          const spans = Array.from(phCard.querySelectorAll('span, p, div')).filter(el => el.children.length === 0);
          phL1 = spans.find(s => s.innerText.includes('ĐANG CHỜ TƯ LIỆU ẢNH'));
          phL2 = spans.find(s => s.innerText.includes('Ẩm thực Cố Đô'));
        }

        return {
          desktopBrand: {
            imgWidth: dImg ? dImg.getBoundingClientRect().width : null,
            imgHeight: dImg ? dImg.getBoundingClientRect().height : null,
            hueFontSize: dHue ? window.getComputedStyle(dHue).fontSize : null,
            travelFontSize: dTravel ? window.getComputedStyle(dTravel).fontSize : null
          },
          displayLines: {
            h1Text: h1 ? h1.innerText.trim() : null,
            h1Font: h1 ? window.getComputedStyle(h1).fontFamily : null,
            travelProText: travelPro ? travelPro.innerText.trim() : null,
            travelProFont: travelPro ? window.getComputedStyle(travelPro).fontFamily : null,
            hueCoChiHayText: hueCoChiHay ? hueCoChiHay.innerText.trim() : null,
            hueCoChiHayFont: hueCoChiHay ? window.getComputedStyle(hueCoChiHay).fontFamily : null
          },
          foodPlaceholder: {
            line1Text: phL1 ? phL1.innerText.trim() : null,
            line1Font: phL1 ? window.getComputedStyle(phL1).fontFamily : null,
            line1Size: phL1 ? window.getComputedStyle(phL1).fontSize : null,
            line1Color: phL1 ? window.getComputedStyle(phL1).color : null,
            line2Text: phL2 ? phL2.innerText.trim() : null,
            line2Font: phL2 ? window.getComputedStyle(phL2).fontFamily : null,
            line2Size: phL2 ? window.getComputedStyle(phL2).fontSize : null,
            line2Color: phL2 ? window.getComputedStyle(phL2).color : null
          }
        };
      })()
    `,
    returnByValue: true
  });
  report.homeLocks = homeLocks.result?.result?.value ?? homeLocks.result?.value;
  console.log('Home Locks Status:', JSON.stringify(report.homeLocks, null, 2));

  // 2. Check Subpage Navigation & Sidebar Brand Lockup
  console.log('\n--- 2. VERIFYING SUBPAGE & SIDEBAR BRAND LOCKUP ---');
  await send('Page.navigate', { url: BASE_URL + '/ve-hue' });
  await sleep(1500);

  const subpageCheck = await send('Runtime.evaluate', {
    expression: `
      (() => {
        // Sidebar Brand Block
        const sBrand = document.querySelector('#sidebar-content-layer a[href="/"]');
        const sImg = sBrand ? sBrand.querySelector('img') : null;
        const sHue = sBrand ? sBrand.querySelector('.font-brand span:first-child') : null;
        const sTravel = sBrand ? sBrand.querySelector('.font-brand span:last-child') : null;

        // Subpage H1 (should be Noto Serif)
        const h1 = document.querySelector('h1');

        return {
          sidebarBrand: {
            imgWidth: sImg ? sImg.getBoundingClientRect().width : null,
            imgHeight: sImg ? sImg.getBoundingClientRect().height : null,
            hueFontSize: sHue ? window.getComputedStyle(sHue).fontSize : null,
            travelFontSize: sTravel ? window.getComputedStyle(sTravel).fontSize : null
          },
          subpageH1: {
            text: h1 ? h1.innerText.trim() : null,
            fontFamily: h1 ? window.getComputedStyle(h1).fontFamily : null
          }
        };
      })()
    `,
    returnByValue: true
  });
  report.subpageCheck = subpageCheck.result?.result?.value ?? subpageCheck.result?.value;
  console.log('Subpage & Sidebar Status:', JSON.stringify(report.subpageCheck, null, 2));

  // 3. T05 - Rental section on /cam-nang
  console.log('\n--- 3. VERIFYING T05: RENTAL FOOTER & CARDS ---');
  await send('Page.navigate', { url: BASE_URL + '/cam-nang' });
  await sleep(1500);

  const t05 = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const rentalSection = document.getElementById('thue-xe-danh-sach');
        const links = Array.from(document.querySelectorAll('a[href*="/cam-nang/thue-xe/"]'));
        return {
          sectionExists: !!rentalSection,
          rentalLinksCount: links.length,
          sampleLink: links[0] ? links[0].getAttribute('href') : null
        };
      })()
    `,
    returnByValue: true
  });
  report.t05 = t05.result?.result?.value ?? t05.result?.value;
  console.log('T05 Status:', JSON.stringify(report.t05, null, 2));

  // 4. T07 - Accommodation filter on /luu-tru
  console.log('\n--- 4. VERIFYING T07: ACCOMMODATION FILTERS ---');
  await send('Page.navigate', { url: BASE_URL + '/luu-tru' });
  await sleep(1500);

  const t07 = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const buttons = Array.from(document.querySelectorAll('button')).filter(b => ['Tất cả', 'Homestay', 'Khách sạn', 'Resort'].some(cat => b.innerText.includes(cat)));
        const cards = Array.from(document.querySelectorAll('a[href*="/luu-tru/"]'));
        return {
          categoryCount: buttons.length,
          totalCards: cards.length
        };
      })()
    `,
    returnByValue: true
  });
  report.t07 = t07.result?.result?.value ?? t07.result?.value;
  console.log('T07 Status:', JSON.stringify(report.t07, null, 2));

  // 5. A01 - Keyboard Accessibility Focus
  console.log('\n--- 5. VERIFYING A01: KEYBOARD FOCUS ---');
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
  await sleep(200);

  const a01 = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const active = document.activeElement;
        const cs = active ? window.getComputedStyle(active) : null;
        return {
          activeTag: active ? active.tagName : null,
          hasOutlineOrRing: !!(cs && (cs.outlineStyle !== 'none' || cs.boxShadow !== 'none'))
        };
      })()
    `,
    returnByValue: true
  });
  report.a01 = a01.result?.result?.value ?? a01.result?.value;
  console.log('A01 Status:', JSON.stringify(report.a01, null, 2));

  // 6. Mobile Brand Lockup
  console.log('\n--- 6. VERIFYING MOBILE BRAND LOCKUP ---');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 3,
    mobile: true
  });
  await send('Page.navigate', { url: BASE_URL + '/' });
  await sleep(1500);

  const mobileBrand = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const mBrand = document.querySelector('header.md\\\\:hidden a[href="/"]');
        const mImg = mBrand ? mBrand.querySelector('img') : null;
        const mHue = mBrand ? mBrand.querySelector('.font-brand span:first-child') : null;
        const mTravel = mBrand ? mBrand.querySelector('.font-brand span:last-child') : null;

        return {
          imgWidth: mImg ? mImg.getBoundingClientRect().width : null,
          imgHeight: mImg ? mImg.getBoundingClientRect().height : null,
          hueFontSize: mHue ? window.getComputedStyle(mHue).fontSize : null,
          travelFontSize: mTravel ? window.getComputedStyle(mTravel).fontSize : null
        };
      })()
    `,
    returnByValue: true
  });
  report.mobileBrand = mobileBrand.result?.result?.value ?? mobileBrand.result?.value;
  console.log('Mobile Brand Status:', JSON.stringify(report.mobileBrand, null, 2));

  fs.writeFileSync(path.join(EVIDENCE_DIR, 'functional-locks-verification.json'), JSON.stringify(report, null, 2));
  console.log('\nALL LOCKS & FUNCTIONAL VERIFICATIONS COMPLETE!');

  ws.close();
  edgeProc.kill();
}

run().catch(err => {
  console.error('Lock verification error:', err);
  process.exit(1);
});
