const { spawn } = require('child_process');
const os = require('os');
const path = require('path');
const fs = require('fs');

async function testNav() {
  const edgeProc = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--remote-allow-origins=*',
    '--user-data-dir=' + path.join(os.tmpdir(), 'edge_nav_' + Date.now()),
    'about:blank'
  ]);
  await new Promise(r => setTimeout(r, 1500));
  const list = await (await fetch('http://127.0.0.1:9222/json/list')).json();
  const ws = new WebSocket(list[0].webSocketDebuggerUrl);
  let id = 1;
  const pending = new Map();
  ws.onmessage = e => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) pending.get(m.id)(m);
  };
  await new Promise(r => ws.onopen = r);
  const send = (method, params={}) => new Promise(res => {
    const myId = id++;
    pending.set(myId, res);
    ws.send(JSON.stringify({ id: myId, method, params }));
  });
  await send('Page.enable');
  await send('Page.navigate', { url: 'http://localhost:3000/' });
  await new Promise(r => setTimeout(r, 1500));

  // Click on 'Khám phá' in nav
  await send('Runtime.evaluate', {
    expression: 'document.querySelectorAll("a[href=\'/kham-pha\']")[0].click(); true;',
    returnByValue: true
  });
  await new Promise(r => setTimeout(r, 1500));
  const urlAfter = await send('Runtime.evaluate', {
    expression: 'window.location.pathname',
    returnByValue: true
  });
  const path1 = urlAfter.result.result ? urlAfter.result.result.value : urlAfter.result.value;
  console.log('Navigated to:', path1);

  // Click on 'Trang chủ' to return
  await send('Runtime.evaluate', {
    expression: 'document.querySelectorAll("a[href=\'/\']")[0].click(); true;',
    returnByValue: true
  });
  await new Promise(r => setTimeout(r, 1500));
  const urlReturn = await send('Runtime.evaluate', {
    expression: 'window.location.pathname',
    returnByValue: true
  });
  const path2 = urlReturn.result.result ? urlReturn.result.result.value : urlReturn.result.value;
  console.log('Returned to:', path2);

  const result = {
    step1: path1 === '/kham-pha',
    step2: path2 === '/',
    path1,
    path2
  };
  fs.writeFileSync(path.join(__dirname, 'navigation-functional-results.json'), JSON.stringify(result, null, 2));
  console.log('Navigation test result:', JSON.stringify(result));

  ws.close();
  edgeProc.kill();
}
testNav();
