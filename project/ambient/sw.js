const CACHE_NAME = 'qpi-ambient 1.13';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './logo.ico'
];

self.addEventListener('install', (e) => {
  // 새 서비스 워커가 설치되면 대기하지 않고 즉시 활성화
  self.skipWaiting(); 
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', (e) => {
  // 활성화 단계에서 이전 버전의 낡은 캐시를 자동으로 삭제
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});
