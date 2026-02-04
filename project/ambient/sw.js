// sw.js
const CACHE_NAME = 'qpi-ambient-v1.23.2'; 
const ASSETS = ['./', './index.html', './manifest.json', './logo.ico', './apple-icon.png'];

self.addEventListener('install', (e) => {
    self.skipWaiting();
    e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener('activate', (e) => {
    e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (e) => {
    e.respondWith(caches.match(e.request).then((res) => res || fetch(e.request)));
});

// 라이브 업데이트 핵심 로직
self.addEventListener('message', (event) => {
    if (event.data.type === 'UPDATE_LIVE_NOTIFY') {
        const { sunrise, sunset, current } = event.data.payload;
        
        let progress = 0;
        let bodyText = "";

        if (current < sunrise) {
            bodyText = `일출 대기 중 (${Math.round(sunrise - current)}분 전)`;
            progress = 0;
        } else if (current < sunset) {
            const total = sunset - sunrise;
            const elapsed = current - sunrise;
            progress = Math.round((elapsed / total) * 100);
            bodyText = `일몰까지 ${Math.round(sunset - current)}분 (${progress}%)`;
        } else {
            bodyText = "오늘의 일몰이 완료되었습니다.";
            progress = 100;
        }

        // [핵심] 안드로이드 공식 문서의 setProgress 기능을 모사
        self.registration.showNotification('QPI Ambient', {
            body: bodyText,
            tag: 'qpi-live-progress', // 알림창에 하나로 고정시키는 ID
            icon: 'apple-icon.png',
            badge: 'apple-icon.png',
            ongoing: true,      // 지울 수 없는 '실행 중' 상태로 강제
            silent: true,       // 업데이트 시 소리 안 나게 (공식 문서 권장)
            renotify: false,    // 알림이 새로 튀어나오지 않게 함
            
            // 안드로이드 시스템 알림창에 '파란색 진행바'를 그리는 표준 데이터 구조
            data: {
                progress: {
                    max: 100,
                    current: progress,
                    indeterminate: false
                }
            }
        });
    }
});
