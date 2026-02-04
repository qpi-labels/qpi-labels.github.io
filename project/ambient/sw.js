const CACHE_NAME = 'qpi-ambient 5 1.19';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './logo.ico',
  './so_ambient.mp3',
  './crickets.mp3',
  './creepy_tomb.mp3'
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

// sw.js
self.addEventListener('message', (event) => {
    if (event.data.type === 'UPDATE_NOW_BAR') {
        const { sunrise, sunset, current } = event.data.payload;
        updateNowBar(sunrise, sunset, current);
    }
});

function updateNowBar(sunrise, sunset, current) {
    let title = "";
    let body = "";
    let progress = 0;

    if (current < sunrise) {
        title = "일출 대기 중";
        body = `일출까지 약 ${Math.round(sunrise - current)}분 남음`;
        progress = 0;
    } else if (current < sunset) {
        title = "일몰 진행 중";
        const totalDaylight = sunset - sunrise;
        const elapsed = current - sunrise;
        progress = Math.round((elapsed / totalDaylight) * 100);
        body = `일몰까지 ${Math.round(sunset - current)}분 (${progress}%)`;
    } else {
        title = "밤 (일몰 완료)";
        body = "오늘의 태양이 졌습니다.";
        progress = 100;
    }

    // 갤럭시 Now Bar(진행 중인 알림) 트리거
    self.registration.showNotification('QPI Ambient', {
        body: body,
        tag: 'qpi-nowbar-status', // 중요: 이 태그가 같아야 Now Bar에서 교체됨
        icon: 'apple-icon.png',
        badge: 'apple-icon.png',
        ongoing: true,            // 사용자가 지울 수 없게 설정
        silent: true,             // 업데이트 시마다 소리 나지 않게
        data: { progress: progress } 
    });
}

