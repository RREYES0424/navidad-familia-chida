/* Service worker: primero red, si no hay internet usa la copia guardada.
   Los videos no pasan por aquí (Safari necesita pedirlos por partes). */
const CACHE = 'robo-navidad-v1';
const BASICOS = ['./', 'index.html', 'css/app.css', 'js/data.js', 'js/personajes.js', 'js/app.js', 'js/imprimir.js',
  'js/vendor/qrcode.js', 'js/vendor/jsQR.js', 'fonts/nunito-latin-800-normal.woff2', 'fonts/nunito-latin-900-normal.woff2',
  'fonts/nunito-latin-400-normal.woff2', 'fonts/nunito-latin-700-normal.woff2', 'fonts/mountains-of-christmas-latin-700-normal.woff2',
  'img/icono-192.png', 'media/audio/tilin-trampa.mp3', 'media/audio/tilin-pista.mp3', 'media/audio/tilin-mal.mp3'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(BASICOS)).catch(() => {})); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin || /\.mp4$/.test(url.pathname) || e.request.headers.has('range')) return;
  e.respondWith(fetch(e.request).then(r => { if (r.ok) { const copia = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copia)); } return r; })
    .catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match('index.html'))));
});
