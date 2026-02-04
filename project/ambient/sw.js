// sw.js
const CACHE_NAME = 'qpi ambient 6 1.21'; // 버전 변경 시 숫자를 올려주세요
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './logo.ico',
  './so_ambient.mp3',
  './crickets.mp3',
  './creepy_tomb.mp3',
  './apple-icon.png'
];

// 1. 서비스 워커 설치 및 리소스 캐싱
self.addEventListener('install', (e) => {
  self.skipWaiting(); 
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// 2. 오래된 캐시 삭제
self.addEventListener('activate', (e) => {
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

// 3. 오프라인 지원 (캐시 우선 전략)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});

/* ----------------------------------------------------
   4. 갤럭시 Now Bar / 라이브 알림 핵심 로직
   ---------------------------------------------------- */
self.addEventListener('message', (event) => {
    // index.html에서 보낸 메시지 타입 확인
    if (event.data.type === 'UPDATE_LIVE_NOTIFY' || event.data.type === 'UPDATE_NOW_BAR') {
        const { sunrise, sunset, current } = event.data.payload;
        showLiveNotification(sunrise, sunset, current);
    }
});

function showLiveNotification(sunrise, sunset, current) {
    let title = "QPI Ambient";
    let body = "";
    let progress = 0;

    // 일몰까지 남은 시간 및 진행률 계산
    if (current < sunrise) {
        body = `일출 대기 중 (약 ${Math.round(sunrise - current)}분 남음)`;
        progress = 0;
    } else if (current < sunset) {
        const total = sunset - sunrise;
        const elapsed = current - sunrise;
        progress = Math.round((elapsed / total) * 100);
        body = `일몰까지 ${Math.round(sunset - current)}분 (${progress}%)`;
    } else {
        body = "오늘의 일몰이 완료되었습니다.";
        progress = 100;
    }

    // 알림창에 진행바를 포함한 라이브 노티피케이션 전송
    self.registration.showNotification(title, {
        body: body,
        tag: 'qpi-live-status', // 중요: 이 태그가 같아야 알림이 하나로 고정됨
        icon: 'apple-icon.png',
        badge: 'apple-icon.png',
        ongoing: true,          // 사용자가 지울 수 없게 설정 (Now Bar 필수 조건)
        silent: true,           // 업데이트 시 소리/진동 방지
        data: {
            progress: progress  // 안드로이드 시스템 진행바 값
        }
    });
}
