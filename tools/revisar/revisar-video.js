/*
  Revisa cada escena del video buscando textos que:
   - se salen de la caja/listón/círculo que tienen detrás,
   - se salen de la pantalla,
   - se enciman con otro texto,
   - quedan tapados por Tilín o por los subtítulos.
  Uso: node tools/revisar/revisar-video.js <timeline.json> [paso_en_segundos]
*/
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const tl = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
  const paso = +(process.argv[3] || 0.25);
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
  await p.goto('file://' + path.join(__dirname, '..', 'video', 'escenas.html'));
  await p.evaluate(() => window.listo());
  await p.evaluate(tl => window.preparar(tl), tl);
  const problemas = {};
  for (let t = 0; t < tl.duracion; t += paso) {
    const r = await p.evaluate(t => {
      window.render(t);
      const out = [];
      const opacidad = el => { let o = 1; for (let e = el; e && e.tagName !== 'svg'; e = e.parentElement) { if (e.getAttribute('display') === 'none') return 0; const v = e.getAttribute('opacity'); if (v != null) o *= +v; } return o; };
      const esc = [...document.querySelectorAll('#escenas > g')].filter(g => g.getAttribute('display') !== 'none' && +(g.getAttribute('opacity') || 1) > .9);
      const actual = esc[esc.length - 1]; if (!actual) return out;
      const id = actual.id.replace('esc-', '');
      const textos = [...actual.querySelectorAll('text')].filter(x => x.textContent.trim() && opacidad(x) > .5).map(x => ({ el: x, r: x.getBoundingClientRect(), txt: x.textContent.trim() })).filter(o => o.r.width > 4);
      // forma rellena anterior en el mismo grupo que contiene el centro del texto.
      // Se mide con getBBox (coordenadas propias del grupo) para que los giros no engañen.
      const caja = (el) => {
        const rt = el.getBBox(), cx = rt.x + rt.width / 2, cy = rt.y + rt.height / 2;
        let sib = el.previousElementSibling;
        while (sib) {
          if (/^(rect|path|circle|ellipse|polygon)$/.test(sib.tagName) && sib.getAttribute('fill') && sib.getAttribute('fill') !== 'none') {
            const rs = sib.getBBox();
            if (cx > rs.x && cx < rs.x + rs.width && cy > rs.y && cy < rs.y + rs.height && rs.width < 1200) return { rt, rs };
          }
          sib = sib.previousElementSibling;
        }
        return null;
      };
      for (const o of textos) {
        const r = o.r;
        if (r.left < -2 || r.right > 1282 || r.top < -2 || r.bottom > 722) out.push(`${id} | «${o.txt}» se sale de la pantalla`);
        const c = caja(o.el);
        if (c) {
          const { rt, rs } = c, esc = o.r.width / Math.max(1, rt.width);
          const f = Math.max(rs.x - rt.x, rt.x + rt.width - rs.x - rs.width, rs.y - rt.y, rt.y + rt.height - rs.y - rs.height) * esc;
          if (f > 2) out.push(`${id} | «${o.txt}» se sale de su caja (${Math.round(f)}px)`);
        }
      }
      for (let i = 0; i < textos.length; i++) for (let j = i + 1; j < textos.length; j++) {
        const a = textos[i].r, b2 = textos[j].r;
        const w = Math.min(a.right, b2.right) - Math.max(a.left, b2.left), h = Math.min(a.bottom, b2.bottom) - Math.max(a.top, b2.top);
        if (w > 3 && h > 3 && textos[i].el.parentElement !== textos[j].el.parentElement) out.push(`${id} | «${textos[i].txt}» se encima con «${textos[j].txt}»`);
      }
      // Tilín encima de textos (sólo si el Tilín se dibuja después del texto)
      actual.querySelectorAll('.tilin').forEach(tg => {
        if (opacidad(tg) < .5) return;
        const cara = tg.querySelector('.t-cabeza'); if (!cara) return;
        const rc = cara.getBoundingClientRect();
        for (const o of textos) {
          const pos = o.el.compareDocumentPosition(tg);
          if (!(pos & Node.DOCUMENT_POSITION_FOLLOWING)) continue;
          const w = Math.min(o.r.right, rc.right) - Math.max(o.r.left, rc.left), h = Math.min(o.r.bottom, rc.bottom) - Math.max(o.r.top, rc.top);
          if (w > 6 && h > 6) out.push(`${id} | «${o.txt}» queda tapado por Tilín`);
        }
      });
      // subtítulos encima de textos de la escena
      const s = document.querySelector('#subs span');
      if (s) { const rs = s.getBoundingClientRect(); for (const o of textos) { const w = Math.min(o.r.right, rs.right) - Math.max(o.r.left, rs.left), h = Math.min(o.r.bottom, rs.bottom) - Math.max(o.r.top, rs.top); if (w > 4 && h > 4) out.push(`${id} | «${o.txt}» queda tapado por los subtítulos`); } }
      return out;
    }, t);
    r.forEach(x => { (problemas[x] = problemas[x] || []).push(t.toFixed(2)); });
  }
  await b.close();
  const ks = Object.keys(problemas);
  console.log(`${ks.length} problemas distintos`);
  ks.forEach(k => console.log('• ' + k + '   [t=' + problemas[k].slice(0, 3).join(', ') + (problemas[k].length > 3 ? ` …${problemas[k].length}` : '') + ']'));
})();
