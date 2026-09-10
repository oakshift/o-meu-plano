// Service worker: guarda a app para funcionar sem internet.
// Sempre que se publica uma versão nova, sobe-se o número da VERSAO.
const VERSAO = "v2";
const CACHE = `plano-${VERSAO}`;

const FICHEIROS = [
  "./", "./index.html", "./manifest.json",
  "./css/style.css",
  "./js/app.js", "./js/casa.js", "./js/store.js", "./js/ui.js", "./js/audio.js",
  "./js/leitura.js", "./js/matematica.js", "./js/silabas.js",
  "./js/tempo.js", "./js/progresso.js", "./js/pais.js",
  "./data/textos.js", "./data/matematica.js", "./data/palavras.js", "./data/aaz.js",
  "./icons/icon-192.png", "./icons/icon-512.png",
  "./icons/icon-180.png", "./icons/icon-512-maskable.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FICHEIROS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(nomes => Promise.all(nomes.filter(n => n !== CACHE).map(n => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return; // histórias AaZ e afins vão à rede
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(resp => {
      const copia = resp.clone();
      caches.open(CACHE).then(c => c.put(e.request, copia)).catch(() => {});
      return resp;
    }).catch(() => caches.match("./index.html")))
  );
});
