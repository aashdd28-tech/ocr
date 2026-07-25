const CACHE = "ocr-v5";
const FILES = ["/manifest.json", "/icon-192.svg", "/icon-512.svg"];

self.addEventListener("install", function(e) {
  e.waitUntil(caches.open(CACHE).then(function(c) { return c.addAll(FILES); }));
  self.skipWaiting();
});

self.addEventListener("activate", function(e) {
  e.waitUntil(
    caches.keys().then(function(k) {
      return Promise.all(k.filter(function(n) { return n !== CACHE; }).map(function(n) { return caches.delete(n); }));
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", function(e) {
  e.respondWith(
    fetch(e.request).then(function(r) { return r; }).catch(function() { return caches.match(e.request); })
  );
});
