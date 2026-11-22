/* =========================================================================
   Arte del juego (SVG): Tilín, Santa, cofre, candados, regalos, árbol…
   Se usa en la app, en los imprimibles y en el video animado.
   Cada función regresa un <g> listo para meter dentro de un <svg>.
   ========================================================================= */
window.ARTE = (function () {
  const O = '#2b1a10';      // contorno
  const SW = 3;

  const CEJAS = {
    picaro: ['M70 106 q12 -9 24 -3', 'M106 103 q12 -6 24 3'],
    normal: ['M70 104 q12 -8 24 0', 'M106 104 q12 -8 24 0'],
    enojo:  ['M70 98 q14 2 26 12', 'M104 110 q12 -10 26 -12'],
    triste: ['M70 108 q12 -4 24 -12', 'M106 96 q12 4 24 12'],
    feliz:  ['M70 102 q12 -12 24 -4', 'M106 98 q12 -8 24 4']
  };

  /* ---------------- TILÍN (viewBox 0 0 200 320; pies en y≈305) -------- */
  function tilin(o = {}) {
    const gorro = o.gorro || '#1f9d55', gorroOsc = o.gorroOsc || '#15703c';
    const ropa = o.ropa || '#1f9d55', ropaOsc = o.ropaOsc || '#15703c';
    const cuello = o.cuello || '#d7263d';
    const piel = o.piel || '#f7c9a3';
    const boca = o.boca || 'sonrisa';
    const cj = CEJAS[o.cejas || 'picaro'];
    const vis = (b) => (b === boca ? 1 : 0);
    const cascabel = o.sinCascabel ? '' : `
        <g class="t-cascabel">
          <circle cx="186" cy="50" r="11" fill="#f5c542" stroke="${O}" stroke-width="${SW}"/>
          <path d="M178 52 q8 5 16 0" stroke="${O}" stroke-width="2.5" fill="none"/>
          <circle cx="186" cy="55" r="2.5" fill="${O}"/>
          <circle cx="182" cy="45" r="3" fill="#fff6c9"/>
          <g class="t-algodon" opacity="${o.algodon ? 1 : 0}">
            <circle cx="182" cy="50" r="8" fill="#fff"/><circle cx="190" cy="46" r="7" fill="#fff"/>
            <circle cx="191" cy="55" r="7" fill="#fff"/><circle cx="183" cy="57" r="6" fill="#f2f2f2"/>
          </g>
        </g>`;
    return `
    <g class="tilin">
      <ellipse class="t-sombra" cx="100" cy="306" rx="48" ry="8" fill="rgba(0,0,0,.22)"/>
      <g class="t-cuerpo">
        <g class="t-pierna-izq">
          <rect x="80" y="238" width="15" height="52" fill="#fff" stroke="${O}" stroke-width="${SW}"/>
          <rect x="81.5" y="250" width="12" height="9" fill="#d7263d"/><rect x="81.5" y="268" width="12" height="9" fill="#d7263d"/>
          <path d="M96 282 v12 q0 7 -7 7 h-28 q-17 0 -22 -17 q10 8 18 3 q5 -5 14 -5z" fill="#8a4a1c" stroke="${O}" stroke-width="${SW}" stroke-linejoin="round"/>
          <circle cx="39" cy="283" r="4.5" fill="#f5c542" stroke="${O}" stroke-width="2"/>
        </g>
        <g class="t-pierna-der">
          <rect x="105" y="238" width="15" height="52" fill="#fff" stroke="${O}" stroke-width="${SW}"/>
          <rect x="106.5" y="250" width="12" height="9" fill="#d7263d"/><rect x="106.5" y="268" width="12" height="9" fill="#d7263d"/>
          <path d="M104 282 v12 q0 7 7 7 h28 q17 0 22 -17 q-10 8 -18 3 q-5 -5 -14 -5z" fill="#8a4a1c" stroke="${O}" stroke-width="${SW}" stroke-linejoin="round"/>
          <circle cx="161" cy="283" r="4.5" fill="#f5c542" stroke="${O}" stroke-width="2"/>
        </g>
        <g class="t-brazo-izq">
          <path d="M70 178 L44 226 L60 233 L82 190 Z" fill="${ropa}" stroke="${O}" stroke-width="${SW}" stroke-linejoin="round"/>
          <path d="M42 222 L62 231" stroke="#fff" stroke-width="7" stroke-linecap="round"/>
          <circle class="t-mano-izq" cx="49" cy="236" r="10" fill="${piel}" stroke="${O}" stroke-width="${SW}"/>
        </g>
        <g class="t-brazo-der">
          <path d="M130 178 L156 226 L140 233 L118 190 Z" fill="${ropa}" stroke="${O}" stroke-width="${SW}" stroke-linejoin="round"/>
          <path d="M158 222 L138 231" stroke="#fff" stroke-width="7" stroke-linecap="round"/>
          <circle class="t-mano-der" cx="151" cy="236" r="10" fill="${piel}" stroke="${O}" stroke-width="${SW}"/>
        </g>
        <path d="M66 172 L134 172 L150 250 L138 242 L126 252 L114 242 L100 252 L86 242 L74 252 L62 242 L50 250 Z" fill="${ropa}" stroke="${O}" stroke-width="${SW}" stroke-linejoin="round"/>
        <path d="M100 176 L100 214" stroke="${ropaOsc}" stroke-width="3"/>
        <circle cx="100" cy="190" r="3.5" fill="#f5c542" stroke="${O}" stroke-width="1.5"/>
        <circle cx="100" cy="204" r="3.5" fill="#f5c542" stroke="${O}" stroke-width="1.5"/>
        <rect x="60" y="214" width="80" height="13" rx="3" fill="#5a2d0c" stroke="${O}" stroke-width="${SW}"/>
        <rect x="91" y="212" width="18" height="17" rx="3" fill="#f5c542" stroke="${O}" stroke-width="2.5"/>
        <rect x="96" y="217" width="8" height="7" fill="#5a2d0c"/>
        <path d="M64 168 L136 168 L130 186 L120 176 L110 188 L100 176 L90 188 L80 176 L70 186 Z" fill="${cuello}" stroke="${O}" stroke-width="${SW}" stroke-linejoin="round"/>
        <g class="t-cabeza">
          <g class="t-oreja-izq">
            <path d="M60 118 L12 92 Q26 132 62 146 Z" fill="${piel}" stroke="${O}" stroke-width="${SW}" stroke-linejoin="round"/>
            <path d="M54 124 L28 104 Q38 128 58 137 Z" fill="#f0a487"/>
          </g>
          <g class="t-oreja-der">
            <path d="M140 118 L188 92 Q174 132 138 146 Z" fill="${piel}" stroke="${O}" stroke-width="${SW}" stroke-linejoin="round"/>
            <path d="M146 124 L172 104 Q162 128 142 137 Z" fill="#f0a487"/>
          </g>
          <circle cx="100" cy="128" r="46" fill="${piel}" stroke="${O}" stroke-width="${SW}"/>
          <circle class="t-cara-roja" cx="100" cy="128" r="44" fill="#ff3b3b" opacity="0"/>
          <path d="M57 104 q-4 14 4 22 q2 -12 8 -18z M143 104 q4 14 -4 22 q-2 -12 -8 -18z" fill="#8a4a1c" stroke="${O}" stroke-width="2"/>
          <ellipse cx="71" cy="149" rx="9" ry="6" fill="#ff7f7f" opacity=".55"/>
          <ellipse cx="129" cy="149" rx="9" ry="6" fill="#ff7f7f" opacity=".55"/>
          <g class="t-ojos">
            <ellipse cx="82" cy="124" rx="10" ry="12" fill="#fff" stroke="${O}" stroke-width="2.5"/>
            <ellipse cx="118" cy="124" rx="10" ry="12" fill="#fff" stroke="${O}" stroke-width="2.5"/>
            <g class="t-pupilas">
              <circle cx="84" cy="127" r="5.8" fill="${O}"/><circle cx="120" cy="127" r="5.8" fill="${O}"/>
              <circle cx="86" cy="124.5" r="2" fill="#fff"/><circle cx="122" cy="124.5" r="2" fill="#fff"/>
            </g>
          </g>
          <path class="t-ceja-izq" d="${cj[0]}" stroke="#6b3410" stroke-width="5" stroke-linecap="round" fill="none"/>
          <path class="t-ceja-der" d="${cj[1]}" stroke="#6b3410" stroke-width="5" stroke-linecap="round" fill="none"/>
          <ellipse cx="100" cy="141" rx="8.5" ry="7" fill="#f19274" stroke="${O}" stroke-width="2"/>
          <g class="t-boca-sonrisa" opacity="${vis('sonrisa')}">
            <path d="M80 152 Q102 172 122 150" stroke="${O}" stroke-width="4" fill="none" stroke-linecap="round"/>
            <path d="M118 147 q6 1 6 7" stroke="${O}" stroke-width="3" fill="none" stroke-linecap="round"/>
          </g>
          <g class="t-boca-risa" opacity="${vis('risa')}">
            <path d="M78 151 Q100 186 124 151 Z" fill="#7a1f1f" stroke="${O}" stroke-width="3" stroke-linejoin="round"/>
            <path d="M82 152 L120 152 L118 158 L84 158 Z" fill="#fff"/>
            <path d="M90 170 Q101 178 113 168 Q102 162 90 170Z" fill="#ff6b6b"/>
          </g>
          <g class="t-boca-enojo" opacity="${vis('enojo')}">
            <path d="M82 156 h36 v10 h-36 z" fill="#fff" stroke="${O}" stroke-width="3" stroke-linejoin="round"/>
            <path d="M82 161 h36 M91 156 v10 M100 156 v10 M109 156 v10" stroke="${O}" stroke-width="1.6"/>
          </g>
          <g class="t-boca-triste" opacity="${vis('triste')}">
            <path d="M84 166 Q100 152 116 166" stroke="${O}" stroke-width="4" fill="none" stroke-linecap="round"/>
          </g>
          <g class="t-boca-o" opacity="${vis('o')}">
            <ellipse cx="100" cy="160" rx="7" ry="9" fill="#7a1f1f" stroke="${O}" stroke-width="2.5"/>
          </g>
          <g class="t-gorro">
            <path d="M50 100 C 55 50, 95 18, 140 20 C 162 21, 176 30, 186 44 C 168 38, 152 40, 142 50 C 148 66, 150 82, 152 100 Z" fill="${gorro}" stroke="${O}" stroke-width="${SW}" stroke-linejoin="round"/>
            <path d="M70 92 C 78 60, 104 38, 138 30" stroke="${gorroOsc}" stroke-width="6" fill="none" stroke-linecap="round" opacity=".7"/>
            <rect x="42" y="86" width="116" height="22" rx="11" fill="#fff" stroke="${O}" stroke-width="${SW}"/>
            <circle cx="60" cy="97" r="3" fill="#e8e8e8"/><circle cx="84" cy="94" r="3" fill="#e8e8e8"/><circle cx="112" cy="99" r="3" fill="#e8e8e8"/><circle cx="138" cy="95" r="3" fill="#e8e8e8"/>
            ${cascabel}
          </g>
        </g>
      </g>
    </g>`;
  }

  /* ---------------- SANTA (viewBox 0 0 300 420) ---------------- */
  function santa() {
    return `
    <g class="santa">
      <ellipse cx="150" cy="410" rx="95" ry="10" fill="rgba(0,0,0,.22)"/>
      <rect x="95" y="340" width="40" height="60" fill="#c81d25" stroke="${O}" stroke-width="${SW}"/>
      <rect x="165" y="340" width="40" height="60" fill="#c81d25" stroke="${O}" stroke-width="${SW}"/>
      <path d="M85 392 h55 q8 0 8 10 v6 h-70 q-6 -16 7 -16z" fill="#1c1c1c" stroke="${O}" stroke-width="${SW}"/>
      <path d="M160 392 h55 q13 0 7 16 h-70 v-6 q0 -10 8 -10z" fill="#1c1c1c" stroke="${O}" stroke-width="${SW}"/>
      <path d="M60 250 Q60 170 150 168 Q240 170 240 250 Q244 350 150 352 Q56 350 60 250Z" fill="#d7263d" stroke="${O}" stroke-width="${SW}"/>
      <rect x="138" y="190" width="24" height="160" fill="#fff" stroke="${O}" stroke-width="2.5"/>
      <rect x="62" y="282" width="176" height="24" fill="#2b1a10"/>
      <rect x="134" y="278" width="32" height="32" rx="4" fill="#f5c542" stroke="${O}" stroke-width="3"/>
      <rect x="142" y="286" width="16" height="16" fill="#2b1a10"/>
      <g class="s-brazo-izq">
        <path d="M78 200 Q30 240 40 300" stroke="${O}" stroke-width="40" fill="none" stroke-linecap="round"/>
        <path d="M78 200 Q30 240 40 300" stroke="#d7263d" stroke-width="34" fill="none" stroke-linecap="round"/>
        <circle cx="40" cy="306" r="18" fill="#fff" stroke="${O}" stroke-width="${SW}"/>
      </g>
      <g class="s-brazo-der">
        <path d="M222 200 Q262 180 268 128" stroke="${O}" stroke-width="40" fill="none" stroke-linecap="round"/>
        <path d="M222 200 Q262 180 268 128" stroke="#d7263d" stroke-width="34" fill="none" stroke-linecap="round"/>
        <circle cx="268" cy="118" r="17" fill="#fff" stroke="${O}" stroke-width="${SW}"/>
        <rect x="263" y="78" width="10" height="34" rx="5" fill="#fff" stroke="${O}" stroke-width="${SW}"/>
      </g>
      <circle cx="150" cy="118" r="58" fill="#f6c7a1" stroke="${O}" stroke-width="${SW}"/>
      <path d="M86 120 Q80 230 150 236 Q220 230 214 120 Q196 150 150 150 Q104 150 86 120Z" fill="#fff" stroke="${O}" stroke-width="${SW}"/>
      <path d="M112 146 Q130 132 150 146 Q170 132 188 146 Q170 160 150 150 Q130 160 112 146Z" fill="#fff" stroke="${O}" stroke-width="2.5"/>
      <circle cx="150" cy="128" r="11" fill="#f19274" stroke="${O}" stroke-width="2.5"/>
      <g class="s-ojos"><circle cx="128" cy="108" r="6" fill="${O}"/><circle cx="172" cy="108" r="6" fill="${O}"/></g>
      <path class="s-ceja-izq" d="M114 92 q14 -6 26 2" stroke="#fff" stroke-width="8" stroke-linecap="round" fill="none"/>
      <path class="s-ceja-der" d="M160 94 q12 -8 26 -2" stroke="#fff" stroke-width="8" stroke-linecap="round" fill="none"/>
      <path class="s-boca" d="M138 168 q12 -6 24 0" stroke="#7a1f1f" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M90 80 Q120 10 200 30 Q250 44 262 96 L240 92 Q222 60 210 70 Q214 74 214 82 Z" fill="#d7263d" stroke="${O}" stroke-width="${SW}" stroke-linejoin="round"/>
      <rect x="84" y="70" width="134" height="26" rx="13" fill="#fff" stroke="${O}" stroke-width="${SW}"/>
      <circle cx="262" cy="100" r="15" fill="#fff" stroke="${O}" stroke-width="${SW}"/>
    </g>`;
  }

  /* ---------------- CANDADO ---------------- */
  function candado(color, x, y, s = 1, conLlave = false, clase = '') {
    const cuerpo = conLlave ? '#f5c542' : color;
    return `<g class="candado ${clase}" transform="translate(${x} ${y}) scale(${s})">
      <path class="cd-arco" d="M-16 0 v-14 a16 16 0 0 1 32 0 v14" stroke="#9aa3ad" stroke-width="7" fill="none"/>
      <path d="M-16 0 v-14 a16 16 0 0 1 32 0 v14" stroke="${O}" stroke-width="1.5" fill="none" opacity=".5"/>
      <rect x="-24" y="-2" width="48" height="40" rx="7" fill="${cuerpo}" stroke="${O}" stroke-width="${SW}"/>
      <rect x="-18" y="4" width="36" height="6" rx="3" fill="#fff" opacity=".35"/>
      ${conLlave
        ? `<circle cx="0" cy="16" r="5" fill="${O}"/><path d="M-2 18 h4 l2 12 h-8z" fill="${O}"/>`
        : `<rect x="-16" y="16" width="32" height="14" rx="3" fill="#20232a"/>
           <text x="0" y="27.5" font-family="monospace" font-size="11" fill="#fff" text-anchor="middle" font-weight="bold">· · · ·</text>`}
    </g>`;
  }

  /* ---------------- COFRE (viewBox 0 0 340 260) ---------------- */
  function cofre(colores = ['#d7263d', '#1b998b', '#e0a100', '#3a6ea5'], conLlave = true) {
    const n = colores.length + (conLlave ? 1 : 0);
    const ancho = 62, x0 = 170 - ((n - 1) * ancho) / 2;
    let locks = '';
    colores.forEach((c, i) => { locks += candado(c, x0 + i * ancho, 196, 0.95, false, 'cd-' + i); });
    if (conLlave) locks += candado('#f5c542', x0 + colores.length * ancho, 196, 0.95, true, 'cd-llave');
    return `<g class="cofre">
      <ellipse cx="170" cy="252" rx="160" ry="10" fill="rgba(0,0,0,.25)"/>
      <rect x="20" y="110" width="300" height="140" rx="10" fill="#9b5a24" stroke="${O}" stroke-width="${SW}"/>
      <path d="M22 150 H318 M22 190 H318 M22 230 H318" stroke="#7a4219" stroke-width="3"/>
      <rect x="20" y="110" width="26" height="140" fill="#f5c542" stroke="${O}" stroke-width="${SW}"/>
      <rect x="294" y="110" width="26" height="140" fill="#f5c542" stroke="${O}" stroke-width="${SW}"/>
      <g class="cofre-tapa">
        <path d="M20 112 V70 Q20 20 170 18 Q320 20 320 70 V112 Z" fill="#b06a2c" stroke="${O}" stroke-width="${SW}" stroke-linejoin="round"/>
        <path d="M24 70 Q170 40 316 70" stroke="#8c4f1d" stroke-width="3" fill="none"/>
        <path d="M20 70 V112 H46 V40 Q30 50 20 70Z" fill="#f5c542" stroke="${O}" stroke-width="${SW}"/>
        <path d="M320 70 V112 H294 V40 Q310 50 320 70Z" fill="#f5c542" stroke="${O}" stroke-width="${SW}"/>
        <circle cx="170" cy="70" r="16" fill="#f5c542" stroke="${O}" stroke-width="${SW}"/>
        <text x="170" y="77" font-size="20" text-anchor="middle" font-family="Georgia,serif" font-weight="bold" fill="${O}">T</text>
      </g>
      <rect x="${x0 - 40}" y="150" width="${(n - 1) * ancho + 80}" height="22" rx="6" fill="#c9ced6" stroke="${O}" stroke-width="${SW}"/>
      ${locks}
    </g>`;
  }

  /* ---------------- REGALO (viewBox aprox 0 0 100 100) ---------------- */
  function regalo(color = '#d7263d', mono = '#f5c542', x = 0, y = 0, s = 1, clase = '') {
    return `<g class="regalo ${clase}" transform="translate(${x} ${y}) scale(${s})">
      <rect x="8" y="34" width="84" height="62" rx="4" fill="${color}" stroke="${O}" stroke-width="${SW}"/>
      <rect x="2" y="24" width="96" height="18" rx="4" fill="${color}" stroke="${O}" stroke-width="${SW}"/>
      <rect x="44" y="24" width="12" height="72" fill="${mono}" stroke="${O}" stroke-width="2"/>
      <path d="M50 24 Q30 0 22 14 Q20 26 50 24 Q80 26 78 14 Q70 0 50 24Z" fill="${mono}" stroke="${O}" stroke-width="2.5"/>
    </g>`;
  }

  /* ---------------- ÁRBOL (viewBox 0 0 260 340) ---------------- */
  function arbol() {
    const esferas = [[100, 120, '#d7263d'], [160, 140, '#f5c542'], [120, 190, '#3a6ea5'], [80, 230, '#f5c542'], [175, 220, '#d7263d'], [130, 260, '#e86fb0'], [60, 280, '#d7263d'], [200, 285, '#3a6ea5'], [140, 100, '#e86fb0']];
    const luces = [[90, 150], [150, 175], [110, 215], [190, 250], [70, 255], [160, 290], [105, 290], [130, 140], [215, 300], [45, 300]];
    return `<g class="arbol">
      <rect x="115" y="300" width="30" height="34" fill="#7b4a1e" stroke="${O}" stroke-width="${SW}"/>
      <path d="M130 30 L230 310 Q130 330 30 310 Z" fill="#1f7a3f" stroke="${O}" stroke-width="${SW}" stroke-linejoin="round"/>
      <path d="M130 30 L200 200 Q130 220 60 200 Z" fill="#25914b" stroke="${O}" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M130 30 L170 120 Q130 132 90 120 Z" fill="#2aa557" stroke="${O}" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M58 250 Q130 280 210 240" stroke="#f5c542" stroke-width="4" fill="none" stroke-dasharray="2 8" stroke-linecap="round"/>
      <path d="M80 165 Q130 190 185 160" stroke="#f5c542" stroke-width="4" fill="none" stroke-dasharray="2 8" stroke-linecap="round"/>
      ${esferas.map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="9" fill="${c}" stroke="${O}" stroke-width="2"/><circle cx="${x - 3}" cy="${y - 3}" r="2.5" fill="#fff" opacity=".8"/>`).join('')}
      <g class="arbol-luces">${luces.map(([x, y], i) => `<circle class="luz luz-${i % 3}" cx="${x}" cy="${y}" r="4.5" fill="${['#fff36b', '#ff6b6b', '#7ee8fa'][i % 3]}"/>`).join('')}</g>
      <path class="arbol-estrella" d="M130 6 L137 24 L156 24 L141 35 L147 53 L130 42 L113 53 L119 35 L104 24 L123 24 Z" fill="#f5c542" stroke="${O}" stroke-width="2.5" stroke-linejoin="round"/>
    </g>`;
  }

  /* ---------------- COSTAL ---------------- */
  function costal() {
    return `<g class="costal">
      <path d="M20 60 Q0 140 30 170 Q80 190 130 170 Q160 140 140 60 Q80 40 20 60Z" fill="#b5895a" stroke="${O}" stroke-width="${SW}"/>
      <path d="M30 62 Q80 80 130 62" stroke="#8a6338" stroke-width="3" fill="none"/>
      <path d="M50 40 Q80 70 110 40 Q100 30 80 54 Q60 30 50 40Z" fill="#b5895a" stroke="${O}" stroke-width="${SW}"/>
      <path d="M44 120 q10 -6 20 0 M96 140 q10 -6 20 0" stroke="#8a6338" stroke-width="3" fill="none"/>
    </g>`;
  }

  /* ---------------- TRINEO ---------------- */
  function trineo() {
    return `<g class="trineo">
      <path d="M10 120 H210 Q240 120 240 95" stroke="#f5c542" stroke-width="8" fill="none" stroke-linecap="round"/>
      <path d="M50 100 V120 M170 100 V120" stroke="#f5c542" stroke-width="7"/>
      <path d="M20 40 Q20 100 60 100 H190 Q220 100 226 60 L200 64 Q190 80 170 80 H80 Q60 80 60 40 Z" fill="#d7263d" stroke="${O}" stroke-width="${SW}" stroke-linejoin="round"/>
      <path d="M70 92 H180" stroke="#f5c542" stroke-width="4"/>
      <circle cx="40" cy="50" r="6" fill="#f5c542" stroke="${O}" stroke-width="2"/>
    </g>`;
  }

  /* ---------------- LLAVE DORADA ---------------- */
  function llave() {
    return `<g class="llave">
      <circle cx="40" cy="40" r="30" fill="#f5c542" stroke="${O}" stroke-width="${SW}"/>
      <circle cx="40" cy="40" r="13" fill="none" stroke="${O}" stroke-width="${SW}"/>
      <path d="M40 18 l4 8 h9 l-7 6 3 9 -9 -5 -9 5 3 -9 -7 -6 h9z" fill="#fff6c9" opacity=".0"/>
      <rect x="68" y="33" width="110" height="14" rx="4" fill="#f5c542" stroke="${O}" stroke-width="${SW}"/>
      <rect x="140" y="45" width="12" height="22" fill="#f5c542" stroke="${O}" stroke-width="${SW}"/>
      <rect x="160" y="45" width="12" height="16" fill="#f5c542" stroke="${O}" stroke-width="${SW}"/>
      <rect x="76" y="36" width="60" height="4" rx="2" fill="#fff6c9" opacity=".8"/>
    </g>`;
  }

  /* ---------------- TARJETITA DE PISTA ---------------- */
  function tarjeta(color = '#d7263d') {
    return `<g class="tarjeta">
      <rect x="0" y="0" width="60" height="78" rx="6" fill="#fffaf0" stroke="${O}" stroke-width="2.5"/>
      <rect x="0" y="0" width="60" height="16" rx="6" fill="${color}"/>
      <rect x="12" y="24" width="36" height="36" fill="#fff" stroke="${O}" stroke-width="1.5"/>
      <rect x="15" y="27" width="10" height="10" fill="${O}"/><rect x="35" y="27" width="10" height="10" fill="${O}"/><rect x="15" y="47" width="10" height="10" fill="${O}"/>
      <rect x="29" y="40" width="5" height="5" fill="${O}"/><rect x="37" y="48" width="6" height="6" fill="${O}"/><rect x="28" y="30" width="4" height="4" fill="${O}"/>
      <text x="30" y="72" font-size="8" text-anchor="middle" font-family="sans-serif" font-weight="bold" fill="${O}">?</text>
    </g>`;
  }

  /* ---------------- ÍCONOS DE FAMILIA (viewBox 0 0 100 100) ---------------- */
  function icono(nombre, color = '#fff', borde = O) {
    const sw = 5;
    switch (nombre) {
      case 'estrella': return `<path d="M50 6 L62 38 L96 38 L68 58 L78 92 L50 72 L22 92 L32 58 L4 38 L38 38 Z" fill="${color}" stroke="${borde}" stroke-width="${sw}" stroke-linejoin="round"/>`;
      case 'arbol': return `<path d="M50 4 L82 46 H66 L90 78 H10 L34 46 H18 Z" fill="${color}" stroke="${borde}" stroke-width="${sw}" stroke-linejoin="round"/><rect x="42" y="78" width="16" height="16" fill="${color}" stroke="${borde}" stroke-width="${sw}"/>`;
      case 'campana': return `<path d="M50 10 Q76 12 76 44 Q76 66 90 78 H10 Q24 66 24 44 Q24 12 50 10Z" fill="${color}" stroke="${borde}" stroke-width="${sw}" stroke-linejoin="round"/><circle cx="50" cy="86" r="8" fill="${color}" stroke="${borde}" stroke-width="${sw}"/><circle cx="50" cy="8" r="5" fill="${color}" stroke="${borde}" stroke-width="4"/>`;
      case 'copo': return `<g stroke="${borde}" stroke-width="13" stroke-linecap="round"><path d="M50 8 V92 M14 29 L86 71 M14 71 L86 29"/></g><g stroke="${color}" stroke-width="6" stroke-linecap="round"><path d="M50 8 V92 M14 29 L86 71 M14 71 L86 29"/></g><g stroke="${color}" stroke-width="5" stroke-linecap="round" fill="none"><path d="M40 14 L50 24 L60 14 M40 86 L50 76 L60 86"/></g>`;
      default: return '';
    }
  }

  function svg(inner, vb, extra = '') { return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" ${extra}>${inner}</svg>`; }

  /* ---------------- ALFABETO DEL DUENDE (tipo «pigpen») ----------------
     27 letras (con Ñ). Devuelve un <svg> de 40×40 para cada letra.        */
  const ABC = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';
  function glifo(letra, tam = 40, color = O) {
    const i = ABC.indexOf(letra.toUpperCase());
    if (i < 0) return `<svg viewBox="0 0 40 40" width="${tam}" height="${tam}"></svg>`;
    let d = '', punto = false, extra = '';
    if (i < 18) {                 // dos rejillas tipo #  (A–I, J–Q con punto)
      const k = i % 9; punto = i >= 9;
      const fila = Math.floor(k / 3), col = k % 3;
      // lados presentes: arriba si fila>0, abajo si fila<2, izq si col>0, der si col<2
      if (fila > 0) d += 'M6 6 H34 ';
      if (fila < 2) d += 'M6 34 H34 ';
      if (col > 0) d += 'M6 6 V34 ';
      if (col < 2) d += 'M34 6 V34 ';
    } else if (i < 26) {          // dos «X» (R–U, V–Y con punto)
      const k = (i - 18) % 4; punto = i >= 22;
      // 0: V hacia abajo (arriba), 1: < (der), 2: > (izq), 3: ^ (abajo)
      d = ['M6 6 L20 30 L34 6', 'M34 6 L10 20 L34 34', 'M6 6 L30 20 L6 34', 'M6 34 L20 10 L34 34'][k];
    } else {                      // Z: estrellita
      extra = `<path d="M20 5 L24 16 L35 16 L26 23 L30 34 L20 27 L10 34 L14 23 L5 16 L16 16Z" fill="none" stroke="${color}" stroke-width="3" stroke-linejoin="round"/>`;
    }
    let px = 20, py = 20;
    if (i >= 22 && i < 26) [px, py] = [[20, 14], [26, 20], [14, 20], [20, 26]][(i - 18) % 4];
    const p = punto ? `<circle cx="${px}" cy="${py}" r="3.6" fill="${color}"/>` : '';
    return `<svg viewBox="0 0 40 40" width="${tam}" height="${tam}" class="glifo"><path d="${d}" stroke="${color}" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>${p}${extra}</svg>`;
  }

  return { CEJAS, tilin, santa, candado, cofre, regalo, arbol, costal, trineo, llave, tarjeta, icono, svg, glifo, ABC };
})();
