// sw.js
const CACHE_NAME = 'qpi-ambient-v1.23'; // 버전을 올려서 브라우저가 새 파일을 읽게 하세요.

self.addEventListener('install', (e) => {
    self.skipWaiting();
});

self.addEventListener('activate', (e) => {
    e.waitUntil(self.clients.claim());
});

self.addEventListener('message', (event) => {
    if (event.data.type === 'UPDATE_LIVE_NOTIFY') {
        const { sunrise, sunset, current } = event.data.payload;
        
        let title = "일몰 추적 (Live)";
        let body = "";
        let progress = 0;

        if (current < sunrise) {
            body = `일출 대기 중...`;
            progress = 0;
        } else if (current < sunset) {
            const total = sunset - sunrise;
            const elapsed = current - sunrise;
            progress = Math.round((elapsed / total) * 100);
            body = `일몰까지 ${Math.round(sunset - current)}분 남음 (${progress}%)`;
        } else {
            body = "일몰 완료. 밤 모드 시뮬레이션 중.";
            progress = 100;
        }

        // 갤럭시 알림창에서 "Live Notification"으로 인식시키기 위한 핵심 옵션
        self.registration.showNotification(title, {
            body: body,
            tag: 'qpi-live-progress', // 알림이 쌓이지 않고 하나만 유지되게 함
            icon: 'apple-icon.png',
            badge: 'apple-icon.png',
            ongoing: true,            // 사용자가 지울 수 없게 '실행 중'으로 고정
            silent: true,             // 업데이트 시 소리 안 나게 함
            
            // [핵심] 안드로이드 시스템 알림창에 진행바를 그리는 데이터 구조
            // 일부 갤럭시 기기에서는 vibration이나 renotify 옵션에 따라 다르게 보일 수 있음
            vibrate: [], 
            data: {
                progress: progress // 진행률 (0~100)
            },
            
            // 알림창을 내렸을 때 '진행 중인 앱' 섹션에 확실히 들어가게 함
            renotify: false
        });
    }
});
