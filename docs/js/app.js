/* =========================================================================
   EL GRAN ROBO DE NAVIDAD — app
   ========================================================================= */
(function () {
  'use strict';
  const J = window.JUEGO, A = window.ARTE;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const app = $('#app');
  const capas = $('#capas');
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------------- almacenamiento seguro ---------------- */
  const store = {
    get(k, def) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch (e) { return def; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } },
    del(k) { try { localStorage.removeItem(k); } catch (e) { } }
  };

  /* ---------------- utilidades de texto y cifrado ---------------- */
  const ABC = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';
  function norm(s) {
    return String(s || '').toLowerCase().replace(/ñ/g, 'n').normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9:/ ]/g, ' ').replace(/\s+/g, ' ').trim();
  }
  function mayus(s) { return String(s).toUpperCase().replace(/Á/g, 'A').replace(/É/g, 'E').replace(/Í/g, 'I').replace(/Ó/g, 'O').replace(/[ÚÜ]/g, 'U'); }
  function cesar(palabra, k) { return mayus(palabra).split('').map(c => { const i = ABC.indexOf(c); return i < 0 ? c : ABC[(i + k) % 27]; }).join(''); }
  function prng(seed) { let s = seed >>> 0 || 1; return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; }; }
  function hashNum(str) { let h = 0x811c9dc5; for (const ch of str) { h ^= ch.codePointAt(0); h = Math.imul(h, 0x01000193) >>> 0; } return h >>> 0; }
  const ALF = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  function codigo4(str) { let h = hashNum('tilin*' + str), s = ''; for (let i = 0; i < 4; i++) { s += ALF[h & 31]; h >>>= 5; } return s; }
  function anagrama(palabra, seed) {
    const letras = mayus(palabra).split(''); const r = prng(hashNum(palabra + seed));
    for (let intento = 0; intento < 20; intento++) {
      for (let i = letras.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [letras[i], letras[j]] = [letras[j], letras[i]]; }
      if (letras.join('') !== mayus(palabra)) break;
    }
    return letras.join(' ');
  }
  const MORSE = { A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....', I: '..', J: '.---', K: '-.-', L: '.-..', M: '--', N: '-.', 'Ñ': '--.--', O: '---', P: '.--.', Q: '--.-', R: '.-.', S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-', Y: '-.--', Z: '--..' };
  function morseHTML(palabra) {
    return mayus(palabra).split('').map(c => `<span class="morse-letra">${(MORSE[c] || '').split('').map(s => s === '.' ? '<i class="m-punto">•</i>' : '<i class="m-raya">—</i>').join('')}</span>`).join('<span class="morse-sep">/</span>');
  }
  function glifosHTML(palabra, tam = 44, color) { return `<span class="glifos">${mayus(palabra).split('').map(c => A.glifo(c, tam, color)).join('')}</span>`; }
  function b64enc(obj) { return btoa(unescape(encodeURIComponent(JSON.stringify(obj)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
  function b64dec(s) { s = s.replace(/-/g, '+').replace(/_/g, '/'); while (s.length % 4) s += '='; return JSON.parse(decodeURIComponent(escape(atob(s)))); }
  const fmtTiempo = ms => { if (ms < 0) ms = 0; const s = Math.floor(ms / 1000), h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s % 60; return (h ? h + ':' + String(m).padStart(2, '0') : m) + ':' + String(x).padStart(2, '0'); };

  /* ---------------- configuración (datos + ajustes del organizador) ---------------- */
  function cfg() {
    const o = store.get('rgn-config', {});
    const familias = J.familias.map((f, i) => Object.assign({}, f, { idx: i }, (o.familias || {})[f.id] || {}));
    const ruta = (o.ruta && o.ruta.length === J.pasosPorFamilia && o.ruta.every(r => J.lugares[r])) ? o.ruta : J.rutaPorDefecto.slice();
    return { familias, ruta, base: o.base || '' };
  }
  function guardaCfg(cambios) { const o = store.get('rgn-config', {}); store.set('rgn-config', Object.assign(o, cambios)); }
  function baseUrl() {
    const c = cfg(); if (c.base) return c.base.endsWith('/') ? c.base : c.base + '/';
    if (/^https?:$/.test(location.protocol) && !/^(localhost|127\.|0\.0\.0\.0)/.test(location.hostname)) return location.origin + location.pathname.replace(/[^/]*$/, '');
    return J.baseUrlPorDefecto;
  }
  function famPorId(id) { return cfg().familias.find(f => f.id === id); }
  function rutaDeFamilia(fam, rutaBase) { const n = rutaBase.length; return rutaBase.map((_, k) => rutaBase[(k + (fam.offset || 0)) % n]); }
  function datosSobre(fam) {
    const c = cfg();
    return { v: 1, f: fam.id, n: fam.nombre, c: fam.codigo, a: fam.agente || '', d: fam.descifradora || '', r: rutaDeFamilia(fam, c.ruta) };
  }
  function urlSobre(fam) { return baseUrl() + '#/s/' + b64enc(datosSobre(fam)); }
  function urlCodigo(cod) { return baseUrl() + '#/q/' + cod; }

  /* ---------------- tabla de códigos de las tarjetas ---------------- */
  const CODIGOS = {};
  (function () {
    const add = (k, v) => { const c = codigo4(k); if (CODIGOS[c]) console.warn('código repetido', c, k); CODIGOS[c] = v; };
    J.familias.forEach(f => {
      Object.keys(J.lugares).forEach(l => add(`L|${f.id}|${l}`, { tipo: 'lugar', fam: f.id, lugar: l }));
      for (let n = 1; n <= 3; n++) add(`T|${f.id}|${n}`, { tipo: 'trampa', fam: f.id, n });
    });
    J.regalosFalsos.forEach(g => add(`G|${g.id}`, { tipo: 'regalo', n: g.id }));
    add('COFRE', { tipo: 'cofre' });
    add('CARTA', { tipo: 'carta', cual: 'agente' });
    add('CARTA-GABY', { tipo: 'carta', cual: 'descifradora' });
  })();
  const cod = {
    lugar: (f, l) => codigo4(`L|${f}|${l}`), trampa: (f, n) => codigo4(`T|${f}|${n}`),
    regalo: n => codigo4(`G|${n}`), cofre: () => codigo4('COFRE'), carta: () => codigo4('CARTA'), cartaGaby: () => codigo4('CARTA-GABY')
  };

  /* ---------------- estado de la partida (por teléfono) ---------------- */
  let E = store.get('rgn-estado', null);
  const guarda = () => store.set('rgn-estado', E);
  function nuevaPartida(d) {
    const fam = famPorId(d.f) || J.familias[0];
    E = {
      fam: { id: d.f, n: d.n || fam.nombre, c: String(d.c || fam.codigo), a: d.a || '', d: d.d || '', r: d.r, idx: J.familias.findIndex(x => x.id === d.f), color: fam.color, icono: fam.icono },
      paso: 0, fase: 'buscando', inicio: Date.now(), fin: null, candado: null,
      comodines: J.comodinesIniciales, usados: 0, ayudas: {}, trampas: [], regalos: [],
      congelado: 0, castigo: '', estrellas: 0, misiones: [], digitos: [null, null, null, null], fallos: {},
      experto: false, verExperto: false, bonoAgente: false
    };
    guarda();
  }

  /* ---------------- sonido ---------------- */
  let sonido = store.get('rgn-sonido', true);
  let actx = null;
  function ctx() { if (!actx) { try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { } } if (actx && actx.state === 'suspended') actx.resume(); return actx; }
  function tono(f, dur = .3, tipo = 'sine', vol = .15, cuando = 0) {
    const c = ctx(); if (!c || !sonido) return;
    const o = c.createOscillator(), g = c.createGain(), t = c.currentTime + cuando;
    o.type = tipo; o.frequency.value = f; g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + .01); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + dur + .05);
  }
  const sfx = {
    ding() { [1318.5, 1760, 2637].forEach((f, i) => tono(f, .7, 'sine', .14, i * .09)); },
    exito() { [523, 659, 784, 1047, 1319].forEach((f, i) => tono(f, .8, 'triangle', .12, i * .1)); },
    error() { tono(180, .25, 'square', .06); tono(140, .35, 'square', .06, .15); },
    clic() { tono(1800, .05, 'square', .04); },
    cascabel() { for (let i = 0; i < 5; i++) tono(4000 + Math.random() * 2500, .12, 'sine', .05, i * .05); }
  };
  let audioActual = null;
  function clip(nombre) {
    if (!sonido) return null;
    try { if (audioActual) audioActual.pause(); audioActual = new Audio(`media/audio/${nombre}.mp3`); audioActual.play().catch(() => { }); return audioActual; } catch (e) { return null; }
  }
  function vibra(p) { try { navigator.vibrate && navigator.vibrate(p); } catch (e) { } }
  function pintaSonido() { $('#btn-sonido').textContent = sonido ? '🔊' : '🔇'; }
  $('#btn-sonido').addEventListener('click', () => { sonido = !sonido; store.set('rgn-sonido', sonido); pintaSonido(); if (sonido) sfx.cascabel(); else if (audioActual) audioActual.pause(); });
  pintaSonido();

  /* ---------------- nieve de fondo ---------------- */
  (function nieve() {
    const cv = $('#nieve'), cx = cv.getContext('2d');
    const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    let W, H, copos = [];
    function tam() { W = cv.width = innerWidth; H = cv.height = innerHeight; copos = Array.from({ length: Math.min(70, Math.round(W * H / 14000)) }, () => ({ x: Math.random() * W, y: Math.random() * H, r: .8 + Math.random() * 2.4, v: .3 + Math.random() * .9, f: Math.random() * 6 })); }
    addEventListener('resize', tam); tam();
    function cuadro(t) {
      cx.clearRect(0, 0, W, H); cx.fillStyle = 'rgba(255,255,255,.75)';
      copos.forEach(c => { c.y += c.v; if (c.y > H + 5) { c.y = -5; c.x = Math.random() * W; } cx.beginPath(); cx.arc(c.x + Math.sin(t / 1300 + c.f) * 12, c.y, c.r, 0, 6.3); cx.fill(); });
      if (!reduce && !document.body.classList.contains('modo-imprimir')) requestAnimationFrame(cuadro);
    }
    if (!reduce) requestAnimationFrame(cuadro);
  })();
  $('.marca-tilin').innerHTML = A.svg(A.tilin(), '30 10 160 180');

  /* ---------------- capas (modales) ---------------- */
  function modal(html, { clase = '', botones = [{ txt: 'Continuar', valor: true, clase: 'primario' }], cerrable = true } = {}) {
    return new Promise(res => {
      const m = document.createElement('div');
      m.className = 'modal-fondo';
      m.innerHTML = `<div class="modal ${clase}" role="dialog" aria-modal="true"><div class="modal-cuerpo">${html}</div>
        <div class="modal-botones">${botones.map((b, i) => `<button class="btn ${b.clase || ''}" data-i="${i}">${b.txt}</button>`).join('')}</div></div>`;
      capas.appendChild(m);
      requestAnimationFrame(() => m.classList.add('visible'));
      const cerrar = v => { m.classList.remove('visible'); setTimeout(() => m.remove(), 250); res(v); };
      $$('.modal-botones button', m).forEach(b => b.addEventListener('click', () => { sfx.clic(); cerrar(botones[+b.dataset.i].valor); }));
      if (cerrable) m.addEventListener('click', e => { if (e.target === m) cerrar(null); });
      $$('[data-audio]', m).forEach(b => b.addEventListener('click', () => clip(b.dataset.audio)));
    });
  }
  function aviso(txt, tipo = '') {
    const t = document.createElement('div'); t.className = 'aviso ' + tipo; t.textContent = txt; capas.appendChild(t);
    setTimeout(() => t.classList.add('visible'), 10); setTimeout(() => { t.classList.remove('visible'); setTimeout(() => t.remove(), 400); }, 3200);
  }
  function confeti() {
    const cv = document.createElement('canvas'); cv.className = 'confeti'; capas.appendChild(cv);
    const cx = cv.getContext('2d'); cv.width = innerWidth; cv.height = innerHeight;
    const cols = ['#d7263d', '#1b998b', '#f5c542', '#3a6ea5', '#fff', '#e84a8a'];
    const ps = Array.from({ length: 140 }, () => ({ x: Math.random() * cv.width, y: -20 - Math.random() * cv.height * .5, vx: (Math.random() - .5) * 3, vy: 2 + Math.random() * 4, r: Math.random() * 6, c: cols[Math.floor(Math.random() * cols.length)], a: Math.random() * 6 }));
    let n = 0;
    (function cuadro() { cx.clearRect(0, 0, cv.width, cv.height); ps.forEach(p => { p.x += p.vx; p.y += p.vy; p.a += .1; cx.save(); cx.translate(p.x, p.y); cx.rotate(p.a); cx.fillStyle = p.c; cx.fillRect(-4, -2, 8, 4 + p.r); cx.restore(); }); if (++n < 220) requestAnimationFrame(cuadro); else cv.remove(); })();
  }

  /* ---------------- ESCÁNER QR ---------------- */
  function escanear(titulo = 'Apunta la cámara al código QR') {
    return new Promise(resolve => {
      const ov = document.createElement('div');
      ov.className = 'escaner';
      ov.innerHTML = `<video playsinline muted autoplay></video><div class="mira"><span></span></div>
        <div class="esc-arriba"><p class="esc-msg">${esc(titulo)}</p></div>
        <div class="esc-abajo">
          <form class="esc-manual"><input type="text" inputmode="text" autocomplete="off" autocapitalize="characters" spellcheck="false" maxlength="6" placeholder="o escribe el código (ej. K7PX)"><button class="btn primario">OK</button></form>
          <button class="btn esc-cerrar">Cerrar</button>
        </div>`;
      capas.appendChild(ov);
      const video = $('video', ov), msg = $('.esc-msg', ov);
      let stream = null, activo = true, detector = null;
      const cv = document.createElement('canvas'), cx = cv.getContext('2d', { willReadFrequently: true });
      function fin(valor) { if (!activo) return; activo = false; if (stream) stream.getTracks().forEach(t => t.stop()); ov.remove(); resolve(valor); }
      $('.esc-cerrar', ov).addEventListener('click', () => fin(null));
      $('.esc-manual', ov).addEventListener('submit', e => { e.preventDefault(); const v = $('input', ov).value.trim().toUpperCase(); if (v) fin(v); });
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { msg.textContent = 'Este navegador no deja usar la cámara aquí. Escribe el código de la tarjeta.'; ov.classList.add('sin-camara'); return; }
      navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false })
        .then(s => {
          if (!activo) { s.getTracks().forEach(t => t.stop()); return; }
          stream = s; video.srcObject = s; video.play().catch(() => { });
          if ('BarcodeDetector' in window) { try { detector = new BarcodeDetector({ formats: ['qr_code'] }); } catch (e) { detector = null; } }
          let ultimo = 0;
          const bucle = async (ts) => {
            if (!activo) return;
            if (ts - ultimo > 160 && video.readyState >= 2) {
              ultimo = ts;
              try {
                let txt = null;
                if (detector) { const r = await detector.detect(video); if (r && r[0]) txt = r[0].rawValue; }
                else if (window.jsQR) {
                  const w = video.videoWidth, h = video.videoHeight, k = Math.min(1, 720 / Math.max(w, h));
                  cv.width = Math.round(w * k); cv.height = Math.round(h * k);
                  cx.drawImage(video, 0, 0, cv.width, cv.height);
                  const img = cx.getImageData(0, 0, cv.width, cv.height);
                  const r = window.jsQR(img.data, cv.width, cv.height, { inversionAttempts: 'attemptBoth' });
                  if (r && r.data) txt = r.data;
                }
                if (txt) { vibra(60); sfx.clic(); fin(txt); return; }
              } catch (e) { detector = null; }
            }
            requestAnimationFrame(bucle);
          };
          requestAnimationFrame(bucle);
        })
        .catch(() => { msg.textContent = 'No pudimos abrir la cámara (revisa los permisos). Puedes escribir el código que viene en la tarjeta.'; ov.classList.add('sin-camara'); });
    });
  }
  function leeTexto(txt) {
    if (!txt) return null;
    txt = String(txt).trim();
    let m = txt.match(/#\/q\/([A-Za-z0-9]{4})/); if (m) return { tipo: 'q', v: m[1].toUpperCase() };
    m = txt.match(/#\/s\/([A-Za-z0-9_\-]+)/); if (m) return { tipo: 's', v: m[1] };
    m = txt.replace(/[\s-]/g, '').match(/^([A-Za-z0-9]{4})$/); if (m) return { tipo: 'q', v: m[1].toUpperCase() };
    return { tipo: 'x', v: txt };
  }
  async function botonEscanear() {
    const txt = await escanear();
    if (!txt) return;
    const r = leeTexto(txt);
    if (r.tipo === 's') return unirseConSobre(r.v);
    if (r.tipo === 'q') return procesar(r.v);
    sfx.error(); aviso('Ese código no es de este juego 🤔', 'mal');
  }

  /* ---------------- unirse a la partida ---------------- */
  async function confirmaCambio(nombre) {
    if (!E || E.fin || (E.paso === 0 && E.fase === 'buscando')) return true;
    if (E.fam.id === nombre) return true;
    return modal(`<h2>¿Cambiar de familia?</h2><p>Este teléfono ya va jugando con la familia <b>${esc(E.fam.n)}</b> (pista ${E.paso} de ${J.pasosPorFamilia}). Si cambian, se pierde ese avance.</p>`,
      { botones: [{ txt: 'No, seguir', valor: false }, { txt: 'Sí, cambiar', valor: true, clase: 'peligro' }] });
  }
  async function unirseConSobre(payload) {
    let d;
    try { d = b64dec(payload); } catch (e) { sfx.error(); aviso('No pude leer ese sobre 😕', 'mal'); return ir('#/'); }
    if (!d || !d.f || !Array.isArray(d.r) || !d.r.every(l => J.lugares[l])) { aviso('Sobre inválido', 'mal'); return ir('#/'); }
    if (E && E.fam.id === d.f && !E.fin && (E.paso > 0 || E.fase !== 'buscando')) { aviso('¡Ya están jugando con este sobre!'); return ir('#/juego'); }
    if (!(await confirmaCambio(d.f))) return ir('#/juego');
    let nombre = d.n;
    if (d.f === 'fx' && /invitada/i.test(nombre || '')) {
      const n = await pideTexto('¿Cómo se llama su familia?', 'Ej. Familia López', '');
      if (n) nombre = n.replace(/^familia\s+/i, '');
    }
    nuevaPartida(Object.assign({}, d, { n: nombre }));
    bienvenida();
  }
  async function unirseManual(id) {
    const f = famPorId(id);
    if (!(await confirmaCambio(id))) return;
    nuevaPartida(datosSobre(f));
    bienvenida();
  }
  async function bienvenida() {
    sfx.cascabel(); clip('tilin-trampa');
    await modal(`${tilinMini('risa')}<h2>¡Bienvenidos, familia ${esc(E.fam.n)}!</h2>
      <p class="msg-tilin">«${esc(J.mensajesTilin[0].replace('{familia}', E.fam.n))}»</p>
      <p class="firma">— Tilín 🔔</p>`, { botones: [{ txt: '¡Aceptamos el reto!', valor: 1, clase: 'primario' }] });
    if (E.fam.a) await misionAgente(0);
    if (E.fam.d) await presentaDescifradora();
    ir('#/juego');
  }
  async function presentaDescifradora() {
    await modal(`<div class="placa-agente">🔐</div><p class="sobre-titulo">Descifradora Oficial de Santa</p>
      <h2>¡${esc(E.fam.d)}!</h2><p>Santa te nombró <b>Descifradora Oficial</b>. Ayuda a tu familia con los códigos más difíciles.</p>
      <p>Cuando encuentren la <b>pista ${J.pasoRetoExperto}</b>, se abrirá tu <b>Reto Experto</b>: si lo resuelves, tu familia gana <b>1 comodín extra</b> 🔔.</p>
      <button class="btn audio-btn" data-audio="santa-carta-gaby">🔊 Mensaje de Santa</button>`,
      { clase: 'modal-descifradora', botones: [{ txt: '¡Lista! 🔐', valor: 1, clase: 'primario' }] });
  }
  function pideTexto(titulo, ph, valor) {
    const p = modal(`<h2>${esc(titulo)}</h2><form id="pide-form"><input class="campo" id="pide-texto" placeholder="${esc(ph)}" value="${esc(valor)}" autocomplete="off"></form>`,
      { botones: [{ txt: 'Cancelar', valor: null }, { txt: 'Listo', valor: 'ok', clase: 'primario' }] });
    let ultimo = valor || '';
    setTimeout(() => {
      const i = $('#pide-texto'), f = $('#pide-form'); if (!i) return;
      i.focus(); i.addEventListener('input', () => ultimo = i.value.trim());
      f.addEventListener('submit', e => { e.preventDefault(); ultimo = i.value.trim(); const b = f.closest('.modal').querySelector('.modal-botones .primario'); if (b) b.click(); });
    }, 50);
    return p.then(v => (v ? ultimo : null));
  }

  /* ---------------- misiones de la Agente Especial ---------------- */
  async function misionAgente(i) {
    const m = J.misionesAgente[i]; if (!m || !E.fam.a) return;
    const texto = m.texto.replace(/\{agente\}/g, E.fam.a);
    const hecho = await modal(`<div class="placa-agente">⭐</div><p class="sobre-titulo">Misión de la Agente Especial</p>
      <div class="mision-icono">${m.icono}</div><p class="mision-texto">${esc(texto)}</p>
      <button class="btn audio-btn" data-audio="mision-${i}">🔊 Escuchar</button>`,
      { clase: 'modal-agente', botones: [{ txt: 'Después', valor: false }, { txt: '¡Misión cumplida! ⭐', valor: true, clase: 'oro' }] });
    if (hecho && !E.misiones.includes(i)) {
      E.misiones.push(i); E.estrellas++; guarda(); sfx.exito(); confeti(); aviso(`⭐ ¡${E.fam.a} ganó una estrella de Agente!`);
      if (!E.bonoAgente && E.misiones.length >= J.misionesParaBono) {
        E.bonoAgente = true; E.comodines++; guarda();
        await modal(`<div class="placa-agente">⭐🔔</div><h2>¡Bono de la Agente!</h2><p><b>${esc(E.fam.a)}</b> ya cumplió ${J.misionesParaBono} misiones. Santa le regala a su familia <b>1 comodín extra</b>.</p>`, { clase: 'modal-agente', botones: [{ txt: '¡Gracias, Agente! ⭐', valor: 1, clase: 'oro' }] });
        render();
      }
    }
  }

  /* ---------------- reto experto (descifradora) ---------------- */
  function tieneExperto() { return !E.fam.a && !!(J.retosExpertos[E.fam.id] || J.retosExpertos.fx); }
  function retoExperto() { return Object.assign({ id: 'experto-' + E.fam.id }, J.retosExpertos[E.fam.id] || J.retosExpertos.fx); }
  async function resolverExperto(valor) {
    const r = retoExperto();
    if (!respuestaOk(r, valor)) { sfx.error(); vibra(150); aviso('¡Nop! Sigan descifrando 🔐', 'mal'); const inp = $('#resp-experto'); if (inp) { inp.classList.add('sacude'); setTimeout(() => inp.classList.remove('sacude'), 500); } return; }
    E.experto = true; E.verExperto = false; E.comodines++; guarda(); sfx.exito(); confeti();
    await modal(`<div class="placa-agente">🔐✅</div><h2>¡Reto Experto resuelto!</h2><p class="explica">${esc(r.explica || '')}</p>
      <p>${E.fam.d ? `¡Bien hecho, <b>${esc(E.fam.d)}</b>! ` : ''}Su familia gana <b>1 comodín extra</b> 🔔.</p>`, { clase: 'modal-descifradora', botones: [{ txt: '¡Sí! 🎉', valor: 1, clase: 'primario' }] });
    render();
  }

  /* ---------------- procesar un código escaneado ---------------- */
  async function procesar(c) {
    const info = CODIGOS[c];
    if (!info) { sfx.error(); aviso(`El código ${c} no existe. Revísenlo bien 🧐`, 'mal'); return ir(E ? '#/juego' : '#/'); }
    if (info.tipo === 'cofre') return ir('#/final');
    if (info.tipo === 'carta') return cartaSanta(info.cual);
    if (!E) {
      await modal(`${tilinMini('sonrisa')}<h2>¡Primero el Sobre de Misión!</h2><p>Antes de buscar pistas, este teléfono necesita unirse a una familia. Escaneen el código de su <b>Sobre de Misión</b>.</p>`);
      return ir('#/');
    }
    if (congelados()) return ir('#/juego');
    if (info.tipo === 'regalo') return abrirRegalo(info.n);
    const otra = info.fam !== E.fam.id;
    if (otra) {
      const f = famPorId(info.fam); sfx.error();
      await modal(`<div class="color-chip" style="background:${f.color}"></div><h2>Esta tarjeta no es suya</h2>
        <p>Es de la familia <b style="color:${f.color}">${esc(f.nombre)}</b> (color ${esc(f.colorNombre.toLowerCase())}).</p><p><b>¡Déjenla donde estaba!</b> Ustedes busquen tarjetas de color <b style="color:${E.fam.color}">${esc(famPorId(E.fam.id).colorNombre.toLowerCase())}</b>.</p>`);
      return ir('#/juego');
    }
    if (info.tipo === 'trampa') return caerEnTrampa(c, info);
    // lugar de su ruta
    const k = E.fam.r.indexOf(info.lugar);
    if (k < 0) { await modal(`<h2>Mmm… 🤔</h2><p>Esta tarjeta es de su color, pero no forma parte de su ruta. Avísenle al organizador.</p>`); return ir('#/juego'); }
    if (E.fin || E.fase === 'terminado') { aviso('¡Ya terminaron todas sus pistas! Vayan al cofre 🔐'); return ir('#/juego'); }
    if (k === E.paso && E.fase === 'buscando') return encontrarLugar();
    if (k === E.paso - 1 && E.fase === 'reto') { aviso('Ya escanearon esta. Ahora resuelvan el reto 🧩'); return ir('#/juego'); }
    if (k < E.paso) { aviso('Esa pista ya la habían encontrado 👍'); return ir('#/juego'); }
    await modal(`${tilinMini('o')}<h2>¡Alto ahí!</h2><p>Esta tarjeta sí es suya… <b>pero todavía no es su turno</b>. Déjenla exactamente donde estaba y sigan la pista que tienen ahora.</p>`);
    ir('#/juego');
  }

  async function encontrarLugar() {
    E.paso++; E.fase = 'reto'; guarda();
    sfx.exito(); vibra([80, 40, 80]); confeti(); clip('tilin-pista');
    await modal(`<p class="sobre-titulo">¡Pista ${E.paso} de ${J.pasosPorFamilia} encontrada!</p>${tilinMini('enojo')}
      <p class="msg-tilin">«${esc(J.mensajesTilin[E.paso] || '')}»</p><p class="firma">— Tilín</p>`,
      { botones: [{ txt: 'Ver el reto 🧩', valor: 1, clase: 'primario' }] });
    if (E.fam.a) await misionAgente(E.paso);
    ir('#/juego');
  }

  async function caerEnTrampa(c, info) {
    if (E.trampas.includes(c)) { sfx.error(); aviso('¡Esa trampa ya la conocen! No se dejen engañar 😏', 'mal'); return ir('#/juego'); }
    E.trampas.push(c);
    E.congelado = Date.now() + J.segundosCongelados * 1000;
    E.castigo = J.castigos[Math.floor(Math.random() * J.castigos.length)];
    guarda(); clip('tilin-trampa'); vibra([200, 100, 200, 100, 400]);
    ir('#/juego');
  }
  function congelados() { return E && E.congelado && Date.now() < E.congelado; }

  async function abrirRegalo(n) {
    const g = J.regalosFalsos.find(x => x.id === n);
    if (E.regalos.includes(n)) { aviso('Este regalo ya lo abrieron 🎁'); return ir('#/juego'); }
    E.regalos.push(n);
    let extra = '';
    if (g.efecto === 'comodin') { E.comodines++; extra = '<p class="premio">+1 comodín 🔔</p>'; sfx.exito(); confeti(); }
    else { clip('tilin-regalo'); }
    if (g.efecto === 'congelar') { E.congelado = Date.now() + (g.segundos || 30) * 1000; E.castigo = '¡Quietos! Nadie se mueve hasta que termine el tiempo.'; }
    guarda();
    await modal(`<p class="sobre-titulo">Regalo sorpresa</p><div class="regalo-grande">${A.svg(A.regalo(g.efecto === 'comodin' ? '#f5c542' : '#7c5cbf', '#fff'), '0 0 100 100', 'width="110"')}</div>
      <h2>${esc(g.titulo)}</h2><p>${esc(g.mensaje)}</p>${extra}`, { botones: [{ txt: g.efecto === 'congelar' ? 'Ay no… 🥶' : 'Continuar', valor: 1, clase: 'primario' }] });
    ir('#/juego');
  }

  async function cartaSanta(cual) {
    const gaby = cual === 'descifradora';
    await modal(`<div class="sello-santa">🎅</div><h2>Mensaje de Santa</h2><p>Para la ${gaby ? 'Descifradora Oficial' : 'Agente Especial'} <b>${esc(gaby ? J.descifradora : J.agente)}</b>.</p>
      <button class="btn oro audio-btn" data-audio="${gaby ? 'santa-carta-gaby' : 'santa-carta'}">🔊 Escuchar a Santa</button>`, { clase: gaby ? 'modal-descifradora' : 'modal-agente', botones: [{ txt: 'Cerrar', valor: 1 }] });
    ir(E ? '#/juego' : '#/');
  }

  /* ---------------- acertijos de lugar y retos ---------------- */
  function presentacion(paso) {
    const tipos = J.ciclosPresentacion; return tipos[(paso + (E.fam.idx || 0) * 3) % tipos.length];
  }
  function acertijoHTML(paso) {
    const L = J.lugares[E.fam.r[paso]];
    const tipo = presentacion(paso);
    const det = `<p class="detalle">🔎 Cuando lo descubran, la tarjeta está <b>${esc(L.detalle)}</b>.</p>`;
    switch (tipo) {
      case 'poema': return { tipo: 'Acertijo', html: `<p class="poema">${esc(L.poema).replace(/\n/g, '<br>')}</p>` };
      case 'cesar': { const k = 3 + ((paso + (E.fam.idx || 0)) % 5); return { tipo: 'Mensaje cifrado', html: `<p>Tilín escondió el lugar con la <b>Rueda del Duende</b> (clave <b>${k}</b>). Cada letra se recorrió ${k} lugares hacia adelante en el abecedario (con Ñ). Regrésenlas ${k} lugares:</p><div class="cifra">${cesar(L.palabra, k)}</div>${det}<a class="kit-link" href="#/kit/rueda">🧰 Abrir la Rueda del Duende</a>` }; }
      case 'anagrama': return { tipo: 'Letras revueltas', html: `<p>Tilín revolvió las letras del lugar. Ordénenlas:</p><div class="cifra">${anagrama(L.palabra, E.fam.id + paso)}</div>${det}` };
      case 'emoji': return { tipo: 'Acertijo en emojis', html: `<p>¿Qué lugar de la casa es?</p><div class="emoji-grande">${L.emoji}</div>${det}` };
      case 'simbolos': return { tipo: 'Alfabeto del Duende', html: `<p>Tilín escribió el lugar con su <b>alfabeto secreto</b>:</p><div class="cifra-glifos">${glifosHTML(L.palabra, 46, '#2b1a10')}</div>${det}<a class="kit-link" href="#/kit/alfabeto">🧰 Abrir el Alfabeto del Duende</a>` };
    }
  }
  function retoDelPaso(paso) { const id = (J.retosPorFamilia[E.fam.id] || J.retosPorFamilia.rm)[paso - 1]; return Object.assign({ id }, J.retos[id]); }
  function retoHTML(r) {
    let extra = '';
    if (r.tipo === 'morse') extra = `<div class="cifra morse">${morseHTML(r.palabra)}</div><a class="kit-link" href="#/kit/morse">🧰 Abrir la tabla de cascabeles</a>`;
    if (r.tipo === 'cesar') extra = `<div class="cifra">${cesar(r.palabra, r.clave)}</div><a class="kit-link" href="#/kit/rueda">🧰 Abrir la Rueda del Duende</a>`;
    if (r.tipo === 'doble') extra = `<div class="cifra-glifos">${glifosHTML(cesar(r.palabra, r.clave), 40, '#2b1a10')}</div><a class="kit-link" href="#/kit/alfabeto">🧰 Alfabeto</a> · <a class="kit-link" href="#/kit/rueda">🧰 Rueda del Duende</a>`;
    if (r.tipo === 'simbolos') extra = `<div class="cifra-glifos">${glifosHTML(r.palabra, 46, '#2b1a10')}</div><a class="kit-link" href="#/kit/alfabeto">🧰 Abrir el Alfabeto del Duende</a>`;
    if (r.tipo === 'anagrama') extra = `<div class="cifra">${anagrama(r.palabra, 'reto')}</div>`;
    if (r.tipo === 'espejo') extra = `<div class="cifra espejo">${mayus(r.palabra).split('').reverse().join('')}</div>`;
    return `<p class="reto-texto">${esc(r.texto)}</p>${extra}`;
  }
  function respuestaOk(r, v) {
    const n = norm(v); if (!n) return false;
    if (r.respuestas.some(x => norm(x) === n)) return true;
    if (r.contiene && r.contiene.some(x => n.includes(norm(x)))) return true;
    const sinEsp = n.replace(/\s/g, '');
    return r.respuestas.some(x => norm(x).replace(/\s/g, '') === sinEsp);
  }
  async function resolverReto(valor) {
    const r = retoDelPaso(E.paso);
    if (!respuestaOk(r, valor)) {
      E.fallos[r.id] = (E.fallos[r.id] || 0) + 1; guarda();
      sfx.error(); vibra(150);
      if (E.fallos[r.id] % 3 === 0) clip('tilin-mal');
      aviso(E.fallos[r.id] >= 3 ? '¡Nop! Si se atoran, usen un comodín 🔔' : '¡Nop! Intenten otra vez 😜', 'mal');
      const inp = $('#respuesta'); if (inp) { inp.classList.add('sacude'); setTimeout(() => inp.classList.remove('sacude'), 500); }
      return;
    }
    const pasoDigito = J.pasosConDigito.indexOf(E.paso);
    let html = `<h2>¡Correcto! 🎉</h2><p class="explica">${esc(r.explica || '')}</p>`;
    if (pasoDigito >= 0) {
      E.digitos[pasoDigito] = E.fam.c[pasoDigito];
      html += `<p class="sobre-titulo">Ganaron un número del candado</p>
        <div class="digito-revela"><span>${E.fam.c[pasoDigito]}</span></div><p>Es el <b>${['primer', 'segundo', 'tercer', 'cuarto'][pasoDigito]}</b> número de su candado.</p>${candadoHTML(true)}`;
    }
    if (E.paso >= J.pasosPorFamilia) { E.fase = 'terminado'; E.fin = Date.now(); }
    else E.fase = 'buscando';
    guarda(); sfx.exito(); confeti();
    await modal(html, { botones: [{ txt: E.fase === 'terminado' ? '¡Ver el código completo! 🔐' : 'Ver la siguiente pista 🗺️', valor: 1, clase: 'primario' }] });
    if (E.fase === 'terminado') { clip('tilin-final'); await modal(`${tilinMini('triste')}<p class="msg-tilin">«${esc(J.mensajesTilin[J.pasosPorFamilia])}»</p>
      <p class="sobre-titulo">Código de su candado</p>${candadoHTML(true, true)}<p>Corran al <b>Cofre Encantado</b> y abran el candado de color <b style="color:${E.fam.color}">${esc(famPorId(E.fam.id).colorNombre.toLowerCase())}</b>.</p>`,
      { botones: [{ txt: '¡Vamos al cofre!', valor: 1, clase: 'oro' }] }); }
    render();
    window.scrollTo(0, 0);
  }
  async function usarComodin(clave, nivel, txt) {
    if (E.comodines <= 0) { sfx.error(); return modal(`<h2>Sin comodines 😬</h2><p>Ya se acabaron sus cascabeles de ayuda. Busquen regalos sorpresa: algunos traen comodines… o pídanle una pista al organizador.</p>`); }
    const ok = await modal(`<h2>¿Usar un comodín? 🔔</h2><p>Les quedan <b>${E.comodines}</b>. ${esc(txt)}</p>`, { botones: [{ txt: 'No', valor: false }, { txt: 'Sí, usar', valor: true, clase: 'primario' }] });
    if (!ok) return;
    E.comodines--; E.usados++; E.ayudas[clave] = nivel; guarda(); sfx.cascabel(); render();
  }
  function candadoHTML(grande = false, completo = false) {
    const ds = completo ? E.fam.c.split('') : E.digitos;
    return `<div class="candado ${grande ? 'grande' : ''}" style="--fam:${E.fam.color}"><div class="candado-arco"></div><div class="candado-cuerpo">${ds.map(d => `<span class="${d == null ? 'vacio' : ''}">${d == null ? '?' : d}</span>`).join('')}</div></div>`;
  }
  function tilinMini(boca = 'sonrisa', cejas) { return `<div class="tilin-mini">${A.svg(A.tilin({ boca, cejas: cejas || (boca === 'enojo' ? 'enojo' : boca === 'triste' ? 'triste' : 'picaro') }), '0 0 200 320')}</div>`; }
  function iconoFam(f, tam = 34) { return A.svg(A.icono(f.icono, '#fff', 'rgba(0,0,0,.35)'), '0 0 100 100', `width="${tam}" height="${tam}"`); }

  function expertoHTML() {
    if (!E || congelados() || !tieneExperto()) return '';
    const quien = E.fam.d ? ` de ${esc(E.fam.d)}` : '';
    if (E.experto) return `<p class="experto-listo">🔐 Reto Experto${quien}: ¡resuelto! (+1 🔔)</p>`;
    if (E.paso < J.pasoRetoExperto) return `<button class="btn experto-btn" disabled>🔒 Reto Experto${quien} · se abre en la pista ${J.pasoRetoExperto}</button>`;
    if (!E.verExperto) return `<button class="btn experto-btn" id="btn-experto">🔐 Reto Experto${quien} <small>(+1 🔔)</small></button>`;
    const r = retoExperto(), nivel = E.ayudas.X || 0;
    return `<section class="pergamino experto">
      <p class="sobre-titulo">🔐 Reto Experto${quien} · ${esc(r.titulo)}</p>
      ${retoHTML(r)}
      ${nivel >= 1 ? `<p class="ayuda">🔔 Pista: ${esc(r.pista)}</p>` : ''}
      ${nivel >= 2 ? `<p class="ayuda">🔔🔔 Respuesta: <b>${esc(r.respuestas[0])}</b></p>` : ''}
      <form id="form-experto" class="form-reto"><input id="resp-experto" class="campo" autocomplete="off" autocapitalize="none" spellcheck="false" placeholder="Respuesta"><button class="btn primario">Responder</button></form>
      <div class="fila-botones"><button class="btn chico" id="btn-experto">Cerrar por ahora</button>${nivel < 2 ? '<button class="btn chico" id="ayuda-experto">🔔 Usar comodín</button>' : ''}</div>
    </section>`;
  }

  /* ======================= VISTAS ======================= */
  const vistas = {};
  let relojTimer = null;

  vistas.inicio = () => {
    const c = cfg();
    const enCurso = E && E.fam;
    app.innerHTML = `
      <section class="portada">
        <div class="portada-tilin">${A.svg(A.tilin({ boca: 'risa', cejas: 'feliz' }), '0 0 200 320')}</div>
        <h1 class="titulo-grande">El Gran Robo<br><span>de Navidad</span></h1>
        <p class="lema">El duende <b>Tilín</b> se robó los regalos y los encerró en su Cofre Encantado. ¿Podrán recuperarlos?</p>
      </section>
      ${enCurso ? `<a class="tarjeta-continuar" href="#/juego" style="--fam:${E.fam.color}">
          <span class="fam-icono">${iconoFam(famPorId(E.fam.id) || { icono: 'estrella' })}</span>
          <span><small>Continuar misión</small><b>Familia ${esc(E.fam.n)}</b><small>${E.fin ? '¡Código completo! 🔐' : `Pista ${Math.min(E.paso + (E.fase === 'buscando' ? 1 : 0), J.pasosPorFamilia)} de ${J.pasosPorFamilia}`}</small></span><span class="flecha">›</span></a>` : ''}
      <div class="botones-inicio">
        <a class="btn grande" href="#/historia">📽️ Ver la historia</a>
        <button class="btn grande primario" id="btn-sobre">📷 ${enCurso ? 'Escanear código' : 'Escanear Sobre de Misión'}</button>
        <a class="btn grande" href="#/kit">🧰 Kit del detective</a>
      </div>
      ${!enCurso ? `<p class="nota">¿No tienen sobre? <a href="#/unirse">Elegir familia a mano</a></p>` : ''}
      <footer class="pie"><a href="#/org">🔑 Organizador</a> · <a href="#/unirse">Familias</a></footer>`;
    $('#btn-sobre').addEventListener('click', botonEscanear);
  };

  vistas.historia = () => {
    const c = cfg();
    app.innerHTML = `
      <h1 class="titulo-seccion">La historia</h1>
      <div class="video-caja"><video src="media/intro.mp4" poster="img/poster-intro.jpg" controls playsinline preload="metadata"></video></div>
      <p class="nota">Pónganlo en la tele o en una bocina para que todos lo escuchen. 🔊</p>
      <h2 class="titulo-seccion chico">El cuento</h2>
      <div class="cuento">${(window.CUENTO || []).map((p, i) => `
        <figure class="pagina-cuento"><img src="img/cuento/${p.img}.jpg" alt="" loading="lazy"><figcaption>${p.texto.replace(/\n/g, '<br>')}</figcaption></figure>`).join('')}
        <p class="continuara">Continuará… 🔐</p>
      </div>`;
  };

  vistas.unirse = () => {
    const c = cfg();
    app.innerHTML = `<h1 class="titulo-seccion">¿Qué familia son?</h1>
      <p class="nota">Lo normal es escanear el <b>Sobre de Misión</b>. Si no lo tienen, elijan aquí.</p>
      <div class="lista-familias">${c.familias.filter(f => f.activa).map(f => `
        <button class="familia-btn" data-id="${f.id}" style="--fam:${f.color}"><span class="fam-icono">${iconoFam(f, 40)}</span><span><b>${esc(f.nombre)}</b><small>Tarjetas color ${esc(f.colorNombre.toLowerCase())}${f.agente ? ' · Agente ' + esc(f.agente) : ''}${f.descifradora ? ' · Descifradora ' + esc(f.descifradora) : ''}</small></span></button>`).join('')}
      </div>
      <button class="btn" id="btn-otra">＋ Activar otra familia</button>`;
    $$('.familia-btn').forEach(b => b.addEventListener('click', () => unirseManual(b.dataset.id)));
    $('#btn-otra').addEventListener('click', async () => {
      if (!(await pidePin())) return;
      const inact = cfg().familias.filter(f => !f.activa);
      if (!inact.length) return aviso('Ya están activas todas las familias');
      const f = inact[0];
      const n = await pideTexto('Nombre de la nueva familia', 'Ej. López García', f.nombre === 'Familia Invitada' ? '' : f.nombre);
      const o = store.get('rgn-config', {}); o.familias = o.familias || {}; o.familias[f.id] = Object.assign(o.familias[f.id] || {}, { activa: true }, n ? { nombre: n } : {}); store.set('rgn-config', o);
      aviso(`Familia ${n || f.nombre} activada (tarjetas color ${f.colorNombre.toLowerCase()})`); render();
    });
  };

  vistas.juego = () => {
    clearInterval(relojTimer);
    if (!E) { app.innerHTML = `<div class="vacio">${tilinMini('sonrisa')}<h2>Aún no empiezan</h2><p>Escaneen su Sobre de Misión para comenzar.</p><button class="btn primario grande" id="btn-sobre">📷 Escanear sobre</button><p class="nota"><a href="#/unirse">o elegir familia a mano</a></p></div>`; $('#btn-sobre').addEventListener('click', botonEscanear); return; }
    const f = famPorId(E.fam.id) || {};
    const total = J.pasosPorFamilia;
    let principal = '';
    if (congelados()) {
      principal = `<section class="congelado"><div class="hielo">🥶</div><h2>¡CAYERON EN UNA TRAMPA!</h2>
        <p class="castigo">${esc(E.castigo)}</p><p class="cuenta" id="cuenta">--</p><p>Tilín los dejó congelados. Cuando acabe el tiempo podrán seguir.</p>${tilinMini('risa', 'feliz')}</section>`;
    } else if (E.fase === 'buscando') {
      const a = acertijoHTML(E.paso), clave = 'L' + E.paso, nivel = E.ayudas[clave] || 0, L = J.lugares[E.fam.r[E.paso]];
      principal = `<section class="pergamino">
        <p class="sobre-titulo">Pista ${E.paso + 1} de ${total} · ${a.tipo}</p>
        ${a.html}
        ${nivel >= 1 ? `<p class="ayuda">🔔 Pista: ${esc(L.pista1)}</p>` : ''}
        ${nivel >= 2 ? `<p class="ayuda">🔔🔔 Es: <b>${esc(L.nombre)}</b>. La tarjeta está ${esc(L.detalle)}.</p>` : ''}
        <p class="instruccion">Vayan a ese lugar, busquen la tarjeta de color <b style="color:${E.fam.color}">${esc((f.colorNombre || '').toLowerCase())}</b> y escanéenla.</p>
        ${nivel < 2 ? `<button class="btn chico" id="btn-ayuda">🔔 Usar comodín (${nivel === 0 ? 'pista' : 'respuesta'})</button>` : ''}
      </section>`;
    } else if (E.fase === 'reto') {
      const r = retoDelPaso(E.paso), clave = 'R' + E.paso, nivel = E.ayudas[clave] || 0;
      principal = `<section class="pergamino reto">
        <p class="sobre-titulo">Reto ${E.paso} de ${total} · ${esc(r.titulo)}</p>
        ${retoHTML(r)}
        ${nivel >= 1 ? `<p class="ayuda">🔔 Pista: ${esc(r.pista)}</p>` : ''}
        ${nivel >= 2 ? `<p class="ayuda">🔔🔔 Respuesta: <b>${esc(r.respuestas[0])}</b></p>` : ''}
        <form id="form-reto" class="form-reto"><input id="respuesta" class="campo" autocomplete="off" autocapitalize="none" spellcheck="false" placeholder="Escriban su respuesta"><button class="btn primario">Responder</button></form>
        ${J.pasosConDigito.includes(E.paso) ? '<p class="nota">🔐 ¡Este reto da un número del candado!</p>' : ''}
        ${nivel < 2 ? `<button class="btn chico" id="btn-ayuda">🔔 Usar comodín (${nivel === 0 ? 'pista' : 'respuesta'})</button>` : ''}
      </section>`;
    } else {
      principal = `<section class="pergamino final-ruta">
        <p class="sobre-titulo">¡Recuperaron su código!</p>
        ${candadoHTML(true, true)}
        <p>Vayan al <b>Cofre Encantado</b> y abran el candado <b style="color:${E.fam.color}">${esc((f.colorNombre || '').toLowerCase())}</b>.</p>
        ${E.candado ? `<p class="premio">✅ Candado abierto a los ${fmtTiempo(E.candado - E.inicio)}</p>` : `<button class="btn oro grande" id="btn-candado">🔓 ¡Ya abrimos nuestro candado!</button>`}
        <p class="nota">El cofre se abre cuando TODAS las familias quiten su candado y la Agente Especial use la Llave Dorada. Adentro hay un último código QR… 👀</p>
      </section>`;
    }
    app.innerHTML = `
      <section class="panel-familia" style="--fam:${E.fam.color}">
        <div class="pf-nombre"><span class="fam-icono">${iconoFam(f)}</span><div><small>Familia</small><b>${esc(E.fam.n)}</b></div></div>
        <div class="pf-datos"><span title="Tiempo">⏱️ <b id="reloj">${fmtTiempo((E.fin || Date.now()) - E.inicio)}</b></span><span title="Comodines">🔔 <b>${E.comodines}</b></span>${E.fam.a ? `<span title="Estrellas de ${esc(E.fam.a)}">⭐ <b>${E.estrellas}</b></span>` : ''}</div>
      </section>
      <div class="progreso" aria-label="Progreso">${Array.from({ length: total }, (_, i) => `<span class="${i < E.paso ? 'hecho' : i === E.paso && !E.fin ? 'actual' : ''}">${i < E.paso ? '✓' : i + 1}</span>`).join('')}</div>
      <div class="fila-candado">${candadoHTML()}<p>Números del candado: <b>${E.digitos.filter(d => d != null).length} de 4</b></p></div>
      ${principal}
      ${E.fam.a && !congelados() ? `<button class="btn agente-btn" id="btn-mision">⭐ Misión de ${esc(E.fam.a)}${E.bonoAgente ? '' : ` <small>(${Math.min(E.misiones.length, J.misionesParaBono)}/${J.misionesParaBono} para +1 🔔)</small>`}</button>` : ''}
      ${expertoHTML()}
      <div class="barra-escanear"><button class="btn primario grande" id="btn-escanear" ${congelados() ? 'disabled' : ''}>📷 Escanear tarjeta</button><a class="btn" href="#/kit">🧰</a></div>`;
    const reloj = $('#reloj');
    relojTimer = setInterval(() => {
      if (!document.body.contains(reloj)) return clearInterval(relojTimer);
      reloj.textContent = fmtTiempo((E.fin || Date.now()) - E.inicio);
      const cu = $('#cuenta');
      if (cu) { const s = Math.ceil((E.congelado - Date.now()) / 1000); if (s <= 0) { E.congelado = 0; guarda(); sfx.ding(); render(); } else cu.textContent = s + ' s'; }
    }, 500);
    const be = $('#btn-escanear'); if (be) be.addEventListener('click', botonEscanear);
    const fr = $('#form-reto'); if (fr) fr.addEventListener('submit', e => { e.preventDefault(); resolverReto($('#respuesta').value); });
    const ba = $('#btn-ayuda');
    if (ba) ba.addEventListener('click', () => {
      const clave = (E.fase === 'reto' ? 'R' : 'L') + E.paso, nivel = (E.ayudas[clave] || 0) + 1;
      usarComodin(clave, nivel, nivel === 1 ? 'Les damos una pista.' : 'Les decimos la respuesta.');
    });
    const bc = $('#btn-candado');
    if (bc) bc.addEventListener('click', async () => {
      const ok = await modal(`<h2>¿Ya quitaron su candado? 🔓</h2><p>Confirmen sólo si el candado de su color ya está abierto.</p>`, { botones: [{ txt: 'Todavía no', valor: false }, { txt: '¡Sí!', valor: true, clase: 'oro' }] });
      if (ok) { E.candado = Date.now(); guarda(); sfx.exito(); confeti(); render(); }
    });
    const bx = $('#btn-experto'); if (bx) bx.addEventListener('click', () => { E.verExperto = !E.verExperto; guarda(); render(); });
    const fx = $('#form-experto'); if (fx) fx.addEventListener('submit', e => { e.preventDefault(); resolverExperto($('#resp-experto').value); });
    const ax = $('#ayuda-experto'); if (ax) ax.addEventListener('click', () => usarComodin('X', (E.ayudas.X || 0) + 1, (E.ayudas.X || 0) ? 'Les decimos la respuesta.' : 'Les damos una pista.'));
    const bm = $('#btn-mision');
    if (bm) bm.addEventListener('click', () => { const pend = J.misionesAgente.map((_, i) => i).filter(i => i <= E.paso && !E.misiones.includes(i)); misionAgente(pend.length ? pend[0] : Math.min(E.paso, J.misionesAgente.length - 1)); });
  };

  vistas.kit = (sub) => {
    sub = sub || 'rueda';
    const tabs = [['rueda', 'Rueda del Duende'], ['alfabeto', 'Alfabeto'], ['morse', 'Cascabeles']];
    let cuerpo = '';
    if (sub === 'rueda') {
      cuerpo = `<p>Para descifrar, cada letra del mensaje se <b>regresa</b> tantos lugares como diga la clave. Muevan la clave y lean: arriba la letra del mensaje, abajo la letra verdadera.</p>
        <label class="clave">Clave: <button class="btn chico" id="k-menos">−</button><b id="k-val">3</b><button class="btn chico" id="k-mas">＋</button></label>
        <div class="tira" id="tira"></div>
        <form id="f-descifra" class="form-reto"><input class="campo" id="t-cifrado" placeholder="Escriban el mensaje cifrado" autocapitalize="characters"><button class="btn primario">Descifrar</button></form>
        <p class="resultado" id="t-resultado"></p>`;
    } else if (sub === 'alfabeto') {
      cuerpo = `<p>Cada letra tiene su dibujo secreto. ¡Comparen con cuidado los puntitos!</p>
        <div class="tabla-glifos">${ABC.split('').map(l => `<div>${A.glifo(l, 40, '#2b1a10')}<b>${l}</b></div>`).join('')}</div>`;
    } else {
      cuerpo = `<p>Un «tilín» corto es <b>punto (•)</b> y un «tiliiiín» largo es <b>raya (—)</b>. Las letras se separan con <b>/</b>.</p>
        <div class="tabla-morse">${ABC.split('').map(l => `<div><b>${l}</b><span>${MORSE[l].replace(/\./g, '•').replace(/-/g, '—')}</span></div>`).join('')}</div>`;
    }
    app.innerHTML = `<h1 class="titulo-seccion">🧰 Kit del detective</h1>
      <nav class="pestanas">${tabs.map(([k, t]) => `<a href="#/kit/${k}" class="${k === sub ? 'activa' : ''}">${t}</a>`).join('')}</nav>
      <section class="pergamino">${cuerpo}</section>
      ${E ? '<a class="btn" href="#/juego">← Regresar al juego</a>' : ''}`;
    if (sub === 'rueda') {
      let k = 3;
      const pinta = () => {
        $('#k-val').textContent = k;
        $('#tira').innerHTML = `<div class="tira-fila"><small>Mensaje</small>${ABC.split('').map((_, i) => `<span>${ABC[(i + k) % 27]}</span>`).join('')}</div><div class="tira-fila real"><small>Verdad</small>${ABC.split('').map(l => `<span>${l}</span>`).join('')}</div>`;
        const t = $('#t-cifrado').value; if (t) $('#t-resultado').textContent = '→ ' + cesar(t, 27 - k);
      };
      $('#k-menos').addEventListener('click', () => { k = (k + 26) % 27 || 26; pinta(); });
      $('#k-mas').addEventListener('click', () => { k = k % 26 + 1; pinta(); });
      $('#f-descifra').addEventListener('submit', e => { e.preventDefault(); pinta(); });
      pinta();
    }
  };

  vistas.final = () => {
    sfx.exito(); confeti();
    const resumen = E ? `<div class="resumen" style="--fam:${E.fam.color}"><h2>Familia ${esc(E.fam.n)}</h2>
      <ul><li>⏱️ Tiempo: <b>${E.fin ? fmtTiempo(E.fin - E.inicio) : '—'}</b></li><li>🔔 Comodines usados: <b>${E.usados}</b></li><li>🪤 Trampas: <b>${E.trampas.length}</b></li><li>🎁 Regalos sorpresa: <b>${E.regalos.length}</b></li>${E.fam.a ? `<li>⭐ Estrellas de ${esc(E.fam.a)}: <b>${E.estrellas}</b></li>` : ''}${E.fam.d || tieneExperto() ? `<li>🔐 Reto Experto${E.fam.d ? ' de ' + esc(E.fam.d) : ''}: <b>${E.experto ? '¡resuelto!' : 'pendiente'}</b></li>` : ''}</ul></div>` : '';
    app.innerHTML = `<h1 class="titulo-grande chico">¡Recuperaron<br><span>la Navidad!</span></h1>
      <div class="video-caja"><video src="media/final.mp4" poster="img/poster-final.jpg" controls playsinline preload="auto"></video></div>
      <p class="nota">Dale ▶️ para ver qué pasó con Tilín.</p>
      ${resumen}
      <a class="btn" href="#/">Inicio</a>`;
  };

  /* ---------------- organizador ---------------- */
  async function pidePin() {
    try { if (sessionStorage.getItem('rgn-pin') === 'ok') return true; } catch (e) { }
    const v = await pideTexto('PIN del organizador', 'PIN', '');
    if (v === J.pinOrganizador) { try { sessionStorage.setItem('rgn-pin', 'ok'); } catch (e) { } return true; }
    if (v != null) { sfx.error(); aviso('PIN incorrecto', 'mal'); }
    return false;
  }
  vistas.org = async () => {
    app.innerHTML = '';
    if (!(await pidePin())) return ir('#/');
    const c = cfg();
    const opcionesLugar = sel => Object.entries(J.lugares).map(([k, L]) => `<option value="${k}" ${k === sel ? 'selected' : ''}>${esc(L.nombre)} (${esc(L.zona)})</option>`).join('');
    app.innerHTML = `<h1 class="titulo-seccion">🔑 Panel del organizador</h1>
      <section class="pergamino">
        <h2>1 · Familias</h2>
        ${c.familias.map(f => `<div class="org-fam" style="--fam:${f.color}">
          <label class="chk"><input type="checkbox" data-f="${f.id}" data-k="activa" ${f.activa ? 'checked' : ''}> Juega</label>
          <input class="campo" data-f="${f.id}" data-k="nombre" value="${esc(f.nombre)}" aria-label="Nombre">
          <label>Candado <input class="campo corto" data-f="${f.id}" data-k="codigo" value="${esc(f.codigo)}" inputmode="numeric" maxlength="4"></label>
          <label>Agente <input class="campo medio" data-f="${f.id}" data-k="agente" value="${esc(f.agente || '')}" placeholder="(nadie)"></label>
          <label>Descifradora <input class="campo medio" data-f="${f.id}" data-k="descifradora" value="${esc(f.descifradora || '')}" placeholder="(nadie)"></label>
          <small>Tarjetas color ${esc(f.colorNombre.toLowerCase())}</small></div>`).join('')}
        <h2>2 · Los ${J.pasosPorFamilia} escondites</h2>
        <p class="nota">Cada familia los recorre en distinto orden. Si en tu casa no existe alguno, cámbialo por otro.</p>
        ${c.ruta.map((r, i) => `<label class="org-lugar">${i + 1}. <select class="campo" data-ruta="${i}">${opcionesLugar(r)}</select></label>`).join('')}
        <h2>3 · Dirección de la app</h2>
        <p class="nota">Los QR apuntan a: <code id="base-actual">${esc(baseUrl())}</code></p>
        <input class="campo" id="org-base" placeholder="(automática)" value="${esc(c.base)}">
        <button class="btn primario" id="org-guardar">💾 Guardar cambios</button>
        <p class="nota">⚠️ Si cambias familias, candados o escondites, vuelve a imprimir los <b>sobres</b> (y las tarjetas de escondites nuevos).</p>
      </section>
      <section class="pergamino">
        <h2>4 · Imprimir</h2>
        <div class="grid-imprimir">
          ${[['guia', '📘 Guía del organizador'], ['respuestas', '🤫 Hoja de respuestas'], ['sobres', '✉️ Sobres de misión + kit'], ['pistas', '🗺️ Tarjetas de pistas'], ['trampas', '🪤 Pistas falsas'], ['regalos', '🎁 Regalos falsos'], ['cofre', '🔐 Cofre, candados y QR final'], ['agente', '⭐ Cartas y gafetes (Ana Sofía y Gaby)'], ['diplomas', '🏆 Diplomas'], ['cuento', '📖 Cuento ilustrado']]
        .map(([k, t]) => `<a class="btn" href="#/imprimir/${k}">${t}</a>`).join('')}
        </div>
      </section>
      <section class="pergamino">
        <h2>5 · Este teléfono</h2>
        <div class="grid-imprimir">
          <a class="btn" href="#/final">🎬 Ver el final</a>
          <button class="btn" id="org-carta">🎅 Audio de Santa (Ana Sofía)</button>
          <button class="btn" id="org-carta2">🎅 Audio de Santa (Gaby)</button>
          <a class="btn" href="#/unirse">👪 Asignar familia</a>
          <button class="btn peligro" id="org-reset">🗑️ Borrar partida de este teléfono</button>
        </div>
        <h2>Rescate: poner partida en la pista…</h2>
        <p class="nota">Si una familia perdió su avance o cambió de celular, elige su familia y la pista que estaban buscando.</p>
        <div class="form-reto"><select class="campo" id="res-fam">${c.familias.filter(f => f.activa).map(f => `<option value="${f.id}">${esc(f.nombre)}</option>`).join('')}</select>
          <select class="campo corto" id="res-paso">${Array.from({ length: J.pasosPorFamilia }, (_, i) => `<option value="${i}">Pista ${i + 1}</option>`).join('')}</select>
          <button class="btn" id="res-ok">Aplicar</button></div>
      </section>`;
    $('#org-guardar').addEventListener('click', () => {
      const o = store.get('rgn-config', {}); o.familias = o.familias || {};
      $$('[data-f]').forEach(i => { const f = i.dataset.f, k = i.dataset.k; o.familias[f] = o.familias[f] || {}; o.familias[f][k] = i.type === 'checkbox' ? i.checked : i.value.trim(); });
      Object.values(o.familias).forEach(f => { if (f.codigo && !/^\d{4}$/.test(f.codigo)) { f.codigo = undefined; aviso('Los códigos deben ser de 4 números', 'mal'); } });
      const ruta = $$('[data-ruta]').map(s => s.value);
      if (new Set(ruta).size !== ruta.length) { sfx.error(); return aviso('Hay escondites repetidos', 'mal'); }
      o.ruta = ruta; o.base = $('#org-base').value.trim();
      store.set('rgn-config', o); sfx.ding(); aviso('Guardado ✅'); render();
    });
    $('#org-carta').addEventListener('click', () => clip('santa-carta'));
    $('#org-carta2').addEventListener('click', () => clip('santa-carta-gaby'));
    $('#res-ok').addEventListener('click', async () => {
      const f = famPorId($('#res-fam').value), k = +$('#res-paso').value;
      const ok = await modal(`<h2>¿Poner a la familia ${esc(f.nombre)} en la pista ${k + 1}?</h2><p>Se reemplaza la partida de este teléfono.</p>`, { botones: [{ txt: 'Cancelar', valor: false }, { txt: 'Aplicar', valor: true, clase: 'primario' }] });
      if (!ok) return;
      const inicio = E && E.fam.id === f.id ? E.inicio : Date.now();
      nuevaPartida(datosSobre(f));
      E.paso = k; E.fase = 'buscando'; E.inicio = inicio;
      J.pasosConDigito.forEach((p, i) => { if (p <= k) E.digitos[i] = E.fam.c[i]; });
      guarda(); aviso('Listo ✅'); ir('#/juego');
    });
    $('#org-reset').addEventListener('click', async () => {
      const ok = await modal('<h2>¿Borrar la partida?</h2><p>Se borra el avance de la familia en ESTE teléfono.</p>', { botones: [{ txt: 'Cancelar', valor: false }, { txt: 'Borrar', valor: true, clase: 'peligro' }] });
      if (ok) { E = null; store.del('rgn-estado'); aviso('Partida borrada'); ir('#/'); }
    });
  };

  /* ---------------- enrutador ---------------- */
  function ir(h) { if (location.hash === h) render(); else location.hash = h; }
  function render() {
    clearInterval(relojTimer);
    const h = (location.hash.replace(/^#/, '') || '/').split('?')[0];
    const partes = h.split('/').filter(Boolean);
    document.body.classList.remove('modo-imprimir');
    $('#btn-atras').hidden = partes.length === 0;
    if (partes[0] === 'q' && partes[1]) { history.replaceState(null, '', E ? '#/juego' : '#/'); return procesar(partes[1].toUpperCase()); }
    if (partes[0] === 's' && partes[1]) { history.replaceState(null, '', '#/'); return unirseConSobre(partes[1]); }
    if (partes[0] === 'imprimir') { document.body.classList.add('modo-imprimir'); return window.IMPRIMIR && window.IMPRIMIR.render(partes[1] || 'guia', app); }
    const v = { '': 'inicio', historia: 'historia', unirse: 'unirse', juego: 'juego', kit: 'kit', final: 'final', org: 'org' }[partes[0] || ''] || 'inicio';
    vistas[v](partes[1]);
    app.focus({ preventScroll: true });
  }
  $('#btn-atras').addEventListener('click', () => { if (history.length > 1) history.back(); else ir('#/'); });
  addEventListener('hashchange', () => { render(); window.scrollTo(0, 0); });

  /* API para imprimibles */
  window.APP = { cfg, baseUrl, urlSobre, urlCodigo, cod, rutaDeFamilia, presentacion: (fam, paso) => J.ciclosPresentacion[(paso + fam.idx * 3) % J.ciclosPresentacion.length], cesar, anagrama, mayus, glifosHTML, morseHTML, esc, MORSE, ABC, CODIGOS };

  document.addEventListener('DOMContentLoaded', render);
  if (document.readyState !== 'loading') setTimeout(render, 0);
})();
