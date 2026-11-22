/*
  Genera los PDF de la carpeta imprimibles/ a partir de la app.
  Uso:
    cd docs && python3 -m http.server 8765 &      (servidor local)
    node tools/generar_pdfs.js [http://localhost:8765/]
  Los QR apuntan a JUEGO.baseUrlPorDefecto (la dirección pública de la app).
*/
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE = process.argv[2] || 'http://localhost:8765/';
const SALIDA = path.join(__dirname, '..', 'imprimibles');
const LISTA = [
  ['guia', '01-guia-del-organizador'],
  ['respuestas', '02-hoja-de-respuestas-SECRETO', true],
  ['sobres', '03-sobres-de-mision-y-kit-del-detective', true],
  ['pistas', '04-tarjetas-de-pistas', true],
  ['trampas', '05-pistas-falsas', true],
  ['regalos', '06-regalos-falsos'],
  ['cofre', '07-cofre-candados-y-qr-final', true],
  ['agente', '08-cartas-de-santa-y-gafetes-ana-sofia-y-gaby'],
  ['diplomas', '09-diplomas', true],
  ['cuento', '10-cuento-ilustrado'],
];

(async () => {
  fs.mkdirSync(SALIDA, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1100, height: 1400 } });
  await p.goto(BASE + '#/');
  await p.evaluate(() => { localStorage.clear(); sessionStorage.setItem('rgn-pin', 'ok'); });
  for (const [tipo, nombre, todas] of LISTA) {
    await p.goto(BASE + `#/imprimir/${tipo}${todas ? '?todas=1' : ''}`);
    await p.waitForLoadState('networkidle');
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(600);
    await p.pdf({ path: path.join(SALIDA, nombre + '.pdf'), preferCSSPageSize: true, printBackground: true });
    console.log('✓', nombre);
  }
  await b.close();
})();
