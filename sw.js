const CACHE_NAME = 'smart-reminder-v1';
const assets = [
  './',
  './index.html',
  './manifest.json',
  './logo.jpg' // Tambahan agar logo kamu terbaca oleh sistem PWA
];

// Tahap Install: Menyimpan file ke dalam cache (memori browser)
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Caching assets...');
      return cache.addAll(assets);
    })
  );
});

// Tahap Aktivasi: Menghapus cache lama jika ada update
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

// Tahap Fetch: Mengambil data dari cache supaya bisa dibuka tanpa internet
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
