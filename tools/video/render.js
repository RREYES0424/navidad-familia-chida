/*
  Renderiza el video cuadro por cuadro con Playwright + ffmpeg.

  Uso:
    node tools/video/render.js <timeline.json> <salida.mp4> [fps]
    node tools/video/render.js <timeline.json> --cuadros 1,5,12.5 <carpeta>   (sólo imágenes de prueba)
*/
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

(async () => {
  const [tlPath, salida, ...resto] = process.argv.slice(2);
  const tl = JSON.parse(fs.readFileSync(tlPath, 'utf8'));
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
  page.on('pageerror', e => console.error('ERROR en página:', e.message));
  await page.goto('file://' + path.join(__dirname, 'escenas.html'));
  await page.evaluate(() => window.listo());
  await page.evaluate(tl => window.preparar(tl), tl);
  if (process.env.SIN_SUBS) await page.evaluate(() => { window.SIN_SUBS = true; });

  if (salida === '--cuadros') {
    const tiempos = resto[0].split(',').map(Number);
    const dir = resto[1];
    fs.mkdirSync(dir, { recursive: true });
    for (const t of tiempos) {
      await page.evaluate(t => window.render(t), t);
      await page.screenshot({ path: path.join(dir, `cuadro-${String(t).padStart(6, '0')}.jpg`), type: 'jpeg', quality: 88 });
    }
    await browser.close();
    return;
  }

  const fps = +(resto[0] || 24);
  const total = Math.ceil(tl.duracion * fps);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '25', '-pix_fmt', 'yuv420p', '-r', String(fps), salida], { stdio: ['pipe', 'inherit', 'inherit'] });
  const t0 = Date.now();
  for (let i = 0; i < total; i++) {
    await page.evaluate(t => window.render(t), i / fps);
    const buf = await page.screenshot({ type: 'jpeg', quality: 92 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 240 === 0) console.log(`cuadro ${i}/${total}  (${((Date.now() - t0) / 1000).toFixed(0)} s)`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  await browser.close();
  console.log('listo', salida);
})();
