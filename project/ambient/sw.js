const CACHE_NAME = 'qpi-ambient-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

// 설치 시 리소스 캐싱
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// 오프라인 지원: 캐시 우선 전략
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});
