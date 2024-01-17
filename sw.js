// Deklarasi variabel
const cacheName = "my-pwa-cache";
const appShellFiles = [
  "/manifest.json",
  "/assets/style.min.css",
  "/assets/script.min.js",
  "/fontawesome/css/all.min.css",
  "/assets/favicon.ico",
  "/assets/image.png",
];

// Event install
self.addEventListener("install", (event) => {
  console.log("[Service Worker] Install");

  // Tunda service worker sampai proses caching selesai
  event.waitUntil(async () => {
    // Buat cache baru
    const cache = await caches.open(cacheName);

    // Cache semua file yang dibutuhkan untuk offline
    for (const file of appShellFiles) {
      const response = await fetch(file);
      await cache.add(file, response);
    }

    // Cache Font Awesome
    const fontawesomeUrl = "https://kit.fontawesome.com/28a0cf18f1.js";
    const fontawesomeResponse = await fetch(fontawesomeUrl);
    await cache.add(fontawesomeUrl, fontawesomeResponse);
  });
});

// Event activate
self.addEventListener("activate", async (event) => {
  console.log("[Service Worker] Activate");

  // Hapus cache lama
  for (const entry of await caches.keys()) {
    if (entry !== cacheName) {
      await caches.delete(entry);
    }
  }
});

// Event fetch
self.addEventListener("fetch", (event) => {
  console.log("[Service Worker] Fetch");

  // Jika permintaan gagal, coba cache
  if (event.request.status >= 400) {
    event.respondWith(caches.match(event.request));
  }
});
