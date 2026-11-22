/*
  Recorre la app en varios tamaños de celular y en los imprimibles, y reporta
  textos que se salen de su contenedor.
  Uso: (con el servidor en docs/ corriendo)  node tools/revisar/revisar-app.js [http://localhost:8765/]
*/
const { chromium } = require('playwright');
const path = require('path');
const BASE = process.argv[2] || 'http://localhost:8765/';
const DETECTOR = path.join(__dirname, 'textos-html.js');

const ANCHOS = [320, 360, 375, 390, 414];
const resultados = [];

async function revisar(p, donde) {
  await p.addScriptTag({ path: DETECTOR });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(150);
  const r = await p.evaluate(() => window.revisarTextos(document.body));
  r.forEach(x => resultados.push(Object.assign({ donde }, x)));
}
async function modalVisible(p) { return (await p.locator('.modal-fondo').count()) > 0; }
async function cierraModales(p) {
  for (let i = 0; i < 6 && await modalVisible(p); i++) { await p.locator('.modal-botones button').last().click(); await p.waitForTimeout(320); }
}

(async () => {
  const b = await chromium.launch();
  for (const ancho of ANCHOS) {
    const ctx = await b.newContext({ viewport: { width: ancho, height: 740 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
    const p = await ctx.newPage();
    p.on('pageerror', e => resultados.push({ donde: `${ancho}px`, texto: 'ERROR JS: ' + e.message, elemento: '', contenedor: '', px: 0 }));
    await p.goto(BASE + '#/'); await p.evaluate(() => { localStorage.clear(); sessionStorage.setItem('rgn-pin', 'ok'); });
    const ir = async (h, n) => { await p.goto(BASE + h); await p.waitForTimeout(450); await revisar(p, `${ancho}px ${n}`); };
    await ir('#/', 'inicio'); await ir('#/historia', 'historia'); await ir('#/unirse', 'unirse');
    for (const k of ['rueda', 'alfabeto', 'morse']) await ir('#/kit/' + k, 'kit ' + k);
    await ir('#/org', 'organizador'); await ir('#/prueba', 'modo prueba');
    // recorre las 4 familias y todos sus pasos (acertijos, retos, modales)
    for (const fam of ['rm', 'rf', 'af', 'fx']) {
      const url = await p.evaluate(f => window.APP.urlSobre(window.APP.cfg().familias.find(x => x.id === f)), fam);
      await p.evaluate(() => localStorage.removeItem('rgn-estado'));
      await p.goto(BASE + url.slice(url.indexOf('#'))); await p.waitForTimeout(500);
      if (fam === 'fx') { const i = p.locator('#pide-texto'); if (await i.count()) { await i.fill('López García Hernández'); await p.keyboard.press('Enter'); await p.waitForTimeout(400); } }
      for (let i = 0; i < 4 && await modalVisible(p); i++) { await revisar(p, `${ancho}px ${fam} bienvenida ${i}`); await p.locator('.modal-botones button').last().click(); await p.waitForTimeout(350); }
      const ruta = await p.evaluate(() => JSON.parse(localStorage.getItem('rgn-estado')).fam.r);
      const J = await p.evaluate(() => ({ retos: window.JUEGO.retosPorFamilia, R: window.JUEGO.retos }));
      for (let k = 0; k < 7; k++) {
        await p.goto(BASE + '#/juego'); await p.waitForTimeout(300);
        await revisar(p, `${ancho}px ${fam} pista ${k + 1}`);
        if (k === 3) { const bx = p.locator('#btn-experto'); if (await bx.count()) { await bx.click(); await p.waitForTimeout(300); await revisar(p, `${ancho}px ${fam} reto experto`); await p.locator('#btn-experto').first().click(); await p.waitForTimeout(200); } }
        const cod = await p.evaluate(([f, l]) => window.APP.cod.lugar(f, l), [fam, ruta[k]]);
        await p.goto(BASE + '#/q/' + cod); await p.waitForTimeout(450);
        for (let i = 0; i < 4 && await modalVisible(p); i++) { await revisar(p, `${ancho}px ${fam} modal pista ${k + 1}.${i}`); await p.locator('.modal-botones button').last().click(); await p.waitForTimeout(350); }
        await revisar(p, `${ancho}px ${fam} reto ${k + 1}`);
        const r = J.R[J.retos[fam][k]];
        await p.fill('#respuesta', r.respuestas[0]); await p.click('#form-reto button'); await p.waitForTimeout(450);
        for (let i = 0; i < 4 && await modalVisible(p); i++) { await revisar(p, `${ancho}px ${fam} modal reto ${k + 1}.${i}`); await p.locator('.modal-botones button').last().click(); await p.waitForTimeout(350); }
      }
      await revisar(p, `${ancho}px ${fam} terminado`);
    }
    // otras pantallas: trampa, regalo, otra familia, final, carta
    const c = await p.evaluate(() => ({ t: window.APP.cod.trampa('fx', 1), g: window.APP.cod.regalo(3), o: window.APP.cod.lugar('rm', 'arbol'), f: window.APP.cod.cofre(), c: window.APP.cod.cartaGaby() }));
    await p.goto(BASE + '#/q/' + c.o); await p.waitForTimeout(400); await revisar(p, `${ancho}px otra familia`); await cierraModales(p);
    await p.goto(BASE + '#/q/' + c.g); await p.waitForTimeout(400); await revisar(p, `${ancho}px regalo`); await cierraModales(p);
    await p.goto(BASE + '#/q/' + c.c); await p.waitForTimeout(400); await revisar(p, `${ancho}px carta`); await cierraModales(p);
    await p.goto(BASE + '#/q/' + c.t); await p.waitForTimeout(600); await revisar(p, `${ancho}px trampa`);
    await p.goto(BASE + '#/q/' + c.f); await p.waitForTimeout(600); await revisar(p, `${ancho}px final`);
    await ctx.close();
  }
  // imprimibles (página por página)
  const ctx = await b.newContext({ viewport: { width: 1200, height: 1000 } });
  const p = await ctx.newPage();
  await p.goto(BASE + '#/'); await p.evaluate(() => { localStorage.clear(); sessionStorage.setItem('rgn-pin', 'ok'); });
  for (const t of ['guia', 'respuestas', 'sobres', 'pistas', 'trampas', 'regalos', 'cofre', 'agente', 'diplomas', 'cuento', 'prueba']) {
    await p.goto(BASE + `#/imprimir/${t}?todas=1`); await p.waitForTimeout(700);
    await p.addScriptTag({ path: DETECTOR }); await p.evaluate(() => document.fonts.ready);
    const r = await p.evaluate(() => {
      const out = [];
      document.querySelectorAll('.hoja').forEach((h, i) => {
        window.revisarTextos(h).forEach(x => out.push(Object.assign({ hoja: i + 1 }, x)));
        if (!h.classList.contains('flujo') && h.scrollHeight > h.clientHeight + 2) out.push({ hoja: i + 1, texto: '(la hoja se corta abajo)', elemento: 'section.hoja', contenedor: 'hoja', px: h.scrollHeight - h.clientHeight });
      });
      return out;
    });
    r.forEach(x => { if (x.elemento !== 'html') resultados.push(Object.assign({ donde: `imprimible ${t} hoja ${x.hoja}` }, x)); });
  }
  await b.close();
  // resumen agrupado
  const grupos = {};
  resultados.forEach(r => { const k = `${r.texto} | ${r.elemento} ⟶ ${r.contenedor}`; (grupos[k] = grupos[k] || []).push(`${r.donde} (${r.px}px)`); });
  const claves = Object.keys(grupos);
  console.log(`\n${claves.length} problemas distintos\n`);
  claves.forEach(k => console.log('• ' + k + '\n    ' + grupos[k].slice(0, 4).join(' · ') + (grupos[k].length > 4 ? ` … (+${grupos[k].length - 4})` : '')));
})();
