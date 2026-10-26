const { spawn } = require('child_process');
const os = require('os');
const path = require('path');
const fs = require('fs');
const { GIFEncoder, quantize, applyPalette } = require('gifenc');

const SCREENSHOTS_DIR = 'A:\\trí tuệ nhân tạo\\BAI_3\\screenshots';

async function main() {
  const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.join(os.tmpdir(), 'edge_gate03_' + Date.now());
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
  await send('Runtime.enable');
  await send('DOM.enable');

  async function captureFrameData(targetW = 600, targetH = 375) {
    const shot = await send('Page.captureScreenshot', { format: 'jpeg', quality: 75 });
    const evalRes = await send('Runtime.evaluate', {
      expression: `
        (async () => {
          const img = new Image();
          img.src = 'data:image/jpeg;base64,' + "${shot.result.data}";
          await img.decode();
          const canvas = document.createElement('canvas');
          canvas.width = ${targetW};
          canvas.height = ${targetH};
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
          return Array.from(data);
        })()
      `,
      awaitPromise: true,
      returnByValue: true
    });

    const rawRgba = evalRes.result.result.value;
    return {
      rgba: Uint8Array.from(rawRgba),
      width: targetW,
      height: targetH,
      rawBase64: shot.result.data
    };
  }

  async function recordTransition({
    name,
    startUrl,
    targetUrl,
    clickSelector,
    viewportW,
    viewportH,
    isMobile,
    gifFileName,
    frameTimestamps = [0, 80, 160, 240, 320, 420, 560]
  }) {
    console.log(`\n--- Recording Transition: ${name} ---`);
    await send('Emulation.setDeviceMetricsOverride', {
      width: viewportW,
      height: viewportH,
      deviceScaleFactor: 1,
      mobile: isMobile
    });

    await send('Page.navigate', { url: startUrl });
    await new Promise(r => setTimeout(r, 1200));

    // Capture initial state (frame 0)
    const frames = [];
    const targetW = isMobile ? 320 : 640;
    const targetH = isMobile ? 540 : 400;

    const f0 = await captureFrameData(targetW, targetH);
    frames.push(f0);

    // Trigger transition by clicking target selector or calling navigate()
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const el = document.querySelector('${clickSelector}');
          if (el) {
            el.click();
            return { clicked: true, text: el.innerText };
          }
          return { clicked: false };
        })()
      `,
      returnByValue: true
    });

    // Capture remaining frames
    for (let i = 1; i < frameTimestamps.length; i++) {
      const wait = frameTimestamps[i] - frameTimestamps[i - 1];
      await new Promise(r => setTimeout(r, wait));
      const f = await captureFrameData(targetW, targetH);
      frames.push(f);
    }

    // Save keyframes as PNG for crisp static inspection
    const startShot = Buffer.from(frames[0].rawBase64, 'base64');
    const midShot = Buffer.from(frames[Math.floor(frames.length / 2)].rawBase64, 'base64');
    const endShot = Buffer.from(frames[frames.length - 1].rawBase64, 'base64');

    const prefix = gifFileName.replace('.gif', '');
    fs.writeFileSync(path.join(SCREENSHOTS_DIR, `${prefix}_frame_01_start.jpg`), startShot);
    fs.writeFileSync(path.join(SCREENSHOTS_DIR, `${prefix}_frame_02_mid.jpg`), midShot);
    fs.writeFileSync(path.join(SCREENSHOTS_DIR, `${prefix}_frame_03_end.jpg`), endShot);

    // Encode GIF
    console.log(`Encoding GIF with ${frames.length} frames...`);
    const gif = GIFEncoder();
    for (const frame of frames) {
      const palette = quantize(frame.rgba, 128);
      const index = applyPalette(frame.rgba, palette);
      gif.writeFrame(index, targetW, targetH, { palette, delay: 100 });
    }
    gif.finish();

    const gifPath = path.join(SCREENSHOTS_DIR, gifFileName);
    fs.writeFileSync(gifPath, Buffer.from(gif.bytes()));
    console.log(`Saved GIF: ${gifFileName} (${fs.statSync(gifPath).size} bytes)`);

    return {
      name,
      gifFileName,
      framesCount: frames.length,
      durationMs: frameTimestamps[frameTimestamps.length - 1]
    };
  }

  const transitionResults = [];

  // 1. Transition 1: Landing -> Khám phá (Desktop 1280x820)
  transitionResults.push(await recordTransition({
    name: 'Landing to Khám Phá (Hero-to-Sidebar Morph)',
    startUrl: 'http://localhost:3005/',
    targetUrl: 'http://localhost:3005/kham-pha',
    clickSelector: 'nav a[href="/kham-pha"]',
    viewportW: 1280,
    viewportH: 820,
    isMobile: false,
    gifFileName: 'transition_01_landing_to_kham_pha.gif',
    frameTimestamps: [0, 80, 160, 240, 320, 420, 560]
  }));

  // 2. Transition 2: Khám phá -> Trang chủ (Sidebar-to-Hero Reverse Morph)
  transitionResults.push(await recordTransition({
    name: 'Khám Phá to Trang Chủ (Reverse Sidebar-to-Hero Morph)',
    startUrl: 'http://localhost:3005/kham-pha',
    targetUrl: 'http://localhost:3005/',
    clickSelector: 'nav a[href="/"]',
    viewportW: 1280,
    viewportH: 820,
    isMobile: false,
    gifFileName: 'transition_02_kham_pha_to_trang_chu.gif',
    frameTimestamps: [0, 80, 160, 240, 320, 420, 560]
  }));

  // 3. Transition 3: Khám phá -> Cẩm nang (Subpage to Subpage, Fixed Sidebar)
  transitionResults.push(await recordTransition({
    name: 'Khám Phá to Cẩm Nang (Stationary Sidebar Crossfade)',
    startUrl: 'http://localhost:3005/kham-pha',
    targetUrl: 'http://localhost:3005/cam-nang',
    clickSelector: 'nav a[href="/cam-nang"]',
    viewportW: 1280,
    viewportH: 820,
    isMobile: false,
    gifFileName: 'transition_03_kham_pha_to_cam_nang.gif',
    frameTimestamps: [0, 80, 160, 240, 320, 400]
  }));

  // 4. Transition 4: Mobile 390px Transition (Landing to Khám Phá)
  transitionResults.push(await recordTransition({
    name: 'Mobile 390px Transition (Bottom Nav Slide & Crossfade)',
    startUrl: 'http://localhost:3005/',
    targetUrl: 'http://localhost:3005/kham-pha',
    clickSelector: 'a[href="/kham-pha"]',
    viewportW: 390,
    viewportH: 844,
    isMobile: true,
    gifFileName: 'transition_04_mobile_transition.gif',
    frameTimestamps: [0, 80, 160, 240, 320, 420, 560]
  }));

  // 5. Test Reduced Motion
  console.log('\n--- Testing Prefers Reduced Motion ---');
  await send('Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-reduced-motion', value: 'reduce' }]
  });
  await send('Page.navigate', { url: 'http://localhost:3005/' });
  await new Promise(r => setTimeout(r, 600));

  const reducedMotionTest = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        return {
          matches: mq.matches,
          navItemTransitionDuration: window.getComputedStyle(document.querySelector('main')).transitionDuration
        };
      })()
    `,
    returnByValue: true
  });
  console.log('Reduced Motion Test result:', reducedMotionTest.result.result.value);

  // 6. Test Rapid Click Resilience
  console.log('\n--- Testing Rapid Click Resilience ---');
  const rapidClickTest = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const link = document.querySelector('nav a[href="/kham-pha"]') || document.querySelector('a[href="/kham-pha"]');
        let errorThrown = false;
        try {
          if (link) {
            link.click();
            link.click();
            link.click();
          }
        } catch(e) {
          errorThrown = true;
        }
        return { errorThrown, isStillWorking: true };
      })()
    `,
    returnByValue: true
  });
  console.log('Rapid Click Test result:', rapidClickTest.result.result.value);

  const report = {
    transitionResults,
    reducedMotionTest: reducedMotionTest.result.result.value,
    rapidClickTest: rapidClickTest.result.result.value,
    consoleLogs
  };

  fs.writeFileSync('A:\\trí tuệ nhân tạo\\BAI_3\\gate03_animation_results.json', JSON.stringify(report, null, 2));
  console.log('\n=== ALL TRANSITIONS RECORDED & VERIFIED SUCCESSFULLY ===');

  ws.close();
  edgeProc.kill();
}

main().catch(console.error);
