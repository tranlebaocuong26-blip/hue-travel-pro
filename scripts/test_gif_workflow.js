const { spawn } = require('child_process');
const os = require('os');
const path = require('path');
const fs = require('fs');
const { GIFEncoder, quantize, applyPalette } = require('gifenc');

async function test() {
  const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.join(os.tmpdir(), 'edge_test_gif_' + Date.now());
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
  await send('Runtime.enable');

  await send('Page.navigate', { url: 'http://localhost:3005/' });
  await new Promise(r => setTimeout(r, 1000));

  const shot = await send('Page.captureScreenshot', { format: 'jpeg', quality: 75 });
  console.log('Got screenshot jpeg, length:', shot.result.data.length);

  const evalRes = await send('Runtime.evaluate', {
    expression: `
      (async () => {
        const img = new Image();
        img.src = 'data:image/jpeg;base64,' + "${shot.result.data}";
        await img.decode();
        const canvas = document.createElement('canvas');
        canvas.width = 480;
        canvas.height = 300;
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
  console.log('Decoded RGBA pixels count:', rawRgba.length);

  const rgba = Uint8Array.from(rawRgba);
  const gif = GIFEncoder();
  const width = 480;
  const height = 300;
  const palette = quantize(rgba, 128);
  const index = applyPalette(rgba, palette);
  gif.writeFrame(index, width, height, { palette, delay: 200 });
  gif.finish();

  const gifPath = 'A:\\trí tuệ nhân tạo\\BAI_3\\screenshots\\test_output.gif';
  fs.writeFileSync(gifPath, Buffer.from(gif.bytes()));
  console.log('Wrote GIF to:', gifPath, 'Size:', fs.statSync(gifPath).size);

  ws.close();
  edgeProc.kill();
}

test().catch(console.error);
