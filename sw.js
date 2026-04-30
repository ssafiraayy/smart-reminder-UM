const CACHE_NAME = 'smart-reminder-v1';
const assets = [
  './',
  './index.html',
  './manifest.json',
  './logo.jpg'
];

// Tahap Install: Menyimpan file ke cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Caching assets...');
      return cache.addAll(assets);
    })
  );
});

// Tahap Aktivasi: Hapus cache lama
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

// Tahap Fetch: Supaya aplikasi bisa dibuka offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

// --- TAMBAHAN KHUSUS HP: KLIK NOTIFIKASI LANGSUNG BUKA APLIKASI ---
self.addEventListener('notificationclick', function(event) {
    event.notification.close(); // Tutup notifnya setelah diklik
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
            // Kalau aplikasi sudah terbuka, fokuskan ke sana
            for (let i = 0; i < clientList.length; i++) {
                let client = clientList[i];
                if (client.url === '/' && 'focus' in client) {
                    return client.focus();
                }
            }
            // Kalau belum terbuka, buka jendela baru
            if (clients.openWindow) {
                return clients.openWindow('./index.html');
            }
        })
    );
});
