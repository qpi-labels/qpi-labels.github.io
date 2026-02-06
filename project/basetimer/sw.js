const CACHE_NAME = '기준타 1.0.6';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.ico',
  './crickets.mp3',
  './creepy_tomb.mp3',
  './so_ambient.mp3',
  './tinicolor.js'
];

self.addEventListener('install', (e) => {
  // 새 서비스 워커가 설치되면 대기하지 않고 즉시 활성화
  self.skipWaiting(); 
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
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

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').then((reg) => {
    
    // 서비스 워커가 업데이트되었는지 감지
    reg.addEventListener('updatefound', () => {
      const newWorker = reg.installing;

      newWorker.addEventListener('statechange', () => {
        // 새 서비스 워커가 설치(installed)되었고, 제어 중인 서비스 워커가 있을 때 (기존 사용자)
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          showUpdatePopup();
        }
      });
    });
  });
}

// 업데이트 팝업 UI 띄우기
function showUpdatePopup() {
  // 간단한 confirm 창 사용 (디자인에 맞춰 커스텀 가능)
  const userConfirmed = confirm("새로운 버전이 업데이트되었습니다. 지금 새로고침하여 적용할까요?");
  
  if (userConfirmed) {
    window.location.reload(); // 새로고침하면 새 캐시가 적용됩니다.
  }
}
