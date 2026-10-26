const { spawn } = require('child_process');
const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const p = spawn(edge, ['--headless=new', '--remote-debugging-port=9222', '--remote-allow-origins=*', 'about:blank']);

setTimeout(async () => {
  try {
    const listRes = await fetch('http://127.0.0.1:9222/json/list');
    const targets = await listRes.json();
    const ws = new WebSocket(targets[0].webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);
    let id = 1;
    function send(method, params = {}) {
      return new Promise(r => {
        const myId = id++;
        const handler = e => {
          const m = JSON.parse(e.data);
          if (m.id === myId) { ws.removeEventListener('message', handler); r(m); }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id, myId, method, params }));
      });
    }
    const res = await send('Runtime.evaluate', {
      expression: `({
        mp4: MediaRecorder.isTypeSupported('video/mp4'),
        mp4Avc: MediaRecorder.isTypeSupported('video/mp4; codecs=avc1'),
        webm: MediaRecorder.isTypeSupported('video/webm')
      })`,
      returnByValue: true
    });
    console.log('Supported Types:', res.result.result.value);
    ws.close();
  } catch(e) {
    console.error(e);
  } finally {
    p.kill();
  }
}, 1500);
