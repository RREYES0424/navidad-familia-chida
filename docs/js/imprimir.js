/* =========================================================================
   IMPRIMIBLES — se generan con la configuración actual (tamaño Carta)
   ========================================================================= */
window.IMPRIMIR = (function () {
  const J = window.JUEGO, A = window.ARTE;
  const P = () => window.APP;
  const esc = s => P().esc(s);

  function qr(texto, clase = '') {
    const q = qrcode(0, 'M'); q.addData(texto); q.make();
    return `<div class="qr ${clase}">${q.createSvgTag({ cellSize: 4, margin: 2, scalable: true })}</div>`;
  }
  const tilinSVG = (o = {}) => A.svg(A.tilin(o), '0 0 200 320');
  const iconoSVG = (f, color = '#fff') => A.svg(A.icono(f.icono, color, 'rgba(0,0,0,.35)'), '0 0 100 100');
  function familias(incluir) { const c = P().cfg(); return c.familias.filter(f => f.activa || incluir); }
  const hoja = (html, clase = '') => `<section class="hoja ${clase}">${html}</section>`;
  const nombreFam = f => (f.id === 'fx' && /invitada/i.test(f.nombre)) ? 'Familia: ______________________' : 'Familia ' + f.nombre;

  function tarjeta(f, codigo, titulo = 'Pista secreta', extra = '') {
    return `<div class="tarjeta-pista" style="--fam:${f.color}">
      <div class="tp-banda"><span class="tp-icono">${iconoSVG(f)}</span><span>${esc(nombreFam(f))}</span></div>
      <div class="tp-titulo">${titulo}</div>
      ${qr(P().urlCodigo(codigo), 'tp-qr')}
      <div class="tp-cod">Código: <b>${codigo}</b></div>
      <div class="tp-pie">Escanéenla con la app del juego.<br>Si no es de su color, ¡déjenla donde está!</div>
      <div class="tp-tilin">${tilinSVG({ boca: 'risa', cejas: 'feliz' })}</div>${extra}
    </div>`;
  }

  /* ---------------- SOBRES DE MISIÓN + KIT ---------------- */
  function rueda() {
    const ABC = P().ABC;
    const disco = (r, rTexto, tam, etiqueta, fondo) => {
      let h = `<circle cx="0" cy="0" r="${r}" fill="${fondo}" stroke="#2b1a10" stroke-width="1.2"/>`;
      ABC.split('').forEach((l, i) => {
        const a = (i / 27) * 2 * Math.PI - Math.PI / 2, x = Math.cos(a) * rTexto, y = Math.sin(a) * rTexto;
        const a2 = a + Math.PI / 27;
        h += `<line x1="${Math.cos(a2) * (r - tam * 1.9)}" y1="${Math.sin(a2) * (r - tam * 1.9)}" x2="${Math.cos(a2) * r}" y2="${Math.sin(a2) * r}" stroke="#2b1a10" stroke-width=".4"/>`;
        h += `<text x="${x}" y="${y}" font-size="${tam}" text-anchor="middle" dominant-baseline="central" transform="rotate(${(i / 27) * 360} ${x} ${y})" font-family="Nunito" font-weight="900" fill="#2b1a10">${l}</text>`;
      });
      h += `<text x="0" y="${-r * .32}" font-size="${tam * .62}" text-anchor="middle" font-family="Nunito" font-weight="800" fill="#2b1a10">${etiqueta}</text><circle r="1.6" fill="#2b1a10"/>`;
      return h;
    };
    return `<div class="rueda">
      <svg viewBox="-50 -50 100 100" class="disco grande">${disco(48, 42, 5.2, 'MENSAJE', '#fff8e7')}</svg>
      <svg viewBox="-38 -38 76 76" class="disco chico">${disco(36, 30.5, 4.6, 'VERDAD', '#e8f7ee')}</svg>
      <p class="instr">✂️ Recorten los dos discos, pongan el chico encima del grande y únanlos por el centro con una tachuela o broche. <b>Para descifrar con clave 3:</b> giren el disco chico hasta que su <b>A</b> quede bajo la <b>D</b> del grande (3 lugares después de la A). Busquen cada letra del mensaje en el disco grande y lean la de abajo.</p>
    </div>`;
  }
  function kit() {
    const ABC = P().ABC, M = P().MORSE;
    return `<h1 class="h-kit">🧰 Kit del Detective</h1>
      ${rueda()}
      <h2>El Alfabeto del Duende</h2>
      <div class="tabla-glifos imp">${ABC.split('').map(l => `<div>${A.glifo(l, 30, '#2b1a10')}<b>${l}</b></div>`).join('')}</div>
      <h2>El Cascabel que habla (Morse)</h2>
      <p class="instr">Un «tilín» corto es punto (•) y un «tiliiiín» largo es raya (—).</p>
      <div class="tabla-morse imp">${ABC.split('').map(l => `<div><b>${l}</b><span>${M[l].replace(/\./g, '•').replace(/-/g, '—')}</span></div>`).join('')}</div>`;
  }
  function sobres(incluir) {
    return familias(incluir).map(f => {
      const url = P().baseUrl().replace(/^https?:\/\//, '').replace(/\/$/, '');
      return hoja(`
        <div class="sobre-banda" style="--fam:${f.color}"><span class="sb-icono">${iconoSVG(f)}</span><div><small>Sobre de Misión</small><b>${esc(nombreFam(f))}</b></div></div>
        <div class="sobre-cuerpo">
          <div class="sobre-qr">${qr(P().urlSobre(f), 'qr-grande')}<p><b>Escaneen este código</b> con la cámara del celular para empezar.</p><p class="peque">o abran <b>${esc(url)}</b> → «Escanear Sobre de Misión»</p></div>
          <div class="sobre-reglas">
            <h2>Instrucciones del Polo Norte</h2>
            <ol>
              <li>Elijan <b>un solo celular</b> para toda la familia: el «celular oficial».</li>
              <li>Escaneen este código: la app les dará su <b>primera pista</b>.</li>
              <li>Sigan <b>sólo las tarjetas de color <span class="chip" style="background:${f.color}"></span> ${esc(f.colorNombre.toLowerCase())}</b>. Las de otro color, ¡no se tocan!</li>
              <li>En cada tarjeta, toquen <b>📷 Escanear tarjeta</b> y resuelvan el reto.</li>
              <li>Algunos retos les dan un <b>número de su candado</b>. Son 4 números.</li>
              <li>Tienen <b>3 comodines 🔔</b> para pedir ayuda.</li>
              <li>¡Cuidado! Tilín dejó <b>pistas falsas</b> y <b>regalos de mentira</b>.</li>
              <li>Con los 4 números, abran <b>su candado</b> del Cofre Encantado.</li>
            </ol>
            ${f.agente ? `<p class="agente-nota">⭐ En su equipo está la <b>Agente Especial ${esc(f.agente)}</b>. ¡Ayúdenla con sus misiones! Si cumple ${J.misionesParaBono}, ganan 1 comodín extra.</p>` : ''}
            ${f.descifradora ? `<p class="agente-nota">🔐 En su equipo está la <b>Descifradora Oficial ${esc(f.descifradora)}</b>. Al encontrar la pista ${J.pasoRetoExperto} se abre su <b>Reto Experto</b>: si lo resuelve, ganan 1 comodín extra.</p>` : ''}
            ${!f.agente && !f.descifradora ? `<p class="agente-nota">🔐 Al encontrar la pista ${J.pasoRetoExperto} se abre su <b>Reto Experto</b>: si lo resuelven, ganan 1 comodín extra.</p>` : ''}
          </div>
        </div>
        <div class="sobre-tilin">${tilinSVG({ boca: 'risa', cejas: 'feliz' })}<p>«¡Je, je, je! A ver si pueden…»<br><b>— Tilín</b></p></div>`, 'sobre') +
        hoja(kit(), 'kit');
    }).join('');
  }

  /* ---------------- TARJETAS DE PISTAS ---------------- */
  function pistas(incluir) {
    const c = P().cfg();
    return c.ruta.map((loc, i) => {
      const L = J.lugares[loc];
      const fams = familias(incluir);
      const lista = fams.map(f => { const r = P().rutaDeFamilia(f, c.ruta); return `<span class="chip" style="background:${f.color}"></span>${esc(f.colorNombre)}: pista #${r.indexOf(loc) + 1}`; }).join(' &nbsp; ');
      return hoja(`<div class="org-cabeza"><b>📍 Escondite ${i + 1} de ${c.ruta.length}: ${esc(L.nombre.toUpperCase())}</b> <small>(${esc(L.zona)})</small><br>
        Esconde aquí estas tarjetas: <b>${esc(L.escondite)}</b><br><small>${lista} · Recorta esta parte, no se esconde.</small></div>
        <div class="rejilla-tarjetas">${fams.map(f => tarjeta(f, P().cod.lugar(f.id, loc))).join('')}</div>`, 'tarjetas');
    }).join('');
  }
  function trampas(incluir) {
    const fams = familias(incluir);
    const paginas = [];
    for (let i = 0; i < fams.length; i += 2) paginas.push(fams.slice(i, i + 2));
    return paginas.map(par => hoja(`<div class="org-cabeza"><b>🪤 PISTAS FALSAS</b> — se ven igual que las reales. Escóndelas CERCA de escondites reales, por ejemplo:<br><small>${J.sugerenciasTrampa.slice(0, 6).map(esc).join(' · ')}</small></div>
      <div class="rejilla-tarjetas">${par.map(f => Array.from({ length: J.trampasPorFamilia }, (_, n) => tarjeta(f, P().cod.trampa(f.id, n + 1))).join('')).join('')}</div>`, 'tarjetas')).join('');
  }
  function regalos() {
    const pares = [];
    for (let i = 0; i < J.regalosFalsos.length; i += 4) pares.push(J.regalosFalsos.slice(i, i + 4));
    return pares.map(gs => hoja(`<div class="org-cabeza"><b>🎁 REGALOS FALSOS</b> — mete cada tarjeta en una cajita con el objeto indicado y envuélvela.<br>
      <small>${gs.map(g => `<b>#${g.id}</b> ${esc(g.titulo)}: ${esc(g.adentro)}`).join(' · ')}</small></div>
      <div class="rejilla-tarjetas">${gs.map(g => `<div class="tarjeta-pista regalo" style="--fam:#7c5cbf">
        <div class="tp-banda"><span class="tp-icono">${A.svg(A.regalo('#f5c542', '#fff'), '0 0 100 100')}</span><span>Regalo sorpresa #${g.id}</span></div>
        <div class="tp-titulo">¿Qué será?</div>${qr(P().urlCodigo(P().cod.regalo(g.id)), 'tp-qr')}
        <div class="tp-cod">Código: <b>${P().cod.regalo(g.id)}</b></div>
        <div class="tp-pie">Escanéenme para saber si es un regalo… ¡o una broma de Tilín!</div>
        <div class="tp-tilin">${tilinSVG({ boca: 'sonrisa' })}</div></div>`).join('')}</div>`, 'tarjetas')).join('');
  }

  /* ---------------- COFRE ---------------- */
  function cofre(incluir) {
    const fams = familias(incluir);
    const etiqueta = (color, titulo, sub) => `<div class="etiqueta-candado" style="--fam:${color}"><div class="ec-hoyo"></div><b>${titulo}</b><small>${sub}</small></div>`;
    return hoja(`<div class="cartel-cofre">
        <p class="cc-propiedad">Propiedad del Duende Tilín</p>
        <h1>Cofre Encantado</h1>
        <div class="cc-arte">${A.svg(A.cofre(fams.map(f => f.color)), '0 0 340 260')}</div>
        <p class="cc-prohibido">¡PROHIBIDO ABRIR!</p>
        <p class="cc-regla">Este cofre sólo se abre cuando <b>todas las familias</b> quiten su candado… y la <b>Agente Especial</b> use la <b>Llave Dorada</b>.</p>
        <div class="cc-tilin">${tilinSVG({ boca: 'risa', cejas: 'feliz' })}</div>
      </div>`, 'cartel') +
      hoja(`<h2 class="h-cof">Etiquetas para los candados <small>(recórtalas y amárralas con hilo)</small></h2>
        <div class="etiquetas">${fams.map(f => etiqueta(f.color, esc(nombreFam(f)), `Candado color ${esc(f.colorNombre.toLowerCase())}`)).join('')}${etiqueta('#f5c542', 'Llave Dorada', 'Sólo la Agente Especial')}</div>
        <h2 class="h-cof">QR final <small>(va DENTRO del cofre, encima de los premios)</small></h2>
        <div class="qr-final"><div><h3>¡Lo lograron!</h3><p>Escaneen este código para ver qué pasó con Tilín.</p><p class="peque">Código: <b>${P().cod.cofre()}</b></p></div>${qr(P().urlCodigo(P().cod.cofre()), 'qr-medio')}</div>
        <h2 class="h-cof">Letreros</h2>
        <div class="letreros">${[1, 2].map(() => `<div class="letrero">🚫 ZONA SIN PISTAS<small>Aquí no hay nada… ¡palabra de duende!</small></div>`).join('')}</div>`, 'cofre');
  }

  /* ---------------- AGENTE ESPECIAL ---------------- */
  function agente() {
    const c = P().cfg();
    const famA = c.familias.find(f => f.agente) || c.familias[0], famD = c.familias.find(f => f.descifradora) || c.familias[1];
    const nombre = esc(famA.agente || J.agente), nombreD = esc(famD.descifradora || J.descifradora);
    const lupa = `<svg viewBox="0 0 100 100"><line x1="60" y1="60" x2="90" y2="90" stroke="#5a2d0c" stroke-width="14" stroke-linecap="round"/><circle cx="40" cy="40" r="30" fill="#bff3ff" stroke="#2b1a10" stroke-width="8"/></svg>`;
    const gafete = (color, cargo, quien, fam, mision, codigo, emblema) => `<div class="gafete" style="--fam:${color}">
        <div class="gf-banda"></div><div class="gf-ranura"></div>
        <div class="gf-titulo">Taller de Santa · Polo Norte</div><div class="gf-cargo">${cargo}</div>
        <div class="gf-emblema">${emblema}</div>
        <div class="gf-foto">Pega aquí<br>tu foto</div>
        <div class="gf-nombre">${quien}</div><div class="gf-familia">Familia ${esc(fam.nombre)}</div>
        <div class="gf-pie"><span><b>Misión:</b><br>${mision}</span>${qr(P().urlCodigo(codigo))}</div></div>`;
    return hoja(`<div class="carta-santa">
        <div class="cs-sello">🎅</div>
        <p class="cs-lugar">Taller de Santa · Polo Norte</p>
        <h1>Querida ${nombre}:</h1>
        <p>Soy Santa Claus, y te escribo desde el Polo Norte porque tengo un problema muy grande. El duende <b>Tilín</b> se escapó del taller y se llevó los regalos de tu casa. Necesito tu ayuda.</p>
        <p>Por eso, te nombro <b>Agente Especial de Santa</b>. Te mando la <b>Llave Dorada</b>: es mágica, y es la única que puede abrir el último candado del cofre de Tilín.</p>
        <p>Cuídala mucho y no se la des a nadie, ¡ni siquiera a Tilín si te la pide!</p>
        <p>Ayuda a tu familia a encontrar las pistas, y cuando todos los candados estén abiertos, tú abrirás el último.</p>
        <p><b>¡Confío en ti!</b></p>
        <p class="cs-firma">Con mucho cariño,<br><span>Santa Claus</span><br>¡Jo, jo, jo!</p>
        <div class="cs-qr">${qr(P().urlCodigo(P().cod.carta()), 'qr-chico')}<small>🔊 Escanea y escucha a Santa</small></div>
      </div>`, 'carta') +
      hoja(`<div class="carta-santa carta-gaby">
        <div class="cs-sello">🎅</div>
        <p class="cs-lugar">Taller de Santa · Polo Norte</p>
        <h1>Querida ${nombreD}:</h1>
        <p>Soy Santa Claus. El duende <b>Tilín</b> se robó los regalos de tu casa y, como le encantan los mensajes secretos, dejó acertijos y códigos por todas partes.</p>
        <p>Necesito a alguien muy lista para descifrarlos. Por eso, te nombro <b>Descifradora Oficial de Santa</b>.</p>
        <p>Tu misión: ayudar a tu familia con los códigos más difíciles y resolver el <b>Reto Experto</b> que Tilín escondió sólo para ti. Si lo logras, tu familia ganará un comodín extra.</p>
        <p>Para que calientes motores, aquí va tu primer mensaje secreto (usa el Alfabeto del Duende de tu kit):</p>
        <div class="cifra-glifos imp-glifos">${P().glifosHTML('BIENVENIDA', 30, '#2b1a10')}</div>
        <p><b>¡Confío en tu cerebro!</b></p>
        <p class="cs-firma">Con cariño,<br><span>Santa Claus</span><br>¡Jo, jo, jo!</p>
        <div class="cs-qr">${qr(P().urlCodigo(P().cod.cartaGaby()), 'qr-chico')}<small>🔊 Escanea y escucha a Santa</small></div>
      </div>`, 'carta') +
      hoja(`<h2 class="h-cof">Gafetes <small>(recórtalos, enmícalos o pégalos en cartulina y ponles un cordón en la ranura)</small></h2>
        <div class="gafetes">
          ${gafete('#d7263d', 'Agente Especial', nombre, famA, 'Cuidar la Llave Dorada y abrir el último candado.', P().cod.carta(), A.svg(A.icono('estrella', '#f5c542', '#2b1a10'), '0 0 100 100'))}
          ${gafete('#1b998b', 'Descifradora Oficial', nombreD, famD, 'Descifrar los códigos secretos de Tilín.', P().cod.cartaGaby(), lupa)}
        </div>
        <h2 class="h-cof">Etiqueta de la Llave Dorada y medallas <small>(para el final)</small></h2>
        <div class="fila-medallas">
          <div class="etiqueta-candado" style="--fam:#f5c542;width:46mm"><div class="ec-hoyo"></div><b>Llave Dorada</b><small>Propiedad de la Agente ${nombre}</small></div>
          <div class="medalla"><div><small>Medalla de</small><b>Agente Especial</b><span>★ ${nombre} ★</span></div></div>
          <div class="medalla verde"><div><small>Medalla de</small><b>Descifradora Oficial</b><span>★ ${nombreD} ★</span></div></div>
        </div>`, 'agente');
  }

  /* ---------------- DIPLOMAS ---------------- */
  function diplomas(incluir) {
    const fams = familias(incluir);
    const d = (titulo, quien, texto, color) => hoja(`<div class="diploma" style="--fam:${color}">
      <div class="dp-marco"><p class="dp-sup">El Taller de Santa otorga el presente</p><h1>${titulo}</h1><p class="dp-a">a</p><h2>${quien}</h2>
      <p class="dp-texto">${texto}</p>
      <div class="dp-firmas"><div><span class="dp-firma">Santa Claus</span><small>Santa Claus</small></div><div class="dp-sello">${A.svg(A.icono('estrella', '#f5c542', '#2b1a10'), '0 0 100 100')}</div><div><span class="dp-firma">Tilín</span><small>Duende Tilín (arrepentido)</small></div></div>
      <p class="dp-fecha">Navidad ${new Date().getFullYear()}</p></div>
      <div class="dp-tilin">${tilinSVG({ boca: 'risa', cejas: 'feliz' })}</div></div>`, 'horizontal');
    return fams.map(f => d('Diploma de Recuperadores de la Navidad', esc(nombreFam(f).replace('Familia: ______________________', 'Familia _______________')), 'por resolver los acertijos del Duende Tilín, no caer (casi) en sus trampas y rescatar los regalos del Cofre Encantado.', f.color)).join('') +
      d('Diploma de Agente Especial de Santa', esc(J.agente), 'por cuidar la Llave Dorada con valentía y abrir el último candado del Cofre Encantado. ¡La Navidad está a salvo gracias a ti!', '#f5c542') +
      d('Diploma de Descifradora Oficial de Santa', esc(J.descifradora), 'por descifrar los códigos secretos del Duende Tilín y ayudar a su familia a recuperar la Navidad. ¡No hay mensaje secreto que se te resista!', '#1b998b');
  }

  /* ---------------- HOJA DE RESPUESTAS ---------------- */
  function respuestas(incluir) {
    const c = P().cfg(), fams = familias(incluir);
    const tipoNombre = { poema: 'Acertijo (poema)', cesar: 'Cifrado César', anagrama: 'Letras revueltas', emoji: 'Emojis', simbolos: 'Alfabeto del duende' };
    const porFam = fams.map(f => {
      const ruta = P().rutaDeFamilia(f, c.ruta), retos = J.retosPorFamilia[f.id];
      return `<h2 style="color:${f.color}">${esc(nombreFam(f))} · candado <b>${esc(f.codigo)}</b>${f.agente ? ' · Agente ' + esc(f.agente) : ''}</h2>
        <table class="tabla-resp"><thead><tr><th>#</th><th>Escondite (código tarjeta)</th><th>Cómo se presenta</th><th>Reto → respuesta</th><th>Dígito</th></tr></thead><tbody>
        ${ruta.map((loc, k) => { const r = J.retos[retos[k]], d = J.pasosConDigito.indexOf(k + 1); return `<tr><td>${k + 1}</td><td><b>${esc(J.lugares[loc].nombre)}</b> (${P().cod.lugar(f.id, loc)})</td><td>${tipoNombre[P().presentacion(f, k)]}</td><td>${esc(r.titulo)} → <b>${esc(r.respuestas[0])}</b></td><td>${d >= 0 ? `<b>${esc(f.codigo[d])}</b> (${d + 1}º)` : ''}</td></tr>`; }).join('')}
        </tbody></table>
        <p class="peque">${f.agente ? `<b>Bono:</b> si ${esc(f.agente)} cumple ${J.misionesParaBono} misiones → +1 comodín.` : (() => { const x = J.retosExpertos[f.id] || J.retosExpertos.fx; return `<b>Reto Experto${f.descifradora ? ' de ' + esc(f.descifradora) : ''}</b> (desde la pista ${J.pasoRetoExperto}): ${esc(x.titulo)} → <b>${esc(x.respuestas[0])}</b> (+1 comodín).`; })()}
        · Pistas falsas: ${Array.from({ length: J.trampasPorFamilia }, (_, n) => P().cod.trampa(f.id, n + 1)).join(', ')}</p>`;
    }).join('');
    return hoja(`<h1 class="h-resp">🤫 Hoja de respuestas <small>¡Sólo para el organizador!</small></h1>${porFam}
      <h2>Regalos falsos</h2><table class="tabla-resp"><tbody>${J.regalosFalsos.map(g => `<tr><td>#${g.id} (${P().cod.regalo(g.id)})</td><td><b>${esc(g.titulo)}</b></td><td>${esc(g.adentro)}</td><td>${{ congelar: `Congela ${g.segundos} s`, comodin: '+1 comodín', reto: 'Reto chistoso', broma: 'Sólo broma' }[g.efecto]}</td></tr>`).join('')}</tbody></table>
      <p class="peque">QR final (dentro del cofre): ${P().cod.cofre()} · QR de la carta de Santa: ${P().cod.carta()} · PIN del organizador: ${esc(J.pinOrganizador)}</p>`, 'respuestas flujo');
  }

  /* ---------------- GUÍA DEL ORGANIZADOR ---------------- */
  function guia() {
    const c = P().cfg(), url = P().baseUrl();
    const activas = c.familias.filter(f => f.activa);
    const guion = window.GUION || [];
    return hoja(`<div class="guia-portada"><div class="gp-tilin">${tilinSVG({ boca: 'risa', cejas: 'feliz' })}</div>
        <h1>El Gran Robo de Navidad</h1><p class="gp-sub">Guía del organizador</p>
        <p>Búsqueda del tesoro para ${activas.length} familias (${activas.map(f => esc(f.nombre)).join(', ')}) · 60 a 75 minutos · casa con patio</p>
        <div class="gp-app">${qr(url, 'qr-chico')}<div><b>La app del juego</b><br>${esc(url)}<br><small>Panel del organizador: «🔑 Organizador» · PIN <b>${esc(J.pinOrganizador)}</b></small></div></div></div>
      <h2>¿De qué se trata?</h2>
      <p>El duende <b>Tilín</b>, el más travieso del taller de Santa, se robó los regalos y los encerró en su <b>Cofre Encantado</b> con un candado por familia y un candado de llave: el de la <b>Llave Dorada</b>, que sólo puede abrir la Agente Especial <b>${esc(J.agente)}</b>.</p>
      <ul>
        <li>Cada familia recorre <b>${J.pasosPorFamilia} escondites</b> (en distinto orden) buscando tarjetas de <b>su color</b> con un código QR.</li>
        <li>En cada tarjeta la app les pone un <b>reto</b> (acertijos, cifrados, trivia). En 4 de ellos ganan un <b>número de su candado</b>.</li>
        <li>Hay <b>pistas falsas</b> (los congelan 1 minuto y les ponen un castigo chistoso) y <b>regalos falsos</b> (unos dan comodines y otros son bromas).</li>
        <li>Al tener los 4 números, la familia abre <b>su candado</b> del cofre. Cuando ya no queda ninguno, ${esc(J.agente)} abre el último con la Llave Dorada. Adentro están los premios y un <b>QR final</b> que muestra cómo termina la historia.</li>
        <li><b>Gaby</b> es la <b>Descifradora Oficial de Santa</b>: en la app de su familia se abre su <b>Reto Experto</b> al encontrar la pista ${J.pasoRetoExperto}.</li>
        <li>Cada familia puede ganar <b>1 comodín extra</b>: Reyes Martínez si ${esc(J.agente)} cumple ${J.misionesParaBono} misiones, Reyes Flores si ${esc(J.descifradora)} resuelve su Reto Experto, y las demás con su propio Reto Experto.</li>
        <li>Así hay carrera (¿quién abre primero?), pero <b>todos ganan juntos</b> al final.</li>
      </ul>
      <h2>Lista de compras</h2>
      <table class="tabla-guia"><tbody>
        <tr><td>🔐</td><td><b>${activas.length} candados de combinación de 4 números</b>, de los que se pueden reprogramar (uno por familia; ${c.familias.length} si viene la familia invitada).</td></tr>
        <tr><td>🗝️</td><td><b>1 candado chico de llave</b> (el de la Llave Dorada). Pinta la llave con plumón dorado o ponle un listón dorado.</td></tr>
        <tr><td>🔗</td><td><b>1 pinza de bloqueo múltiple</b> (en ferreterías o en línea como «pinza de bloqueo» o «lockout hasp»). Todos los candados se cuelgan de la misma pinza: el cofre sólo abre cuando se quitaron <b>todos</b>. Si no la consigues: pasa una cadena por las asas del cofre y cierra los dos extremos con <b>todos</b> los candados atravesando los <b>mismos dos eslabones</b>. ⚠️ No encadenes los candados uno tras otro: así se abriría quitando cualquiera.</td></tr>
        <tr><td>🧰</td><td><b>1 «cofre»</b>: caja de plástico con asas, maleta vieja o baúl donde la pinza o cadena lo deje bien cerrado.</td></tr>
        <tr><td>🏆</td><td><b>Premios</b> para el cofre (para todas las familias y algo especial para ${esc(J.agente)}).</td></tr>
        <tr><td>🎁</td><td><b>8 cajitas</b> + papel de regalo para los regalos falsos, y lo que va adentro: carbón de dulce, 1 chocolate, 1 calcetín viejo, 1 cebolla, varias cajas chicas, 1 galleta, 1 llave vieja, monedas de chocolate.</td></tr>
        <tr><td>✉️</td><td><b>${activas.length + 2} sobres</b> (uno por familia y dos para las cartas de Santa).</td></tr>
        <tr><td>🪪</td><td><b>2 porta-gafetes con cordón</b> (o mica y un listón) para los gafetes de ${esc(J.agente)} y ${esc(J.descifradora)}.</td></tr>
        <tr><td>✂️</td><td>Impresora a color, hojas tamaño carta (mejor si son gruesas), tijeras, cinta, hilo, bolsitas tipo ziploc (para las tarjetas del patio y del refri) y una tachuela o broche para la Rueda del Duende.</td></tr>
        <tr><td>📺</td><td>Tele o pantalla con bocina para los videos (o una laptop / bocina bluetooth).</td></tr>
        <tr><td>📱</td><td>Un celular con internet y batería por familia (el «celular oficial»).</td></tr>
      </tbody></table>
      <h2>Unos días antes</h2>
      <ol>
        <li>Abre la app en tu celular o computadora y entra a <b>🔑 Organizador</b> (PIN ${esc(J.pinOrganizador)}).</li>
        <li>Revisa los ${J.pasosPorFamilia} escondites. Hoy son: <b>${c.ruta.map(r => esc(J.lugares[r].nombre)).join(', ')}</b>. Si alguno no existe en la casa, cámbialo y guarda.</li>
        <li><b>Candados:</b> programa cada uno con el código de su familia (${activas.map(f => `${esc(f.nombre)}: <b>${esc(f.codigo)}</b>`).join(' · ')}). Si tus candados no se pueden reprogramar, escribe su código en el panel.</li>
        <li>¿Viene otra familia? Actívala en el panel (o el mismo día con «Activar otra familia» en el celular de esa familia).</li>
        <li><b>Imprime</b> desde el panel (botón 🖨️ → «Guardar como PDF» o imprimir, tamaño Carta, escala 100%). Si no cambiaste nada, también puedes usar los PDF que ya vienen hechos.</li>
        <li>Arma <b>los sobres</b>: hoja «Sobre de Misión» + Kit del Detective (con la Rueda del Duende ya armada, si quieres).</li>
        <li>Arma <b>los regalos falsos</b> (objeto + su tarjeta, envueltos).</li>
        <li>Arma <b>el cofre</b>: premios adentro, encima la tarjeta del <b>QR final</b>, ciérralo con la pinza y todos los candados (con sus etiquetas). Pégale el cartel.</li>
        <li>Mete la <b>carta de Santa</b>, su <b>gafete</b> y la <b>Llave Dorada</b> en un sobre para ${esc(J.agente)}, y la carta y el gafete de <b>Descifradora Oficial</b> en otro sobre para ${esc(J.descifradora)}.</li>
        <li><b>Prueba</b> con tu celular: escanea una tarjeta y revisa que abre la app (luego en el panel: «Borrar partida de este teléfono»).</li>
      </ol>
      <h2>El día del juego: 1 hora antes</h2>
      <ul>
        <li>Esconde las <b>tarjetas de pistas</b>. Cada hoja dice arriba el escondite y el lugar exacto (esa franja se recorta y no se esconde). En cada escondite van las tarjetas de <b>todas</b> las familias.</li>
        <li>Esconde las <b>pistas falsas</b> cerca de escondites reales (ej. en el congelador si la real está en la puerta del refri).</li>
        <li>Reparte los <b>8 regalos falsos</b> por la casa y el patio, algunos a la vista.</li>
        <li>Pon el <b>Cofre Encantado</b> bajo el árbol, bien a la vista. ¡Que se vea desde el principio!</li>
        <li>Pega los letreros de <b>«Zona sin pistas»</b> en los cuartos donde no se debe buscar.</li>
        <li><b>Truco teatral (opcional):</b> esconde los regalos reales del árbol en un cuarto cerrado. Cuando termine el video… ¡todos verán el árbol vacío!</li>
      </ul>
      <h2>Orden del evento</h2>
      <table class="tabla-guia"><tbody>
        <tr><td><b>0:00</b></td><td>Reúne a todos frente a la tele y pon <b>«📽️ Ver la historia»</b> en la app (2 minutos).</td></tr>
        <tr><td><b>0:03</b></td><td>¡Tocan la puerta! «Llegó correo del Polo Norte»: entrega a ${esc(J.agente)} su carta, gafete y Llave Dorada, y a ${esc(J.descifradora)} su carta y gafete de Descifradora Oficial. Escanea el QR de cada carta para que Santa les hable.</td></tr>
        <tr><td><b>0:05</b></td><td>Entrega a cada familia su <b>Sobre de Misión</b> y lee las reglas (abajo).</td></tr>
        <tr><td><b>0:07</b></td><td>¡A jugar! Cada familia escanea el QR de su sobre y la app les da la primera pista.</td></tr>
        <tr><td><b>~1:05</b></td><td>Las familias van terminando y abriendo su candado. En la app marcan «Ya abrimos nuestro candado» (queda registrado su tiempo).</td></tr>
        <tr><td><b>Final</b></td><td>Con todos los candados fuera, ${esc(J.agente)} abre el último con la Llave Dorada. Abren el cofre, escanean el <b>QR final</b> y ponen el <b>video final</b> en la tele. Premios y diplomas.</td></tr>
      </tbody></table>
      <h2>Reglas (léelas en voz alta)</h2>
      <ol>
        <li>Cada familia usa <b>un solo celular</b> y sigue sólo las tarjetas de <b>su color</b>.</li>
        <li>Las tarjetas de otras familias <b>no se mueven ni se esconden</b>. Si encuentran una, la dejan donde estaba.</li>
        <li>Las pistas van <b>en orden</b>; la app les avisa si se adelantaron.</li>
        <li>Nada de correr adentro de la casa ni de entrar a las «Zonas sin pistas».</li>
        <li>Pueden abrir los regalos sorpresa que encuentren… bajo su propio riesgo. 😈</li>
        <li>Gana la familia que abra primero su candado, pero el cofre sólo se abre cuando <b>todas</b> terminen.</li>
      </ol>
      <h2>La Agente Especial ${esc(J.agente)}</h2>
      <ul>
        <li>Recibe la carta de Santa y guarda la <b>Llave Dorada</b> todo el juego.</li>
        <li>En la app de su familia (${esc((c.familias.find(f => f.agente) || {}).nombre || '')}) aparecen <b>8 misiones</b> con audio: buscar algo rojo, reír como duende, caminar de puntitas… Cada una le da una estrella ⭐.</li>
        <li>Si cumple ${J.misionesParaBono} misiones, su familia gana <b>1 comodín extra</b>.</li>
        <li>Al final <b>ella abre el último candado</b>: es la heroína de la historia. Dejen que ella apriete el botón de escanear de vez en cuando.</li>
      </ul>
      <h2>La Descifradora Oficial ${esc(J.descifradora)}</h2>
      <ul>
        <li>Recibe su carta de Santa (con un primer mensaje secreto para practicar) y su gafete.</li>
        <li>Es la experta del <b>Kit del Detective</b> de su familia: rueda, alfabeto secreto y Morse.</li>
        <li>Al encontrar la pista ${J.pasoRetoExperto}, en la app aparece su <b>Reto Experto</b> (un doble cifrado). Si lo resuelve, su familia gana <b>1 comodín extra</b>.</li>
        <li>Sale en los dos videos y tiene su diploma y medalla.</li>
      </ul>
      <h2>Cómo funciona la app</h2>
      <ul>
        <li><b>📷 Escanear tarjeta</b> abre la cámara. Si no abre, pueden escribir el código de 4 letras que viene en la tarjeta.</li>
        <li><b>Comodines 🔔</b>: 3 por familia. El primero da una pista y el segundo, la respuesta.</li>
        <li><b>Pista falsa</b>: 60 segundos congelados y un castigo chistoso. <b>Tarjeta de otro color</b>: la app dice que no es suya.</li>
        <li>El avance se guarda en el celular aunque se cierre la app (no borren los datos del navegador ni usen modo incógnito).</li>
      </ul>
      <h2>Si algo falla</h2>
      <ul>
        <li><b>La cámara no abre:</b> en iPhone, Ajustes → Safari → Cámara → Permitir. En Android, aceptar el permiso en Chrome. Mientras, escriban el código de la tarjeta.</li>
        <li><b>Se perdió una tarjeta:</b> busca su código en la hoja de respuestas y que lo escriban a mano en «Escanear».</li>
        <li><b>Una familia se atoró:</b> dales una pista tú o regálales un comodín escondiendo otro regalo sorpresa.</li>
        <li><b>Se borró el avance o cambiaron de celular:</b> en el panel del organizador de ese celular usa «Poner partida en la pista…» para regresarlos a donde iban.</li>
        <li><b>No hay internet en el patio:</b> abran la app con wifi antes de salir y escaneen siempre con el botón de la app (no con la cámara normal).</li>
      </ul>
      <h2>Guion del video (por si prefieren narrarlo en vivo)</h2>
      <div class="guion">${guion.map(g => `<p><b>${g.voz}:</b> ${esc(g.texto)}</p>`).join('')}</div>`, 'guia flujo');
  }

  /* ---------------- CUENTO ---------------- */
  function cuento() {
    const pags = window.CUENTO || [];
    let h = hoja(`<div class="cuento-portada"><h1>El Gran Robo<br><span>de Navidad</span></h1>${tilinSVG({ boca: 'risa', cejas: 'feliz' })}<p>Un cuento para las familias Reyes Martínez, Reyes Flores y Alvarado Flores</p></div>`, 'cuento');
    for (let i = 0; i < pags.length; i += 2) {
      h += hoja(pags.slice(i, i + 2).map(p => `<figure class="cuento-pag"><img src="img/cuento/${p.img}.jpg" alt=""><figcaption>${esc(p.texto).replace(/\n/g, '<br>')}</figcaption></figure>`).join(''), 'cuento');
    }
    return h;
  }

  const TIPOS = {
    guia: ['📘 Guía del organizador', guia, false], respuestas: ['🤫 Hoja de respuestas', respuestas, true], sobres: ['✉️ Sobres de misión + kit', sobres, true],
    pistas: ['🗺️ Tarjetas de pistas', pistas, true], trampas: ['🪤 Pistas falsas', trampas, true], regalos: ['🎁 Regalos falsos', regalos, false],
    cofre: ['🔐 Cofre y candados', cofre, true], agente: ['⭐ Cartas y gafetes', agente, false], diplomas: ['🏆 Diplomas', diplomas, true], cuento: ['📖 Cuento', cuento, false]
  };

  function render(tipo, app) {
    const def = TIPOS[tipo] || TIPOS.guia;
    const params = new URLSearchParams(location.hash.split('?')[1] || '');
    let incluir = params.get('todas') === '1';
    if (params.get('base')) { /* sólo para generar PDFs */ const o = JSON.parse(localStorage.getItem('rgn-config') || '{}'); o.base = params.get('base'); localStorage.setItem('rgn-config', JSON.stringify(o)); }
    const pinta = () => {
      app.innerHTML = `<div class="barra-imprimir">
          <a class="btn" href="#/org">← Panel</a>
          <button class="btn primario" onclick="window.print()">🖨️ Imprimir / Guardar PDF</button>
          ${def[2] ? `<label class="chk"><input type="checkbox" id="chk-todas" ${incluir ? 'checked' : ''}> Incluir familias que aún no juegan</label>` : ''}
          <span class="nota">Tamaño Carta · escala 100% · con gráficos de fondo</span>
        </div>
        <div class="hojas" id="hojas">${def[1](incluir)}</div>`;
      const chk = document.getElementById('chk-todas');
      if (chk) chk.addEventListener('change', () => { incluir = chk.checked; pinta(); });
      ajusta();
    };
    document.title = def[0] + ' · El Gran Robo de Navidad';
    document.documentElement.classList.toggle('pagina-horizontal', tipo === 'diplomas');
    let st = document.getElementById('estilo-pagina');
    if (!st) { st = document.createElement('style'); st.id = 'estilo-pagina'; document.head.appendChild(st); }
    st.textContent = `@page { size: letter ${tipo === 'diplomas' ? 'landscape' : 'portrait'}; margin: ${['guia', 'respuestas'].includes(tipo) ? '11mm' : '0'}; }`;
    pinta();
  }
  function ajusta() {
    const h = document.getElementById('hojas'); if (!h) return;
    const ancho = document.documentElement.clientWidth, pagina = document.documentElement.classList.contains('pagina-horizontal') ? 1056 : 816;
    h.style.zoom = ancho < pagina + 32 ? ((ancho - 16) / pagina).toFixed(3) : '';
  }
  addEventListener('resize', ajusta);
  window.addEventListener('beforeprint', () => { const h = document.getElementById('hojas'); if (h) h.style.zoom = ''; });
  window.addEventListener('afterprint', ajusta);
  return { render, TIPOS };
})();
