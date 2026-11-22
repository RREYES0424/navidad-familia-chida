/* =========================================================================
   EL GRAN ROBO DE NAVIDAD — contenido del juego
   Todo el texto del juego vive aquí. Si quieres cambiar algo (nombres,
   códigos de candados, acertijos...), este es el archivo.
   ========================================================================= */
window.JUEGO = {
  titulo: 'El Gran Robo de Navidad',
  villano: 'Tilín',
  agente: 'Ana Sofía',            // la Agente Especial de Santa (familia Reyes Ramírez)
  descifradora: 'Gaby',           // la Descifradora Oficial de Santa (familia Reyes Flores)
  pinOrganizador: '4826',         // PIN para entrar al panel del organizador
  baseUrlPorDefecto: 'https://rreyes0424.github.io/navidad-familia-chida/',
  pasosPorFamilia: 7,
  pasosConDigito: [2, 4, 6, 7],   // en estos pasos (1..7) se gana un dígito del candado
  comodinesIniciales: 3,
  segundosCongelados: 60,

  /* ---------------- FAMILIAS ----------------
     color: color de sus tarjetas · codigo: combinación de SU candado (4 dígitos)
     agente: si en la familia hay un/a peque con misiones especiales            */
  familias: [
    { id: 'rm', nombre: 'Reyes Ramírez', color: '#d7263d', colorNombre: 'Roja',   icono: 'estrella', codigo: '3815', agente: 'Ana Sofía', activa: true,  offset: 0 },
    { id: 'rf', nombre: 'Reyes Flores',   color: '#1b998b', colorNombre: 'Verde',  icono: 'arbol',    codigo: '7264', descifradora: 'Gaby', activa: true,  offset: 2 },
    { id: 'af', nombre: 'Alvarado Flores',color: '#e0a100', colorNombre: 'Dorada', icono: 'campana',  codigo: '5490', activa: true,  offset: 4 },
    { id: 'fx', nombre: 'Familia Invitada', color: '#3a6ea5', colorNombre: 'Azul', icono: 'copo',     codigo: '1736', activa: false, offset: 6 }
  ],

  /* Los 7 escondites que se usan (en este orden se recorren; cada familia empieza
     en un punto distinto de la vuelta para que no se amontonen).               */
  rutaPorDefecto: ['arbol', 'refri', 'maceta', 'sillon', 'lavadora', 'zapatos', 'microondas'],

  /* Cómo se presenta el acertijo de cada escondite (se van rotando) */
  ciclosPresentacion: ['poema', 'cesar', 'poema', 'anagrama', 'emoji', 'poema', 'simbolos'],

  /* ---------------- BANCO DE ESCONDITES ---------------- */
  lugares: {
    arbol: { nombre: 'Árbol de Navidad', zona: 'Sala', palabra: 'ARBOL',
      escondite: 'Colgada entre las ramas de ATRÁS del árbol, a media altura, como si fuera una esfera.',
      detalle: 'entre sus ramas de atrás',
      emoji: '🌲 ✨ ⭐ 🎁',
      poema: 'Me ponen esferas, series y listón,\ny una estrella en la punta, como gran campeón.\nMis regalos se esfumaron (ya saben por quién)…\nbusquen entre mis ramas de atrás: ¡algo cuelga también!',
      pista1: 'Es lo más navideño de toda la sala.' },
    refri: { nombre: 'Refrigerador', zona: 'Cocina', palabra: 'REFRIGERADOR',
      escondite: 'Por dentro, en la PUERTA del refri (en la repisa de la leche o los huevos). Puedes meterla en una bolsita.',
      detalle: 'por dentro, en su puerta',
      emoji: '🧊 🥛 🍗 🚪',
      poema: 'Vivo en la cocina, calladito y formal;\npor fuera soy grandote y por dentro hace un frío polar.\nCuido la leche, la gelatina y el pastel…\nabran mi puerta: en ella Tilín dejó un papel.',
      pista1: 'Es un aparato de la cocina que siempre está frío.' },
    microondas: { nombre: 'Microondas', zona: 'Cocina', palabra: 'MICROONDAS',
      escondite: 'Adentro del microondas, sobre el plato giratorio. (Avisa en la cocina que nadie lo prenda.)',
      detalle: 'adentro, sobre el plato que gira',
      emoji: '📦 〰️ 🍿 ⏱️',
      poema: 'Tengo una ventanita y un plato que da vueltas,\ncaliento el café y las palomitas sueltas.\nCuando termino canto: «¡bip, bip, bip!»…\nábranme la puerta: la pista está aquí.',
      pista1: 'Calienta la comida en segundos y hace «bip».' },
    lavadora: { nombre: 'Lavadora', zona: 'Patio o lavado', palabra: 'LAVADORA',
      escondite: 'Pegada por dentro de la TAPA de la lavadora (o adentro, si está vacía).',
      detalle: 'bajo su tapa',
      emoji: '👕 🫧 🌀 💦',
      poema: 'Doy vueltas y vueltas y nunca me mareo,\nla ropa sucia me visita y la devuelvo de paseo.\nMe trago el jabón y hago espuma a montón…\nlevanten mi tapa y encontrarán la solución.',
      pista1: 'Aquí entra la ropa sucia y sale limpia.' },
    sillon: { nombre: 'Sillón de la sala', zona: 'Sala', palabra: 'SILLON',
      escondite: 'Debajo de uno de los COJINES del sillón grande.',
      detalle: 'debajo de uno de sus cojines',
      emoji: '🛋️ 😴 📺',
      poema: 'En mí se sientan, se acuestan y hasta brincan,\naquí el abuelo ronca y las siestas se alargan.\nTengo cojines suavecitos de color…\nlevántenlos uno por uno, ¡con cuidado, por favor!',
      pista1: 'Está en la sala y es lo más cómodo de la casa.' },
    zapatos: { nombre: 'Zapatos de la entrada', zona: 'Entrada', palabra: 'ZAPATOS',
      escondite: 'Dentro de un zapato o bota en la entrada / zapatera.',
      detalle: 'dentro de uno de ellos, en la entrada',
      emoji: '👞 👟 🦶 🚪',
      poema: 'Tenemos lengua pero nunca hablamos,\nde dos en dos a todas partes vamos.\nEn la entrada esperamos a que nos vengan a usar…\nmetan la mano en uno: ¡algo van a encontrar!',
      pista1: 'Siempre andan en pares y se usan en los pies.' },
    maceta: { nombre: 'Maceta del patio', zona: 'Patio', palabra: 'MACETA',
      escondite: 'Debajo de una maceta del patio (en una bolsita para que no se moje).',
      detalle: 'debajo de ella, en el patio',
      emoji: '🪴 💧 ☀️',
      poema: 'Vivo en el patio, me encanta el sol,\ntengo tierra en la panza y una planta en flor.\nSi me riegan, crezco; si no, me pongo triste…\nlevántenme poquito: ¡ahí está lo que no viste!',
      pista1: 'Está en el patio y tiene una planta.' },
    tendedero: { nombre: 'Tendedero', zona: 'Patio', palabra: 'TENDEDERO',
      escondite: 'Colgada con una pinza de ropa en el tendedero.',
      detalle: 'colgada con una pinza',
      emoji: '👕 👖 🧦 ☀️',
      poema: 'Soy un cordón flaquito que vive afuera,\nde mí cuelgan sábanas, calcetines y la ropa entera.\nCon pinzas me agarran todo lo que está mojado…\nbusquen la pinza que tiene un papelito colgado.',
      pista1: 'Ahí se seca la ropa al sol.' },
    bano: { nombre: 'Baño (papel)', zona: 'Baño', palabra: 'BAÑO',
      escondite: 'Dentro del tubo de cartón del rollo de papel de baño (o detrás del espejo).',
      detalle: 'dentro del tubo del papel',
      emoji: '🚽 🧻 🪥 🪞',
      poema: 'Aquí todos vienen aunque nadie lo platica,\nhay jabón, un espejo y una toalla bonita.\nBusquen dentro del tubo del papel enrollado…\n¡úsenlo para la pista, no para otro lado!',
      pista1: 'Es el cuarto más pequeñito de la casa y tiene espejo.' },
    tele: { nombre: 'Televisión', zona: 'Sala', palabra: 'TELEVISION',
      escondite: 'Pegada DETRÁS de la televisión (o debajo del control remoto).',
      detalle: 'detrás de ella',
      emoji: '📺 🍿 🛋️ 🎬',
      poema: 'Cuando me prenden hablo y hablo sin parar,\ny en el sillón la familia se sienta a mirar.\nApagada soy un espejo negro y callado…\nbusquen detrás de mí: ¡hay algo pegado!',
      pista1: 'Todos la ven pero ella no ve a nadie.' },
    asador: { nombre: 'Asador', zona: 'Patio', palabra: 'ASADOR',
      escondite: 'Dentro del asador (frío y limpio), sobre la parrilla.',
      detalle: 'adentro, sobre la parrilla',
      emoji: '🔥 🥩 🌭 💨',
      poema: 'En la carne asada del domingo soy el rey del patio,\necho humo, huelo rico y nunca me canso.\nTengo parrilla y carbón en la panza…\nabran mi tapa: hoy no hay carne, ¡hay una pista que avanza!',
      pista1: 'Se usa para la carne asada.' },
    lavadero: { nombre: 'Lavadero', zona: 'Patio', palabra: 'LAVADERO',
      escondite: 'Debajo del lavadero o dentro de una cubeta junto a él.',
      detalle: 'debajo de él, junto a la cubeta',
      emoji: '🧼 🪣 👕 💧',
      poema: 'Soy de cemento y tengo una pileta de agua fría,\naquí se tallaba la ropa a mano todo el día.\nTengo una tabla con rayitas para restregar…\nbusquen debajo de mí, sin mojarse al buscar.',
      pista1: 'Es de cemento y sirve para tallar ropa a mano.' },
    tapete: { nombre: 'Tapete de la puerta', zona: 'Entrada', palabra: 'TAPETE',
      escondite: 'Debajo del tapete de la puerta principal.',
      detalle: 'debajo de él, en la entrada principal',
      emoji: '🚪 👣 🏠 👋',
      poema: 'Todos me pisan y nunca me enojo,\na quien llega le digo «bienvenido» sin abrir un ojo.\nEstoy en la puerta para limpiar zapatos…\nlevántenme tantito: ¡aquí estuvo Tilín un rato!',
      pista1: 'Dice «bienvenidos» y todos lo pisan.' },
    almohada: { nombre: 'Almohada', zona: 'Recámara', palabra: 'ALMOHADA',
      escondite: 'Debajo de la almohada de una cama (elige una recámara permitida).',
      detalle: 'debajo de ella, en una cama',
      emoji: '🛏️ 😴 💤 🌙',
      poema: 'Cada noche me abrazan y me cuentan sus sueños,\nsoy suave y esponjosa, la favorita de los pequeños.\nMe apachurran la cara cuando quieren dormir…\nbusquen debajo de mí, ¡pero no se vayan a dormir!',
      pista1: 'Está en una cama y es suavecita.' },
    cereal: { nombre: 'Caja de cereal', zona: 'Cocina', palabra: 'CEREAL',
      escondite: 'Dentro de una caja de cereal en la alacena (en una bolsita).',
      detalle: 'dentro de la caja, en la alacena',
      emoji: '🥣 🥛 🌽 📦',
      poema: 'Soy una caja que vive en la alacena,\nen el desayuno me sirven con la cuchara llena.\nHago «crunch, crunch» si me comen con prisa…\nmetan la mano en mi caja… ¡y aguanten la risa!',
      pista1: 'Se come en el desayuno con leche.' },
    garrafon: { nombre: 'Garrafón de agua', zona: 'Cocina', palabra: 'GARRAFON',
      escondite: 'Pegada al garrafón de agua o a su base.',
      detalle: 'pegada a él o a su base',
      emoji: '💧 🫙 🥤',
      poema: 'Soy grandote, transparente y lleno de agua,\ncuando me cambian hago «glu, glu» y todos se aguantan.\nEstoy en la cocina para quitarles la sed…\nbusquen pegadito a mí: ¡ahí lo van a ver!',
      pista1: 'Tiene agua para tomar y hace «glu, glu».' },
    escoba: { nombre: 'Escoba', zona: 'Patio', palabra: 'ESCOBA',
      escondite: 'Amarrada con un listón al palo de la escoba.',
      detalle: 'amarrada a su palo',
      emoji: '🧹 ✨ 🧹',
      poema: 'Tengo el pelo muy largo y jamás me peino,\nbailo con el polvo por todo el reino.\nMe esconden en un rincón cuando terminan de barrer…\nbusquen en mi palo: algo amarrado van a ver.',
      pista1: 'Sirve para barrer.' },
    nacimiento: { nombre: 'Nacimiento', zona: 'Sala', palabra: 'NACIMIENTO',
      escondite: 'Detrás del establo/pesebre del nacimiento.',
      detalle: 'detrás del establito',
      emoji: '⭐ 🐑 🫏 🏠 🌿',
      poema: 'Hay un burrito, un buey y una estrella en lo alto,\npastores, borreguitos y musgo como manto.\nDetrás del establito, sin hacer ningún ruido,\nTilín dejó un papel muy bien escondido.',
      pista1: 'Tiene pastores, borreguitos y una estrella.' }
  },

  /* ---------------- RETOS (acertijos para adultos) ----------------
     respuestas: se aceptan sin acentos ni mayúsculas.
     contiene: si la respuesta contiene alguna de estas palabras, también vale. */
  retos: {
    duendes:   { titulo: 'Taller de envolturas', texto: 'Si 3 duendes envuelven 3 regalos en 3 minutos, ¿cuántos minutos tardan 100 duendes en envolver 100 regalos?', respuestas: ['3', 'tres', '3 minutos', 'tres minutos'], pista: 'Cada duende tarda lo mismo en envolver SU regalo, sin importar cuántos duendes haya.', explica: 'Cada duende tarda 3 minutos en envolver un regalo. 100 duendes trabajando al mismo tiempo también tardan 3 minutos.' },
    hoyo:      { titulo: 'Adivinanza del duende', texto: 'Mientras más le quitas, más grande se hace. ¿Qué es?', respuestas: ['hoyo', 'un hoyo', 'el hoyo', 'agujero', 'un agujero', 'pozo', 'zanja', 'bache'], pista: 'Piensen en lo que hace una pala en la tierra.', explica: 'Un hoyo: mientras más tierra le quitas, más grande se hace.' },
    morse:     { titulo: 'El cascabel que habla', tipo: 'morse', palabra: 'RENO', texto: 'Tilín dejó este mensaje con su cascabel. Un «tilín» corto es punto (•) y un «tiliiiín» largo es raya (—). ¿Qué palabra dice?', respuestas: ['reno', 'un reno', 'renos'], pista: 'Usen la tabla de Morse del Kit del Detective. La primera letra es R.', explica: '•—• = R, • = E, —• = N, ——— = O. ¡RENO!' },
    picos:     { titulo: 'Trivia de posada', texto: 'La piñata tradicional de las posadas tiene forma de estrella. ¿Cuántos picos tiene?', respuestas: ['7', 'siete'], pista: 'Cada pico representa un pecado capital.', explica: '7 picos: uno por cada pecado capital que se «rompe» al pegarle.' },
    regalos:   { titulo: 'Regalos revueltos', texto: 'Bajo el árbol hay 14 regalos, unos rojos y otros verdes. Hay 4 rojos más que verdes. ¿Cuántos regalos ROJOS hay?', respuestas: ['9', 'nueve'], pista: 'Si quitan los 4 rojos extra quedan 10 regalos, mitad y mitad.', explica: '5 verdes y 9 rojos: 9 + 5 = 14 y 9 − 5 = 4.' },
    esponja:   { titulo: 'Adivinanza mojada', texto: 'Estoy llena de agujeros y aun así guardo el agua. ¿Qué soy?', respuestas: ['esponja', 'una esponja', 'la esponja', 'estropajo'], pista: 'Está junto al fregadero.', explica: '¡Una esponja!' },
    anteayer:  { titulo: 'El cumpleaños de Tilín', texto: 'Tilín dice: «Anteayer yo tenía 9 años, y el próximo año cumpliré 12». ¿Qué día es hoy? (Sí, es posible.)', respuestas: ['1 de enero', 'primero de enero', 'uno de enero', 'enero 1', '1 enero', '01/01', '1/1', '1 de enero de', 'el 1 de enero', 'el primero de enero'], contiene: ['1 de enero', 'primero de enero', 'uno de enero'], pista: 'Tilín cumple años el 31 de diciembre.', explica: 'Hoy es 1 de enero. Anteayer (30 dic) tenía 9; el 31 cumplió 10; este año cumple 11 y el próximo año, 12.' },
    calcetines:{ titulo: 'Calcetines en la oscuridad', texto: 'En un cajón oscuro hay 10 calcetines rojos y 10 verdes revueltos. ¿Cuántos calcetines tiene que sacar Tilín, como MÍNIMO, para asegurar que tiene un par del mismo color?', respuestas: ['3', 'tres'], pista: 'Sólo hay 2 colores…', explica: 'Con 3 calcetines, por fuerza dos son del mismo color.' },
    pera:      { titulo: 'Adivinanza de la abuela', texto: 'Blanca por dentro, verde por fuera; si quieres que te lo diga, espera.', respuestas: ['pera', 'la pera', 'una pera'], pista: 'Es una fruta… y la respuesta está escondida en la adivinanza.', explica: '¡La pera! («es-PERA»).' },
    cesar:     { titulo: 'La Rueda del Duende', tipo: 'cesar', palabra: 'CAMPANA', clave: 3, texto: 'Mensaje cifrado con la Rueda del Duende (clave 3). Para descifrar, cada letra se regresa 3 lugares en el abecedario (con Ñ).', respuestas: ['campana', 'la campana', 'campanas'], pista: 'La primera letra es C (la F regresa 3 lugares: F→E→D→C).', explica: 'Regresando cada letra 3 lugares se lee CAMPANA.' },
    posadas:   { titulo: 'Calendario mexicano', texto: 'Las posadas se celebran del 16 al 24 de diciembre (una cada noche). ¿Cuántas posadas son?', respuestas: ['9', 'nueve'], pista: 'Cuenten los dos días: el 16 y el 24.', explica: 'Del 16 al 24 son 9 noches de posada.' },
    nochebuena:{ titulo: 'La nochebuena mágica', texto: 'Una nochebuena mágica tiene 6 flores. Cada hora, el número de flores se DUPLICA. ¿Cuántas flores tendrá después de 3 horas?', respuestas: ['48', 'cuarenta y ocho'], pista: '6 → 12 → … sigan duplicando.', explica: '6 → 12 → 24 → 48.' },
    peine:     { titulo: 'Adivinanza peinada', texto: 'Tengo dientes pero no muerdo; acomodo el cabello sin tener dedos. ¿Qué soy?', respuestas: ['peine', 'un peine', 'el peine', 'cepillo', 'un cepillo'], pista: 'Está en el baño o en el tocador.', explica: '¡El peine!' },
    reloj:     { titulo: 'El reloj de Santa', texto: 'Santa sale del Polo Norte a las 23:20. Tarda 50 minutos en llegar a México y se queda 15 minutos comiendo galletas. ¿A qué hora termina sus galletas? (Escríbanlo como reloj de 24 horas, ej. 21:05)', respuestas: ['00:25', '0:25', '12:25', '0025', '24:25', '12:25 am', '00 25', '0 25'], pista: '23:20 + 50 minutos ya es el día siguiente…', explica: '23:20 + 50 min = 00:10; + 15 min = 00:25.' },
    familia:   { titulo: 'La familia de Tilín', texto: 'Tilín tiene 5 hermanos varones, y cada uno de ellos tiene UNA sola hermana. ¿Cuántos hijos tiene en total la mamá de Tilín?', respuestas: ['7', 'siete'], pista: 'La hermana es la misma para todos.', explica: 'Tilín + 5 hermanos + 1 hermana = 7.' },
    silencio:  { titulo: 'Adivinanza callada', texto: 'Si dices mi nombre, desaparezco. ¿Qué soy?', respuestas: ['silencio', 'el silencio'], pista: 'Shhhh…', explica: 'El silencio: en cuanto lo nombras, ya no hay silencio.' },
    simbolos:  { titulo: 'El Alfabeto del Duende', tipo: 'simbolos', palabra: 'TAMAL', texto: 'Tilín escribió el nombre de su comida mexicana favorita con su alfabeto secreto. Usen el Alfabeto del Duende del Kit del Detective.', respuestas: ['tamal', 'tamales', 'un tamal'], pista: 'Es una comida envuelta en hoja de maíz.', explica: '¡TAMAL!' },
    pais:      { titulo: 'Flor de Navidad', texto: 'La flor de nochebuena (cuetlaxóchitl) se regala en todo el mundo en Navidad. ¿De qué país es originaria?', respuestas: ['mexico', 'de mexico', 'méxico'], pista: '¡Muy, muy cerca de aquí!', explica: 'De México. En otros países le dicen «poinsettia».' },
    fibonacci: { titulo: 'Esferas acomodadas', texto: 'Tilín acomodó las esferas en filas así: 1, 1, 2, 3, 5, 8, 13, … ¿Cuántas esferas van en la siguiente fila?', respuestas: ['21', 'veintiuno', 'veinte y uno'], pista: 'Cada número es la suma de los dos anteriores.', explica: '8 + 13 = 21.' },
    villancico:{ titulo: 'Villancico en emojis', texto: '¿Qué villancico es este? 🌙 🤫 🕊️', respuestas: ['noche de paz', 'noche de paz noche de amor'], contiene: ['noche de paz'], pista: 'Es el villancico más famoso del mundo y se canta bajito.', explica: 'Noche (🌙) de paz (🕊️), y bajito (🤫).' },
    reyes:     { titulo: 'Cuentas de diciembre', texto: 'Multipliquen el número de Reyes Magos por el número de noches de posadas (del 16 al 24 de diciembre). ¿Cuánto da?', respuestas: ['27', 'veintisiete'], pista: 'Son 3 Reyes Magos… ¿y cuántas posadas?', explica: '3 Reyes × 9 posadas = 27.' },
    kilo:      { titulo: 'Pregunta tramposa', texto: '¿Qué pesa más: un kilo de algodón de nieve o un kilo de clavos?', respuestas: ['igual', 'lo mismo', 'ninguno', 'pesan igual', 'pesan lo mismo', 'los dos', 'ambos', 'ninguno de los dos'], contiene: ['igual', 'mismo', 'ninguno', 'ambos'], pista: 'Lean otra vez: ¿cuánto pesa cada uno?', explica: 'Pesan lo mismo: ¡un kilo!' },
    platano:   { titulo: 'Adivinanza clásica', texto: 'Oro parece, plata no es; el que no lo adivine, bien tonto es.', respuestas: ['platano', 'el platano', 'un platano', 'banana'], pista: 'La respuesta está escondida en las palabras: «plata… no es».', explica: '¡El plátano! («plata-no-es»).' },
    anagrama:  { titulo: 'Letras revueltas', tipo: 'anagrama', palabra: 'POSADA', texto: 'Tilín revolvió las letras de una tradición mexicana de diciembre. Ordénenlas:', respuestas: ['posada', 'posadas', 'la posada', 'las posadas'], pista: 'Se hace del 16 al 24 de diciembre y se pide alojamiento cantando.', explica: '¡POSADA!' },
    patas:     { titulo: 'Cuenta patas', texto: 'En el trineo de Tilín van 3 renos y 2 duendes. ¿Cuántas patas (y piernas) hay en total?', respuestas: ['16', 'dieciseis'], pista: 'Los renos tienen 4 patas y los duendes 2 piernas.', explica: '3 × 4 + 2 × 2 = 16.' },
    espejo:    { titulo: 'Escrito en el espejo', tipo: 'espejo', palabra: 'PIÑATA', texto: 'Tilín escribió esta palabra viéndose al espejo. ¿Qué dice?', respuestas: ['pinata', 'piñata', 'la pinata', 'una pinata'], pista: 'Léanla al revés, de derecha a izquierda.', explica: '¡PIÑATA!' },
    aguacate:  { titulo: 'Adivinanza de la cocina', texto: 'Agua pasa por mi casa, cate de mi corazón. ¿Qué es?', respuestas: ['aguacate', 'el aguacate', 'un aguacate'], pista: 'Junten las palabras «agua» y «cate».', explica: '¡El aguacate!' },
    edad:      { titulo: 'La edad de Tilín', texto: 'Tilín dice: «Si a mi edad le sumas 3 y el resultado lo multiplicas por 2, te da 30». ¿Cuántos años tiene Tilín?', respuestas: ['12', 'doce'], pista: 'Háganlo al revés: 30 ÷ 2 y luego…', explica: '30 ÷ 2 = 15; 15 − 3 = 12.' }
  },

  /* Qué reto toca en cada paso (1..7) para cada familia */
  retosPorFamilia: {
    rm: ['duendes', 'hoyo', 'morse', 'picos', 'regalos', 'esponja', 'anteayer'],
    rf: ['calcetines', 'pera', 'cesar', 'posadas', 'nochebuena', 'peine', 'reloj'],
    af: ['familia', 'silencio', 'simbolos', 'pais', 'fibonacci', 'villancico', 'reyes'],
    fx: ['kilo', 'platano', 'anagrama', 'patas', 'espejo', 'aguacate', 'edad']
  },

  /* ---------------- RETO EXPERTO (bono de +1 comodín) ----------------
     Se abre al encontrar la pista 3. En la familia con Descifradora lo resuelve ella.
     La familia con Agente Especial no tiene Reto Experto: su bono es que la Agente
     cumpla 4 misiones. Así cada familia tiene una oportunidad de ganar 1 comodín.  */
  pasoRetoExperto: 3,
  misionesParaBono: 4,
  retosExpertos: {
    rf: { titulo: 'Doble cifrado de Tilín', tipo: 'doble', palabra: 'NOCHEBUENA', clave: 2, texto: 'Tilín escribió una palabra con su Alfabeto secreto… ¡pero antes la cifró con la Rueda del Duende, clave 2! Primero traduzcan los símbolos y luego regresen cada letra 2 lugares en el abecedario (con Ñ).', respuestas: ['nochebuena', 'la nochebuena', 'noche buena'], pista: 'Con el Alfabeto, el primer símbolo es una O. Con la Rueda (clave 2), esa O se convierte en N.', explica: 'Los símbolos decían OQEJGDWGOC y, regresando 2 lugares cada letra, se lee NOCHEBUENA.' },
    af: { titulo: 'La clave escondida', tipo: 'cesar', palabra: 'TEJOCOTE', clave: 7, texto: 'Tilín cifró con la Rueda del Duende la fruta que nunca falta en el ponche… pero no les dice la clave. Sólo dejó esta nota: «la clave es el número de letras de la palabra NAVIDAD».', respuestas: ['tejocote', 'tejocotes', 'el tejocote'], pista: 'NAVIDAD tiene 7 letras: regresen cada letra 7 lugares.', explica: 'Con clave 7 se lee TEJOCOTE.' },
    fx: { titulo: 'Los cuatro duendes', texto: 'Tilín, Pipo, Lola y Chispa envolvieron 10 regalos entre los cuatro. Tilín envolvió el doble que Pipo, Lola envolvió uno menos que Pipo y Chispa envolvió 3. ¿Cuántos regalos envolvió Tilín?', respuestas: ['4', 'cuatro'], pista: 'Si Pipo envolvió P regalos: 2P + P + (P − 1) + 3 = 10.', explica: 'Pipo 2, Tilín 4, Lola 1 y Chispa 3.' },
    rm: { titulo: 'El cascabel en clave', tipo: 'morse', palabra: 'PONCHE', texto: 'Tilín tocó su cascabel para esconder su bebida navideña favorita. ¿Qué dice?', respuestas: ['ponche', 'el ponche'], pista: 'Usen la tabla de Morse. Empieza con P (•——•).', explica: '¡PONCHE!' }
  },

  /* ---------------- MENSAJES DE TILÍN ---------------- */
  mensajesTilin: [
    '¡Je, je, je! Así que ustedes son la familia {familia}. ¿De verdad creen que van a recuperar los regalos? Les dejé una primera pista… si es que la entienden.',
    '¡Vaya, vaya! Encontraron mi primera pista. Seguro fue suerte de principiantes.',
    '¿Otra vez ustedes? ¡Grrr! A ver si pueden con este acertijo. Si lo resuelven, les doy un número… pero sólo uno.',
    'Mi cascabel suena de puros nervios: tilín, tilín… ¡No es porque me estén alcanzando, eh!',
    'Escondí pistas falsas y regalos de mentira por toda la casa. ¿Ya cayeron en alguno? ¡Je, je!',
    'Ok, ok… son más listos de lo que pensé. Pero el siguiente acertijo es dificilísimo.',
    '¡No puede ser! ¿Cómo llegaron hasta aquí? Ya casi no me quedan escondites…',
    'Está bien… ¡me ganaron esta parte! Aquí está el último número. Pero no se emocionen: el cofre sólo se abre cuando TODAS las familias abran su candado… y la Agente Especial use la Llave Dorada.'
  ],

  /* ---------------- MISIONES DE LA AGENTE ESPECIAL ---------------- */
  misionesAgente: [
    { texto: '{agente}, eres la Agente Especial de Santa. Tu primera misión: enséñale a tu familia tu Llave Dorada y prométele a Santa que la vas a cuidar muy bien.', icono: '🔑' },
    { texto: 'Agente {agente}: busca algo de color ROJO cerca de aquí y tócalo con tu dedito. ¡Rápido!', icono: '🔴' },
    { texto: 'Agente {agente}: haz tu mejor risa de duende travieso. ¡Je, je, je!', icono: '😆' },
    { texto: 'Agente {agente}: choca la mano con cada persona de tu equipo. ¿Cuántos son?', icono: '✋' },
    { texto: 'Agente {agente}: camina de puntitas como Tilín, sin hacer ruido, hasta la siguiente pista.', icono: '🤫' },
    { texto: 'Agente {agente}: busca algo que brille, como una esfera, una luz o una estrella, y señálalo.', icono: '✨' },
    { texto: 'Agente {agente}: dale un abrazo de oso a la persona más alta de tu equipo.', icono: '🧸' },
    { texto: '¡Ya casi, Agente {agente}! Prepara tu Llave Dorada: tú vas a abrir el último candado del cofre.', icono: '🗝️' }
  ],

  /* ---------------- CASTIGOS (pistas falsas) ---------------- */
  castigos: [
    '¡Canten el coro de un villancico, todos juntos y bien fuerte!',
    'Hagan 10 sentadillas mientras dicen: «¡Tilín es el mejor duende!».',
    'Imiten a un reno: pongan las manos como cuernos y den 3 vueltas.',
    'Bailen como muñecos de nieve que se derriten durante 15 segundos.',
    'Digan sin equivocarse: «Tres tristes tigres tragaban trigo en un trigal».',
    'Hagan un trenecito con toda la familia y den una vuelta completa a la mesa.',
    'Den un abrazo de oso grupal y griten: «¡Jo, jo, jo!».',
    'Cada quien diga su comida navideña favorita… ¡con voz de duende!'
  ],

  /* ---------------- PISTAS FALSAS ----------------
     Tarjetas que se ven igual a las reales. Escóndelas CERCA de escondites reales. */
  trampasPorFamilia: 2,
  sugerenciasTrampa: [
    'En el congelador del refri (la real está en la puerta).',
    'Debajo del árbol, entre las ramas de ENFRENTE (la real está atrás).',
    'Debajo de otra maceta distinta.',
    'En el respaldo del sillón (la real está bajo un cojín).',
    'Encima de la lavadora (la real está bajo la tapa).',
    'Dentro de otro zapato que no esté en la entrada.',
    'Junto al microondas, por fuera.',
    'En cualquier lugar muy visible: ¡que piquen!'
  ],

  /* ---------------- REGALOS FALSOS ----------------
     Cajitas envueltas para regalo. Adentro va el objeto + la tarjeta con QR. */
  regalosFalsos: [
    { id: 1, titulo: '¡Carbón!', adentro: 'Un trozo de carbón de dulce (o una piedra negra)', efecto: 'congelar', segundos: 45, mensaje: '¡Por andar de curiosos, carbón! Tilín los dejó congelados 45 segundos.' },
    { id: 2, titulo: 'Comodín de Santa', adentro: 'Un chocolate o dulce', efecto: 'comodin', mensaje: '¡Este regalo es de Santa, no de Tilín! Ganan 1 comodín extra. (El chocolate es para quien lo encontró.)' },
    { id: 3, titulo: 'Calcetín apestoso', adentro: 'Un calcetín viejo (limpio, je)', efecto: 'reto', mensaje: '¡Es el calcetín de Tilín! Para quitarse lo apestoso, pónganselo en la mano como títere y que cante «Feliz Navidad».' },
    { id: 4, titulo: 'Cebolla', adentro: 'Una cebolla', efecto: 'congelar', segundos: 30, mensaje: '¿Llorando? ¡Je, je! Tilín les regaló una cebolla. 30 segundos congelados.' },
    { id: 5, titulo: 'Caja de cajas', adentro: 'Varias cajitas una dentro de otra y al final esta tarjeta', efecto: 'broma', mensaje: '¡Tanto abrir para nada! Aquí no hay nada… sólo la risa de Tilín.' },
    { id: 6, titulo: 'Galleta mordida', adentro: 'Una galleta mordida (envuelta)', efecto: 'comodin', mensaje: 'Tilín se comió media galleta y dejó la otra mitad con un regalo: ¡1 comodín extra!' },
    { id: 7, titulo: 'Llave misteriosa', adentro: 'Una llave vieja cualquiera', efecto: 'broma', mensaje: 'Esta llave no abre nada… ¿o sí? (No. ¡Je, je, je!)' },
    { id: 8, titulo: 'Moneda dorada', adentro: 'Monedas de chocolate', efecto: 'comodin', mensaje: '¡Monedas de oro de Santa! Ganan 1 comodín extra.' }
  ]
};

/* ---------------- CUENTO ILUSTRADO (app + imprimible) ---------------- */
window.CUENTO = [
  { img: '01-polo', texto: 'Muy, muy lejos, en el Polo Norte, donde la nieve nunca se derrite, está el taller de Santa Claus. Ahí, cientos de duendes trabajan todo el año fabricando juguetes, envolviendo regalos y preparando la Navidad.' },
  { img: '02-tilin', texto: 'Entre todos ellos había uno muy especial: Tilín. Era chiquito, tenía orejas puntiagudas y un gorro verde con un cascabel en la punta que sonaba «tilín, tilín» cada vez que daba un paso. Por eso todos lo llamaban así.' },
  { img: '03-bromas', texto: 'A Tilín le encantaban las bromas. Le pintaba bigotes a los osos de peluche, escondía los moños de los regalos y una vez… ¡cambió el azúcar de las galletas por sal! Los demás duendes no se reían tanto como él.' },
  { img: '04-santa', texto: 'Un día, Santa se cansó: —¡Tilín! Esta Navidad te quedas castigado en el taller.\nTilín se puso rojo como una nochebuena y, echando humo por las orejas, gritó: —¿Castigado? ¡Ya verán! Si yo no tengo Navidad… ¡nadie la tendrá!' },
  { img: '05-vuelo', texto: 'Esa misma noche, Tilín se subió a un trineo viejito y voló sobre montañas y pueblos hasta llegar a México, a la casa donde las familias Reyes Ramírez, Reyes Flores y Alvarado Flores se reúnen cada año para celebrar la Navidad.' },
  { img: '06-robo', texto: 'Para que nadie lo escuchara, le metió un algodón a su cascabel y entró de puntitas. Uno por uno, metió todos los regalos en su costal… ¡y hasta se comió las galletas que estaban en la mesa!' },
  { img: '07-cofre', texto: 'Luego guardó los regalos en su Cofre Encantado y le puso un candado por cada familia. Sólo quien descubra los números secretos podrá abrirlos.' },
  { img: '08-pistas', texto: 'Pero Tilín es muy presumido y no aguantó las ganas de retar a las familias: escondió pistas secretas por toda la casa… y también pistas falsas y regalos de mentira para engañarlos. —¡Je, je, je! ¡A ver si pueden!' },
  { img: '09-agente', texto: 'Lo que Tilín no sabía es que Santa ya había nombrado a una Agente Especial para proteger la Navidad en esta casa: ¡Ana Sofía! Ella guarda la Llave Dorada, la única que puede abrir el último candado del cofre.' },
  { img: '10-gaby', texto: 'Y como a Tilín le encantan los mensajes secretos, Santa también nombró a una Descifradora Oficial: ¡Gaby! No hay código, cifrado ni acertijo que se le resista. Tilín le dejó un Reto Experto… a ver si puede con él.' },
  { img: '11-mision', texto: 'Ahora todo depende de ustedes, familias. Abran su sobre de misión, escaneen los códigos, resuelvan los acertijos del duende y no caigan en sus trampas. ¡Recuperen la Navidad!' }
];

/* ---------------- GUION DEL VIDEO (para narrarlo en vivo) ---------------- */
window.GUION = [
  { voz: 'Narradora', texto: 'Muy, muy lejos, en el Polo Norte, está el taller de Santa Claus, donde cientos de duendes trabajan todo el año preparando la Navidad. Todos los duendes eran muy trabajadores… bueno, todos menos uno.' },
  { voz: 'Narradora', texto: 'Él es Tilín: un duende chiquito, con orejas puntiagudas y un gorro verde con un cascabel que suena «tilín, tilín» cada vez que da un paso.' },
  { voz: 'Narradora', texto: 'A Tilín le encantaban las bromas. Le pintaba bigotes a los muñecos, escondía los moños de los regalos… ¡y una vez cambió el azúcar de las galletas por sal!' },
  { voz: 'Santa', texto: '¡Tilín! Esta Navidad te quedas castigado en el taller.' },
  { voz: 'Narradora', texto: 'Tilín se puso rojo como una nochebuena.' },
  { voz: 'Tilín', texto: '¿Castigado? ¡Ya verán! Si yo no tengo Navidad… ¡nadie la tendrá!' },
  { voz: 'Narradora', texto: 'Esa misma noche, Tilín se subió a un trineo viejito y voló, y voló, hasta México… hasta la casa donde las familias Reyes Ramírez, Reyes Flores y Alvarado Flores se reúnen para celebrar la Navidad.' },
  { voz: 'Narradora', texto: 'Para que nadie lo escuchara, le metió un algodón a su cascabel… y entró de puntitas. Uno por uno, metió todos los regalos en su costal. ¡Y hasta se comió las galletas!' },
  { voz: 'Narradora', texto: 'Después, encerró los regalos en su Cofre Encantado y le puso un candado por cada familia, para que nadie lo pudiera abrir.' },
  { voz: 'Narradora', texto: 'Pero Tilín es tan presumido, que no se aguantó las ganas de retarlos: escondió pistas secretas por toda la casa… y también pistas falsas y regalos de mentira, para engañarlos.' },
  { voz: 'Tilín', texto: '¡Je, je, je! ¿Se creen muy listos? Encuentren mis pistas, resuelvan mis acertijos y consigan los números de sus candados… ¡si es que pueden!' },
  { voz: 'Narradora', texto: 'Pero Tilín no sabía algo muy importante. Santa ya había nombrado a una Agente Especial para proteger la Navidad en esta casa: ¡Ana Sofía! Ella guarda la Llave Dorada: la única que puede abrir el último candado del cofre.' },
  { voz: 'Narradora', texto: 'Y como a Tilín le encantan los mensajes secretos, Santa también nombró a una Descifradora Oficial: ¡Gaby! No hay código, cifrado ni acertijo que se le resista.' },
  { voz: 'Narradora', texto: 'Familias: la misión comienza ahora. Abran su sobre de misión, escaneen el código con la app… y no se dejen engañar por el duende. ¡Recuperen la Navidad!' },
  { voz: 'Final · Narradora', texto: '¡Lo lograron! Con la ayuda de Gaby, la Descifradora Oficial, ningún código de Tilín quedó sin resolver. Todas las familias abrieron sus candados, y la Agente Especial Ana Sofía abrió el último con la Llave Dorada.' },
  { voz: 'Final · Tilín', texto: 'Está bien, está bien… me ganaron. ¿Saben por qué me robé los regalos? Porque yo nunca había pasado una Navidad en familia.' },
  { voz: 'Final · Narradora', texto: 'Las familias, en lugar de enojarse, invitaron a Tilín a quedarse a la cena de Navidad.' },
  { voz: 'Final · Tilín', texto: '¿De verdad? ¡Gracias! Prometo portarme bien… bueno, casi siempre. ¡Je, je!' },
  { voz: 'Final · Narradora', texto: 'Y así, el duende más travieso del Polo Norte aprendió que el mejor regalo de la Navidad es estar juntos. ¡Feliz Navidad, familias!' }
];

/* ---------------- PLAN DE PRUEBA (modo prueba del organizador) ---------------- */
window.PRUEBA_LISTA = [
  { rol: '🔑 Organizador', pasos: [
    'Abrir la app en tu celular y en una computadora.',
    'Entrar al Panel del organizador con el PIN.',
    'Revisar nombres de las familias, códigos de los candados, Agente y Descifradora.',
    'Revisar que los 7 escondites existen en la casa (si no, cambiarlos en el panel).',
    'Programar cada candado real con su código y probar que abre.',
    'Ver el video de la historia completo, con sonido, en la tele que se va a usar.',
    'Escuchar los audios de Santa para Ana Sofía y para Gaby.',
    'Imprimir una hoja de prueba (tamaño carta, escala 100%) y revisar que se lea bien.'
  ] },
  { rol: '👪 Cada familia (repetir con todas)', pasos: [
    'Entrar con «Probar como familia…» y leer la bienvenida de Tilín.',
    'Pasar las 7 pistas con «Simular → tarjeta correcta» y resolver los 7 retos.',
    'Probar una respuesta equivocada y usar un comodín.',
    'Confirmar que salen los 4 números y que son los del candado real.',
    'Simular una tarjeta adelantada, una ya usada y una de otra familia.',
    'Simular una pista falsa (60 segundos congelados) y un regalo sorpresa.',
    'Al terminar, tocar «Ya abrimos nuestro candado».'
  ] },
  { rol: '⭐ Agente Ana Sofía (Reyes Ramírez)', pasos: [
    'Ver y escuchar sus misiones (botón 🔊 Escuchar).',
    'Cumplir 4 misiones: aparece el bono de +1 comodín.',
    'Simular la carta de Santa de Ana Sofía: se escucha el audio.',
    'La Llave Dorada abre el candado de llave del cofre.'
  ] },
  { rol: '🔐 Descifradora Gaby (Reyes Flores)', pasos: [
    'Al iniciar aparece la presentación de Descifradora Oficial.',
    'Después de la pista 3 se abre su Reto Experto; al resolverlo ganan +1 comodín.',
    'Simular la carta de Santa de Gaby: se escucha el audio.'
  ] },
  { rol: '🎬 Final', pasos: [
    'Simular el QR final del cofre: se ve el video final y el resumen de la familia.'
  ] },
  { rol: '📱 Celulares reales con tarjetas impresas', pasos: [
    'iPhone: escanear un Sobre de Misión con la cámara normal → abre la app.',
    'iPhone: botón «Escanear tarjeta» → la cámara lee una tarjeta impresa.',
    'Android: lo mismo (sobre con la cámara y tarjeta con el botón).',
    'Escribir a mano el código de 4 letras de una tarjeta.',
    'Cerrar el navegador y volver a abrir: el avance sigue ahí.',
    'Al terminar, borrar la partida de cada celular (Panel → Borrar partida).'
  ] }
];
