// sw.js
const CACHE_NAME = 'qpi-ambient-v1.22'; 
const ASSETS = [
  './', './index.html', './manifest.json', './logo.ico',
  './so_ambient.mp3', './crickets.mp3', './creepy_tomb.mp3', './apple-icon.png'
];

self.addEventListener('install', (e) => {
  self.skipWaiting(); 
  e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.map((key) => {
    if (key !== CACHE_NAME) return caches.delete(key);
  }))));
});

self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request).then((res) => res || fetch(e.request)));
});

/* ----------------------------------------------------
   라이브 노티피케이션 (실시간 진행바 알림) 핵심 로직
   ---------------------------------------------------- */
self.addEventListener('message', (event) => {
    if (event.data.type === 'UPDATE_LIVE_NOTIFY') {
        const { sunrise, sunset, current } = event.data.payload;
        
        let title = "QPI Ambient: 일몰 추적";
        let body = "";
        let progressValue = 0;

        // 시간 계산 로직
        if (current < sunrise) {
            body = `일출 대기 중... (약 ${Math.round(sunrise - current)}분)`;
            progressValue = 0;
        } else if (current < sunset) {
            const total = sunset - sunrise;
            const elapsed = current - sunrise;
            progressValue = Math.round((elapsed / total) * 100);
            body = `일몰 진행률: ${progressValue}% (남은 시간: ${Math.round(sunset - current)}분)`;
        } else {
            body = "일몰 완료. 밤 모드 시뮬레이션 중.";
            progressValue = 100;
        }

        // 갤럭시 알림창에 "Live"로 고정시키는 설정
        self.registration.showNotification(title, {
            body: body,
            tag: 'live-progress-notification', // 태그를 고정해야 알림이 새로 생기지 않고 갱신됨
            icon: 'apple-icon.png',
            badge: 'apple-icon.png',
            ongoing: true, // 사용자가 지울 수 없게 '진행 중'으로 설정
            silent: true,  // 갱신될 때마다 소리나지 않게 무음 처리
            
            // 안드로이드 시스템 알림창에 진행바(Progress Bar)를 띄우는 핵심 파라미터
            data: {
                progress: progressValue 
            },
            // 일부 안드로이드 버전에서 진행바를 명시적으로 지원하기 위한 설정
            actions: [
                { action: 'open', title: '앱 열기' }
            ]
        });
    }
});
