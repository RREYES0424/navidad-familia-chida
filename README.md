# 🎄 El Gran Robo de Navidad

Búsqueda del tesoro navideña para las familias **Reyes Martínez**, **Reyes Flores** y **Alvarado Flores** (y una 4ª familia que se puede activar).

El duende **Tilín**, el más travieso del taller de Santa, se robó los regalos y los encerró en su **Cofre Encantado** con un candado por familia. Cada familia sigue su ruta de pistas con códigos QR, resuelve los acertijos del duende y gana los números de su candado. La **Agente Especial Ana Sofía** guarda la **Llave Dorada**, la única que abre el último candado.

## Qué incluye

| | |
|---|---|
| 📱 **App web** (`docs/`) | Funciona en iPhone y Android desde el navegador: historia, escáner de QR, retos, comodines, trampas, regalos sorpresa, kit del detective, misiones con audio para Ana Sofía, video final y panel del organizador. |
| 🎬 **Videos** (`docs/media/`) | `intro.mp4` (2:15, el robo) y `final.mp4` (0:42, el desenlace). Animación, música y voces originales, con subtítulos. |
| 🖨️ **Imprimibles** (`imprimibles/`) | Guía del organizador, hoja de respuestas, sobres de misión + kit del detective, tarjetas de pistas, pistas falsas, regalos falsos, cartel del cofre + etiquetas + QR final, carta de Santa y credencial de Ana Sofía, diplomas y cuento ilustrado. Todo en tamaño carta. |

## Cómo publicar la app (una sola vez)

1. En GitHub abre el repositorio → **Settings** → **Pages**.
2. En **Build and deployment** elige **Source: Deploy from a branch**.
3. Elige la rama donde está este código y la carpeta **`/docs`** → **Save**.
4. En 1–2 minutos la app queda en **https://rreyes0424.github.io/navidad-familia-chida/**

> Los QR de los PDF ya apuntan a esa dirección. Si publicas la app en otro lugar, entra al panel del organizador, escribe la nueva dirección y vuelve a imprimir desde la app.

## Cómo se juega (resumen)

1. Todos ven el video de la historia en la tele.
2. Ana Sofía recibe la carta de Santa y la Llave Dorada.
3. Cada familia abre su **Sobre de Misión** y escanea su QR con el celular → la app les da la primera pista.
4. Pista → van al escondite → escanean la tarjeta de su color → resuelven el reto → (a veces) ganan un número del candado → siguiente pista. Son 7 pistas y 4 números.
5. Con el código completo abren su candado del cofre. Cuando todos los candados están abiertos, Ana Sofía abre el último, y dentro del cofre hay un QR que muestra el final.

Todos los detalles (lista de compras, qué hacer antes, cómo esconder todo, orden del evento, reglas y qué hacer si algo falla) están en **`imprimibles/01-guia-del-organizador.pdf`**.

## Panel del organizador

En la app: **🔑 Organizador** (PIN **4826**). Ahí puedes:

- Activar la 4ª familia, cambiar nombres, el código de cada candado y quién es la Agente Especial.
- Cambiar los 7 escondites (hay 18 en el catálogo: árbol, refri, maceta, lavadora, tendedero, asador, nacimiento…).
- Volver a imprimir todo con tus cambios.
- Rescatar una partida si a una familia se le borró el avance.

Para cambiar los textos, acertijos o retos, edita `docs/js/data.js`.

## Para desarrolladores

- La app es HTML/CSS/JS sin dependencias de compilación. Para probarla: `cd docs && python3 -m http.server 8765`.
- Regenerar los PDF: con el servidor anterior corriendo, `node tools/generar_pdfs.js` (necesita Playwright).
- Regenerar los videos: `tools/video/hacer_videos.sh` (necesita Python con `kokoro-onnx`, `soundfile` y `numpy`, los modelos de voz de Kokoro, Node + Playwright y ffmpeg). El guion está en `tools/video/guion.py`, las escenas en `tools/video/escenas.html` y la música y los efectos se generan en `tools/video/mezcla.py`.

Créditos: tipografías Nunito y Mountains of Christmas (SIL Open Font License), lectores de QR [jsQR](https://github.com/cozmo/jsQR) (Apache 2.0) y [qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator) (MIT), voces generadas con Kokoro TTS.
