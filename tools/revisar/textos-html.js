/*
  Detector de textos que se salen de su contenedor (HTML).
  Se inyecta en la página: window.revisarTextos(raiz) → lista de problemas.
  Un "contenedor" es el ancestro más cercano que se ve como caja
  (fondo, borde, sombra o overflow distinto de visible).
*/
window.revisarTextos = function (raiz = document.body, tol = 1.5) {
  const problemas = [];
  const visible = el => { const cs = getComputedStyle(el); return cs.display !== 'none' && cs.visibility !== 'hidden' && +cs.opacity > 0.05 && el.getClientRects().length > 0; };
  const esCaja = el => {
    const cs = getComputedStyle(el);
    const fondo = cs.backgroundColor && cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent';
    return fondo || cs.backgroundImage !== 'none' || parseFloat(cs.borderTopWidth) > 0 || parseFloat(cs.borderLeftWidth) > 0 || cs.overflow !== 'visible' || el.tagName === 'BUTTON' || el.tagName === 'INPUT' || el.tagName === 'SELECT';
  };
  const nombre = el => el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).join('.') : '');
  const rango = document.createRange();
  raiz.querySelectorAll('*').forEach(el => {
    if (el.closest('svg') || el.closest('.no-revisar')) return;
    const nodos = [...el.childNodes].filter(n => n.nodeType === 3 && n.textContent.trim());
    if (!nodos.length || !visible(el)) return;
    let caja = el;
    while (caja && caja !== document.body && !esCaja(caja)) caja = caja.parentElement;
    if (!caja) return;
    const cr = caja.getBoundingClientRect(), cs = getComputedStyle(caja);
    const bl = parseFloat(cs.borderLeftWidth) || 0, br = parseFloat(cs.borderRightWidth) || 0, bt = parseFloat(cs.borderTopWidth) || 0, bb = parseFloat(cs.borderBottomWidth) || 0;
    const lim = { l: cr.left + bl, r: cr.right - br, t: cr.top + bt, b: cr.bottom - bb };
    // en cajas con scroll vertical el texto de abajo se alcanza deslizando: sólo cuenta lo horizontal
    if (/auto|scroll/.test(cs.overflowY)) { lim.t = -1e9; lim.b = 1e9; }
    for (const n of nodos) {
      rango.selectNodeContents(n);
      for (const r of rango.getClientRects()) {
        if (r.width < 1) continue;
        const fuera = Math.max(lim.l - r.left, r.right - lim.r, lim.t - r.top, r.bottom - lim.b);
        if (fuera > tol) problemas.push({ texto: n.textContent.trim().slice(0, 60), elemento: nombre(el), contenedor: nombre(caja), px: Math.round(fuera) });
      }
    }
  });
  // cajas con desbordamiento horizontal (texto que no cabe y se recorta)
  raiz.querySelectorAll('*').forEach(el => {
    if (el.closest('svg') || el.closest('.no-revisar') || !visible(el)) return;
    const cs = getComputedStyle(el);
    if (cs.overflowX === 'auto' || cs.overflowX === 'scroll' || el.tagName === 'SELECT' || el.tagName === 'INPUT') return;
    if (el.clientWidth > 0 && el.scrollWidth > el.clientWidth + 2 && (cs.overflowX === 'hidden' || cs.overflowX === 'clip'))
      problemas.push({ texto: (el.textContent || '').trim().slice(0, 60), elemento: nombre(el), contenedor: '(se recorta)', px: el.scrollWidth - el.clientWidth });
  });
  // la página no debe tener scroll horizontal
  const sobra = document.documentElement.scrollWidth - document.documentElement.clientWidth;
  if (sobra > 1) problemas.push({ texto: '(página)', elemento: 'html', contenedor: 'ventana', px: sobra });
  // quitar duplicados
  const vistos = new Set();
  return problemas.filter(p => { const k = p.texto + '|' + p.elemento; if (vistos.has(k)) return false; vistos.add(k); return true; });
};
