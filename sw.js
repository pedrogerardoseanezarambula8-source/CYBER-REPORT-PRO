// Nombre del caché - Actualizado a v2 para forzar la actualización en el dispositivo
const CACHE_NAME = 'cyberreport-v2';

// Lista de archivos necesarios para que la app abra sin internet
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-512.png', // Tu nueva imagen local
  'https://cdn.jsdelivr.net/npm/localforage@1.10.0/dist/localforage.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
];

// Evento de Instalación: Guarda todo en la memoria del teléfono
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Cacheando archivos de CyberReport Pro...');
      return cache.addAll(ASSETS);
    })
  );
  // Fuerza al SW a activarse inmediatamente
  self.skipWaiting();
});

// Evento de Activación: Limpia versiones viejas del caché si existen
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Evento Fetch: El "Modo Offline". Sirve los archivos desde el caché si no hay red.
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      // Si está en caché, lo devuelve. Si no, lo busca en internet.
      return response || fetch(e.request);
    })
  );
});
