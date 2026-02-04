const CACHE_NAME = 'qpi-ambient-v1.20'; // 버전업 시 숫자를 바꿔주세요.
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './logo.ico',
  './so_ambient.mp3',
  './crickets.mp3',
  './creepy_tomb.mp3',
  './apple-icon.png' // 알림 아이콘 캐싱 추가
];

// 1. 설치 단계: 즉시 활성화 및 자산 캐싱
self.addEventListener('install', (e) => {
  self.skipWaiting(); 
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// 2. 활성화 단계: 오래된 캐시 정리
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

// 3. 네트워크 요청 처리 (캐시 우선 전략)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});

// 4. 메시지 수신: Now Bar 및 라이브 알림 업데이트
self.addEventListener('message', (event) => {
    if (event.data.type === 'UPDATE_LIVE_NOTIFY') {
        const { sunrise, sunset, current } = event.data.payload;
        updateLiveNotification(sunrise, sunset, current);
    }
});

// 5. 실시간 라이브 알림(진행바 포함) 함수
function updateLiveNotification(sunrise, sunset, current) {
    let title = "QPI Ambient";
    let body = "";
    let progress = 0;

    // 일몰까지 남은 시간 및 진행률 계산
    if (current < sunrise) {
        body = `일출 대기 중 (일출까지 ${Math.round(sunrise - current)}분)`;
        progress = 0;
    } else if (current < sunset) {
        const total = sunset - sunrise;
        const elapsed = current - sunrise;
        progress = Math.round((elapsed / total) * 100);
        body = `일몰까지 ${Math.round(sunset - current)}분 남음 (${progress}%)`;
    } else {
        body = "오늘의 태양이 졌습니다. 밤 모드 활성 중.";
        progress = 100;
    }

    // 갤럭시 알림창 내 Live Notification 트리거
    self.registration.showNotification(title, {
        body: body,
        tag: 'qpi-live-status', // 태그 고정으로 알림이 쌓이지 않고 갱신됨
        icon: 'apple-icon.png',
        badge: 'apple-icon.png',
        ongoing: true,          // 사용자가 지울 수 없는 '진행 중' 알림
        silent: true,           // 업데이트 시 무음
        // 안드로이드 시스템 알림창에 진행바를 그리는 데이터
        data: {
            progress: progress
        }
    });
}
