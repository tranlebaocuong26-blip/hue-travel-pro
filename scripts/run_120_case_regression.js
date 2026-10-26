const { spawn } = require('child_process');
const os = require('os');
const path = require('path');
const fs = require('fs');

const root = 'A:\\trí tuệ nhân tạo\\BAI_3\\hue-travel-pro';
const evidenceDir = path.join(root, 'reports', 'gravity', 'evidence', 'GATE-08', 'regression');
fs.mkdirSync(evidenceDir, { recursive: true });

const viewports = [
  // Mobile (7)
  { id: 'M01', width: 320, height: 568, mobile: true, dpr: 2, label: 'Điện thoại rất nhỏ' },
  { id: 'M02', width: 360, height: 800, mobile: true, dpr: 2, label: 'Android nhỏ' },
  { id: 'M03', width: 375, height: 667, mobile: true, dpr: 2, label: 'iPhone nhỏ' },
  { id: 'M04', width: 390, height: 844, mobile: true, dpr: 2, label: 'Mobile phổ biến' },
  { id: 'M05', width: 393, height: 873, mobile: true, dpr: 2, label: 'Android hiện đại' },
  { id: 'M06', width: 414, height: 896, mobile: true, dpr: 2, label: 'Điện thoại lớn' },
  { id: 'M07', width: 430, height: 932, mobile: true, dpr: 2, label: 'iPhone màn hình lớn' },

  // Tablet (4)
  { id: 'T01', width: 768, height: 1024, mobile: false, dpr: 1.5, label: 'Tablet 768p' },
  { id: 'T02', width: 820, height: 1180, mobile: false, dpr: 1.5, label: 'Tablet 820p' },
  { id: 'T03', width: 1024, height: 768, mobile: false, dpr: 1.5, label: 'Tablet Landscape 1024' },
  { id: 'T04', width: 1180, height: 820, mobile: false, dpr: 1.5, label: 'Tablet Landscape 1180' },

  // Laptop (5)
  { id: 'L01', width: 1280, height: 720, mobile: false, dpr: 1, label: 'Laptop 1280x720' },
  { id: 'L02', width: 1366, height: 768, mobile: false, dpr: 1, label: 'Laptop 1366x768' },
  { id: 'L03', width: 1440, height: 900, mobile: false, dpr: 1, label: 'Laptop 1440x900' },
  { id: 'L04', width: 1536, height: 864, mobile: false, dpr: 1, label: 'Laptop 1536x864' },
  { id: 'L05', width: 1650, height: 786, mobile: false, dpr: 1, label: 'Laptop 1650x786' },

  // Desktop PC (4)
  { id: 'D01', width: 1600, height: 900, mobile: false, dpr: 1, label: 'Desktop 1600x900' },
  { id: 'D02', width: 1920, height: 1080, mobile: false, dpr: 1, label: 'Desktop 1920x1080' },
  { id: 'D03', width: 2560, height: 1440, mobile: false, dpr: 1, label: 'Desktop 2560x1440' },
  { id: 'D04', width: 3440, height: 1440, mobile: false, dpr: 1, label: 'Desktop 3440x1440' }
];

const routes = [
  { slug: 'home', path: '/' },
  { slug: 've-hue', path: '/ve-hue' },
  { slug: 'kham-pha', path: '/kham-pha' },
  { slug: 'an-uong', path: '/an-uong' },
  { slug: 'cam-nang', path: '/cam-nang' },
  { slug: 'luu-tru', path: '/luu-tru' }
];

async function main() {
  console.log(`Starting 120-Case Full Regression across ${routes.length} routes and ${viewports.length} viewports...`);
  
  const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.join(os.tmpdir(), 'edge_reg_' + Date.now());
  const edgeProc = spawn(edge, [
    '--headless=new',
    '--remote-debugging-port=9233',
    '--remote-allow-origins=*',
    '--user-data-dir=' + profileDir,
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  const listRes = await fetch('http://127.0.0.1:9233/json/list');
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
  await send('Runtime.enable');

  const regressionResults = [];
  let totalCases = routes.length * viewports.length;
  let currentCase = 0;

  for (const r of routes) {
    for (const vp of viewports) {
      currentCase++;
      const filename = `${r.slug}_${vp.id}_${vp.width}x${vp.height}_final.png`;
      const screenshotPath = path.join(evidenceDir, filename);

      // Emulate device metrics
      await send('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: vp.dpr,
        mobile: vp.mobile
      });

      // Navigate
      await send('Page.navigate', { url: `http://localhost:3000${r.path}` });
      await new Promise(res => setTimeout(res, 600));

      // Evaluate DOM metrics for overflow & layout
      const evalRes = await send('Runtime.evaluate', {
        expression: `
          (() => {
            const docWidth = document.documentElement.clientWidth;
            const scrollWidth = document.documentElement.scrollWidth;
            const bodyScrollWidth = document.body ? document.body.scrollWidth : 0;
            const maxScroll = Math.max(scrollWidth, bodyScrollWidth);
            const hasHorizontalOverflow = maxScroll > docWidth + 1;
            const overflowDelta = maxScroll - docWidth;

            let overflowingElements = [];
            if (hasHorizontalOverflow) {
              const allEls = document.querySelectorAll('*');
              for (const el of allEls) {
                const rect = el.getBoundingClientRect();
                if (rect.right > docWidth + 1) {
                  overflowingElements.push({
                    tag: el.tagName,
                    class: (el.className || '').toString().slice(0, 60),
                    right: Math.round(rect.right),
                    width: Math.round(rect.width)
                  });
                  if (overflowingElements.length >= 5) break;
                }
              }
            }

            return {
              docWidth,
              docHeight: document.documentElement.clientHeight,
              maxScroll,
              hasHorizontalOverflow,
              overflowDelta,
              overflowingElements
            };
          })()
        `,
        returnByValue: true
      });

      const metrics = (evalRes.result && evalRes.result.result && evalRes.result.result.value) || (evalRes.result && evalRes.result.value) || {};

      // Capture screenshot
      const ssRes = await send('Page.captureScreenshot', { format: 'png' });
      if (ssRes.result && ssRes.result.data) {
        fs.writeFileSync(screenshotPath, Buffer.from(ssRes.result.data, 'base64'));
      }

      const caseData = {
        index: currentCase,
        route: r.path,
        slug: r.slug,
        viewport: vp,
        metrics,
        screenshot: filename,
        status: metrics.hasHorizontalOverflow ? 'FAIL_OVERFLOW' : 'PASS'
      };

      regressionResults.push(caseData);

      if (currentCase % 10 === 0 || currentCase === totalCases || metrics.hasHorizontalOverflow) {
        console.log(`[REGRESSION ${currentCase}/${totalCases}] ${r.path} @ ${vp.id} (${vp.width}x${vp.height}): ${caseData.status} ${metrics.hasHorizontalOverflow ? `(+${metrics.overflowDelta}px)` : ''}`);
      }
    }
  }

  ws.close();
  edgeProc.kill();

  const reportPath = path.join(evidenceDir, '..', 'regression_results.json');
  fs.writeFileSync(reportPath, JSON.stringify(regressionResults, null, 2));

  const failCount = regressionResults.filter(c => c.status !== 'PASS').length;
  console.log(`\nFull Regression complete! Total: ${totalCases}, Pass: ${totalCases - failCount}, Fail: ${failCount}`);
  console.log(`Results saved to: ${reportPath}`);
}

main().catch(err => {
  console.error('Regression failed:', err);
  process.exit(1);
});
