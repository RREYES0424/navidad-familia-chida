# -*- coding: utf-8 -*-
"""
Guion de los videos (intro y final) + clips de audio de la app.

Voces (Kokoro TTS, español latino):
  N = narradora (ef_dora)   T = Tilín (em_alex con tono agudo)   S = Santa (em_santa, tono grave)
"""

INTRO = [
    # (escena, segundos_antes, [(voz, texto)], segundos_despues, duracion_minima)
    ("titulo", 0.5, [], 0.0, 6.5),
    ("polo", 0.8, [
        ("N", "Muy, muy lejos, en el Polo Norte, está el taller de Santa Claus, donde cientos de duendes trabajan todo el año preparando la Navidad."),
        ("N", "Todos los duendes eran muy trabajadores… bueno, todos menos uno."),
    ], 0.6, 0),
    ("tilin", 0.6, [
        ("N", "Él es Tilín: un duende chiquito, con orejas puntiagudas y un gorro verde con un cascabel que suena «tilín, tilín» cada vez que da un paso."),
    ], 0.8, 0),
    ("bromas", 0.3, [
        ("N", "A Tilín le encantaban las bromas. Le pintaba bigotes a los muñecos, escondía los moños de los regalos… ¡y una vez cambió el azúcar de las galletas por sal!"),
    ], 1.0, 0),
    ("santa", 0.5, [
        ("S", "¡Tilín! Esta Navidad te quedas castigado en el taller."),
        ("N", "Tilín se puso rojo como una nochebuena."),
        ("T", "¿Castigado? ¡Ya verán! Si yo no tengo Navidad… ¡nadie la tendrá!"),
    ], 0.9, 0),
    ("vuelo", 0.8, [
        ("N", "Esa misma noche, Tilín se subió a un trineo viejito y voló, y voló, hasta México…"),
        ("N", "…hasta la casa donde las familias Reyes Ramírez, Reyes Flores y Alvarado Flores se reúnen para celebrar la Navidad."),
    ], 0.8, 0),
    ("robo", 0.6, [
        ("N", "Para que nadie lo escuchara, le metió un algodón a su cascabel… y entró de puntitas."),
        ("N", "Uno por uno, metió todos los regalos en su costal. ¡Y hasta se comió las galletas!"),
    ], 1.0, 0),
    ("cofre", 0.5, [
        ("N", "Después, encerró los regalos en su Cofre Encantado y le puso un candado por cada familia, para que nadie lo pudiera abrir."),
    ], 1.6, 0),
    ("pistas", 0.4, [
        ("N", "Pero Tilín es tan presumido, que no se aguantó las ganas de retarlos: escondió pistas secretas por toda la casa… y también pistas falsas y regalos de mentira, para engañarlos."),
    ], 1.0, 0),
    ("reto", 0.3, [
        ("T", "¡Je, je, je! ¿Se creen muy listos? Encuentren mis pistas, resuelvan mis acertijos y consigan los números de sus candados… ¡si es que pueden!"),
    ], 1.0, 0),
    ("agente", 0.6, [
        ("N", "Pero Tilín no sabía algo muy importante. Santa ya había nombrado a una Agente Especial para proteger la Navidad en esta casa: ¡Ana Sofía!"),
        ("N", "Ella guarda la Llave Dorada: la única que puede abrir el último candado del cofre."),
    ], 1.0, 0),
    ("gaby", 0.5, [
        ("N", "Y como a Tilín le encantan los mensajes secretos, Santa también nombró a una Descifradora Oficial: ¡Gaby! No hay código, cifrado ni acertijo que se le resista."),
    ], 1.4, 0),
    ("mision", 0.4, [
        ("N", "Familias: la misión comienza ahora. Abran su sobre de misión, escaneen el código con la app… y no se dejen engañar por el duende."),
        ("N", "¡Recuperen la Navidad!"),
    ], 4.0, 0),
]

FINAL = [
    ("abierto", 1.5, [
        ("N", "¡Lo lograron! Con la ayuda de Gaby, la Descifradora Oficial, ningún código de Tilín quedó sin resolver. Todas las familias abrieron sus candados, y la Agente Especial Ana Sofía abrió el último con la Llave Dorada."),
    ], 1.0, 0),
    ("triste", 0.5, [
        ("T", "Está bien, está bien… me ganaron. ¿Saben por qué me robé los regalos? Porque yo nunca había pasado una Navidad en familia."),
    ], 0.8, 0),
    ("cena", 0.5, [
        ("N", "Las familias, en lugar de enojarse, invitaron a Tilín a quedarse a la cena de Navidad."),
        ("T", "¿De verdad? ¡Gracias! Prometo portarme bien… bueno, casi siempre. ¡Je, je!"),
    ], 1.0, 0),
    ("fin", 0.5, [
        ("N", "Y así, el duende más travieso del Polo Norte aprendió que el mejor regalo de la Navidad es estar juntos."),
        ("N", "¡Feliz Navidad, familias!"),
    ], 4.5, 0),
]

# Clips cortos que usa la app (se guardan en docs/media/audio/<nombre>.mp3)
CLIPS = {
    "santa-carta": ("S", "Querida Ana Sofía: soy Santa Claus, y te escribo desde el Polo Norte porque tengo un problema muy grande. "
                         "El duende Tilín se escapó del taller y se llevó los regalos de tu casa. Necesito tu ayuda. "
                         "Por eso, te nombro Agente Especial de Santa. Te mando la Llave Dorada: es mágica, y es la única que puede abrir el último candado del cofre de Tilín. "
                         "Cuídala mucho y no se la des a nadie, ni siquiera a Tilín si te la pide. "
                         "Ayuda a tu familia a encontrar las pistas, y cuando todos los candados estén abiertos, tú abrirás el último. "
                         "¡Confío en ti! Con mucho cariño, Santa Claus. ¡Jo, jo, jo!"),
    "santa-carta-gaby": ("S", "Querida Gaby: soy Santa Claus. El duende Tilín se robó los regalos de tu casa y, como le encantan los mensajes secretos, dejó acertijos y códigos por todas partes. "
                              "Necesito a alguien muy lista para descifrarlos. Por eso, te nombro Descifradora Oficial de Santa. "
                              "Tu misión: ayudar a tu familia con los códigos más difíciles, y resolver el Reto Experto que Tilín escondió sólo para ti. "
                              "¡Confío en tu cerebro! Con cariño, Santa Claus. ¡Jo, jo, jo!"),
    "tilin-trampa": ("T", "¡Je, je, je! ¡Cayeron en mi trampa!"),
    "tilin-pista": ("T", "¡Grrr! ¡Encontraron mi pista!"),
    "tilin-mal": ("T", "¡Ja! ¡Esa respuesta está mal!"),
    "tilin-regalo": ("T", "¡Je, je! ¡Ese regalo no es lo que parece!"),
    "tilin-final": ("T", "¡Noooo! ¡Tienen el código completo!"),
    "mision-0": ("N", "Ana Sofía, eres la Agente Especial de Santa. Tu primera misión: enséñale a tu familia tu Llave Dorada, y prométele a Santa que la vas a cuidar muy bien."),
    "mision-1": ("N", "Agente Ana Sofía: busca algo de color rojo cerca de aquí, y tócalo con tu dedito. ¡Rápido!"),
    "mision-2": ("N", "Agente Ana Sofía: haz tu mejor risa de duende travieso. ¡Je, je, je!"),
    "mision-3": ("N", "Agente Ana Sofía: choca la mano con cada persona de tu equipo. ¿Cuántos son?"),
    "mision-4": ("N", "Agente Ana Sofía: camina de puntitas como Tilín, sin hacer ruido, hasta la siguiente pista."),
    "mision-5": ("N", "Agente Ana Sofía: busca algo que brille, como una esfera, una luz o una estrella, y señálalo."),
    "mision-6": ("N", "Agente Ana Sofía: dale un abrazo de oso a la persona más alta de tu equipo."),
    "mision-7": ("N", "¡Ya casi, Agente Ana Sofía! Prepara tu Llave Dorada: tú vas a abrir el último candado del cofre."),
}
