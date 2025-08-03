const CACHE_NAME = 'xrpman-player-v3';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/manifest.json',
  'https://unpkg.com/xrpl@2.15.0/dist/npm/xrpl.js',
  '/assets/sw.js',
  '/assets/js/auth.js',
  '/assets/js/state-manager.js',
  '/assets/js/player.js',
  '/assets/js/visualizer.js',
  '/assets/js/ios-audio.js',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
});

self.addEventListener('fetch', event => {
  event.respondWith(caches.match(event.request).then(response => response || fetch(event.request)));
});