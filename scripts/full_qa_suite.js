const { spawn } = require('child_process');
const os = require('os');
const path = require('path');
const fs = require('fs');

async function main() {
  const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.join(os.tmpdir(), 'edge_qa_' + Date.now());
  const edgeProc = spawn(edge, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--remote-allow-origins=*',
    '--user-data-dir=' + profileDir,
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1500));

  const listRes = await fetch('http://127.0.0.1:9222/json/list');
  const targets = await listRes.json();
  const pageTarget = targets.find(t => t.type === 'page') || targets[0];

  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

  let idCounter = 1;
  const pending = new Map();
  const consoleLogs = [];

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.method === 'Runtime.consoleAPICalled') {
      consoleLogs.push({
        type: msg.params.type,
        args: msg.params.args.map(a => a.value || a.description)
      });
    }
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
  await send('Runtime.enable');

  const screenshotsDir = 'A:\\trí tuệ nhân tạo\\BAI_3\\screenshots';
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const results = [];

  async function testView(name, url, width, height, saveScreenshotPath) {
    await send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: width < 900
    });

    await send('Page.navigate', { url });
    await new Promise(r => setTimeout(r, 1200));

    const check = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const docScroll = document.documentElement.scrollWidth;
          const bodyScroll = document.body.scrollWidth;
          const winWidth = window.innerWidth;
          
          const overflowing = [];
          const all = document.querySelectorAll('*');
          for (const el of all) {
            const rect = el.getBoundingClientRect();
            if (rect.right > winWidth + 1.5) {
              overflowing.push({
                tag: el.tagName,
                id: el.id,
                className: el.className ? (typeof el.className === 'string' ? el.className.slice(0, 80) : '') : '',
                text: el.innerText ? el.innerText.slice(0, 30).replace(/\\n/g, ' ') : '',
                rect: { left: Math.round(rect.left), right: Math.round(rect.right), width: Math.round(rect.width) }
              });
            }
          }

          // Check bottom nav items on mobile
          let navItemsCount = 0;
          let navVisible = false;
          const nav = document.querySelector('nav[aria-label="Điều hướng di động chính"]');
          if (nav) {
            navVisible = true;
            navItemsCount = nav.querySelectorAll('a').length;
          }

          return {
            winWidth,
            docScroll,
            bodyScroll,
            hasHorizontalOverflow: docScroll > winWidth,
            overflowElementsCount: overflowing.length,
            overflowingSample: overflowing.slice(0, 5),
            navVisible,
            navItemsCount
          };
        })()
      `,
      returnByValue: true
    });

    const evalData = check.result && check.result.result ? check.result.result.value : null;

    if (saveScreenshotPath) {
      const shot = await send('Page.captureScreenshot', { format: 'png' });
      const buffer = Buffer.from(shot.result.data, 'base64');
      fs.writeFileSync(saveScreenshotPath, buffer);
    }

    results.push({
      name,
      url,
      width,
      height,
      evalData,
      screenshot: saveScreenshotPath ? path.basename(saveScreenshotPath) : null
    });
  }

  // 1. 5 Desktop Screens (1280x820)
  console.log('Capturing Desktop 1280x820 screens...');
  await testView('Desktop - Trang chủ', 'http://localhost:3005/', 1280, 820, path.join(screenshotsDir, 'final_01_trang_chu_desktop.png'));
  await testView('Desktop - Về Huế', 'http://localhost:3005/ve-hue', 1280, 820, path.join(screenshotsDir, 'final_02_ve_hue_desktop.png'));
  await testView('Desktop - Khám phá', 'http://localhost:3005/kham-pha', 1280, 820, path.join(screenshotsDir, 'final_03_kham_pha_desktop.png'));
  await testView('Desktop - Cẩm nang', 'http://localhost:3005/cam-nang', 1280, 820, path.join(screenshotsDir, 'final_04_cam_nang_desktop.png'));
  await testView('Desktop - Lưu trú', 'http://localhost:3005/luu-tru', 1280, 820, path.join(screenshotsDir, 'final_05_luu_tru_desktop.png'));

  // 2. Mobile Viewports (320px, 375px, 390px) & Tablet (768px) for Khám phá
  console.log('Capturing Mobile & Tablet screens for Khám phá...');
  await testView('Mobile 320px - Khám phá', 'http://localhost:3005/kham-pha', 320, 568, path.join(screenshotsDir, 'final_06_kham_pha_320px.png'));
  await testView('Mobile 375px - Khám phá', 'http://localhost:3005/kham-pha', 375, 667, path.join(screenshotsDir, 'final_07_kham_pha_375px.png'));
  await testView('Mobile 390px - Khám phá', 'http://localhost:3005/kham-pha', 390, 844, path.join(screenshotsDir, 'final_08_kham_pha_390px.png'));
  await testView('Tablet 768px - Khám phá', 'http://localhost:3005/kham-pha', 768, 1024, path.join(screenshotsDir, 'final_09_kham_pha_768px.png'));

  // 3. Mobile 390px for other pages to ensure 100% compliance
  console.log('Verifying other pages on Mobile 390px...');
  await testView('Mobile 390px - Trang chủ', 'http://localhost:3005/', 390, 844, path.join(screenshotsDir, 'final_10_trang_chu_390px.png'));
  await testView('Mobile 390px - Về Huế', 'http://localhost:3005/ve-hue', 390, 844, path.join(screenshotsDir, 'final_11_ve_hue_390px.png'));
  await testView('Mobile 390px - Cẩm nang', 'http://localhost:3005/cam-nang', 390, 844, path.join(screenshotsDir, 'final_12_cam_nang_390px.png'));
  await testView('Mobile 390px - Lưu trú', 'http://localhost:3005/luu-tru', 390, 844, path.join(screenshotsDir, 'final_13_luu_tru_390px.png'));

  // 4. Test Navigation & History (Back / Forward)
  console.log('Testing Navigation and History Back/Forward...');
  await send('Page.navigate', { url: 'http://localhost:3005/' });
  await new Promise(r => setTimeout(r, 600));
  await send('Page.navigate', { url: 'http://localhost:3005/kham-pha' });
  await new Promise(r => setTimeout(r, 600));
  
  // Test History Back via JS
  await send('Runtime.evaluate', { expression: 'window.history.back()' });
  await new Promise(r => setTimeout(r, 800));
  const backUrl = await send('Runtime.evaluate', { expression: 'window.location.pathname' });
  
  // Test History Forward via JS
  await send('Runtime.evaluate', { expression: 'window.history.forward()' });
  await new Promise(r => setTimeout(r, 800));
  const forwardUrl = await send('Runtime.evaluate', { expression: 'window.location.pathname' });

  const navTestResult = {
    backUrl: backUrl.result.result.value,
    forwardUrl: forwardUrl.result.result.value,
    passed: backUrl.result.result.value === '/' && forwardUrl.result.result.value === '/kham-pha'
  };

  const finalReportData = {
    results,
    consoleLogs,
    navTestResult
  };

  fs.writeFileSync('A:\\trí tuệ nhân tạo\\BAI_3\\qa_test_results.json', JSON.stringify(finalReportData, null, 2));
  console.log('\n=== FULL QA SUITE COMPLETED SUCCESSFULLY ===');
  console.log(JSON.stringify(results.map(r => ({
    name: r.name,
    winWidth: r.evalData ? r.evalData.winWidth : null,
    docScroll: r.evalData ? r.evalData.docScroll : null,
    hasOverflow: r.evalData ? r.evalData.hasHorizontalOverflow : null,
    navCount: r.evalData ? r.evalData.navItemsCount : null
  })), null, 2));

  ws.close();
  edgeProc.kill();
}

main().catch(console.error);
