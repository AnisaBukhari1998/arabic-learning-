/* ==========================================================================
   Service worker — makes the whole app work with no connection.
   Cache-first over a fixed precache list: every asset is local, so there is
   nothing to revalidate and no runtime fetching to fall back on.
   CACHE_VERSION is rewritten by build.js from a content hash, so a new deploy
   replaces the old cache instead of serving stale files forever.
   ========================================================================== */

const CACHE_VERSION = 'dev';
const CACHE = 'arabic-library-' + CACHE_VERSION;

const PRECACHE = [
  './',
  'index.html',
  'manifest.webmanifest',
  'assets/css/app.css',
  'assets/js/data.js',
  'assets/js/store.js',
  'assets/js/decks.js',
  'assets/js/habit.js',
  'assets/js/study.js',
  'assets/js/app.js',
  'assets/icons/icon.svg',
  'assets/icons/icon-maskable.svg',
  'assets/fonts/amiri-ar-400.woff2',
  'assets/fonts/amiri-ar-700.woff2',
  'assets/fonts/fraunces-lat.woff2',
  'assets/fonts/fraunces-latext.woff2',
  'assets/fonts/karla-lat.woff2',
  'assets/fonts/karla-latext.woff2'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE)
      // addAll is atomic — one 404 would leave the app half-cached, so add
      // individually and let a missing optional file pass.
      .then(function (cache) {
        return Promise.all(PRECACHE.map(function (url) {
          return cache.add(new Request(url, { cache: 'reload' })).catch(function () {});
        }));
      })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(keys.map(function (k) {
          return k !== CACHE && k.indexOf('arabic-library-') === 0 ? caches.delete(k) : null;
        }));
      })
      .then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== location.origin) return;   // external links are never cached

  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then(function (hit) {
      if (hit) return hit;
      return fetch(req)
        .then(function (res) {
          if (res && res.ok && res.type === 'basic') {
            const copy = res.clone();
            caches.open(CACHE).then(function (c) { c.put(req, copy); });
          }
          return res;
        })
        .catch(function () {
          // Offline and not cached: navigations still get the app shell.
          if (req.mode === 'navigate') return caches.match('index.html');
          return new Response('', { status: 504, statusText: 'Offline' });
        });
    })
  );
});
