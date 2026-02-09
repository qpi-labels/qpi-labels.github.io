import { startOfMonthLocal, dateKeyLocal, fmtHMS } from './util.js';

const YPT_STORE_KEY_V2 = 'ypt_local_v2';
const LEGACY_STORE_KEY_V1 = 'studyTracker_v1';

// ---------- Storage ----------
const AppStorage = (() => {
	const defaultStore = () => ({
		version: 2,
		subjects: [
			// 기본 과목은 강제하지 않음 (사용자가 +로 추가)
		],
		settings: {
			dailyGoalMs: 2 * 60 * 60 * 1000, // 2h default
			lastSubjectId: '',
			viewMode: 'total',  // 'total' | 'subject'
			panelTab: 'stats',  // 'stats' | 'calendar' | 'subjects' | 'goal'
			statsPeriod: 'today', // 'today' | 'week' | 'month'
			calendarMonthTs: startOfMonthLocal(Date.now()),
		},
		days: {
			// "YYYY-MM-DD": { totalMs, subjects: {id: ms}, sessions: [{start,end,subjectId}], longestFocusMs }
		},
		meta: {
			bestFocusMs: 0,
		}
	});

	function loadRaw(key) {
		try {
			const raw = localStorage.getItem(key);
			return raw ? JSON.parse(raw) : null;
		} catch { return null; }
	}

	function save(store) {
		localStorage.setItem(YPT_STORE_KEY_V2, JSON.stringify(store));
	}

	function migrateLegacyIfNeeded() {
		const existing = loadRaw(YPT_STORE_KEY_V2);
		if (existing) return existing;

		const legacy = loadRaw(LEGACY_STORE_KEY_V1);
		if (!legacy) return null;

		// legacy schema:
		// { subjects:[{id,name}], days:{[date]:{totalSeconds, unclassifiedSeconds, subjectSeconds}}, meta:{mode, selectedSubjectId} }
		const st = defaultStore();
		try {
			const colorPresets = ['#90caf9','#a5d6a7','#f48fb1','#ffcc80','#ce93d8','#80cbc4','#fff59d','#b0bec5'];
			st.subjects = (legacy.subjects || []).map((s, i) => ({
				id: s.id || uid('s'),
				name: s.name || '과목',
				color: colorPresets[i % colorPresets.length],
				createdAt: Date.now(),
			}));
			st.settings.viewMode = legacy.meta?.mode === 'subject' ? 'subject' : 'total';
			st.settings.lastSubjectId = legacy.meta?.selectedSubjectId || '';
			const days = legacy.days || {};
			for (const dk of Object.keys(days)) {
				const d = days[dk] || {};
				const subjects = {};
				for (const sid of Object.keys(d.subjectSeconds || {})) {
					subjects[sid] = Math.round((d.subjectSeconds[sid] || 0) * 1000);
				}
				st.days[dk] = {
					totalMs: Math.round((d.totalSeconds || 0) * 1000),
					subjects,
					sessions: [],
					longestFocusMs: 0,
				};
			}
			save(st);
			return st;
		} catch {
			return null;
		}
	}

	function normalize(store) {
		const base = defaultStore();
		if (!store || typeof store !== 'object') return base;
		if (store.version !== 2) {
			// 미래 버전 대비: 최소 필드만 보정
			store.version = 2;
		}
		store.subjects = Array.isArray(store.subjects) ? store.subjects : [];
		store.settings = { ...base.settings, ...(store.settings || {}) };
		store.days = store.days && typeof store.days === 'object' ? store.days : {};
		store.meta = { ...base.meta, ...(store.meta || {}) };

		// ensure subject structure
		store.subjects = store.subjects.map(s => ({
			id: s.id || uid('s'),
			name: (s.name || '과목').slice(0, 24),
			color: s.color || '#90caf9',
			createdAt: s.createdAt || Date.now(),
		}));

		// ensure day structure
		for (const dk of Object.keys(store.days)) {
			const d = store.days[dk];
			if (!d || typeof d !== 'object') continue;
			if (typeof d.totalMs !== 'number') d.totalMs = 0;
			if (!d.subjects || typeof d.subjects !== 'object') d.subjects = {};
			if (!Array.isArray(d.sessions)) d.sessions = [];
			if (typeof d.longestFocusMs !== 'number') d.longestFocusMs = 0;
		}

		return store;
	}

	function load() {
		const migrated = migrateLegacyIfNeeded();
		if (migrated) return normalize(migrated);
		const raw = loadRaw(YPT_STORE_KEY_V2);
		return normalize(raw || defaultStore());
	}

	return { load, save, defaultStore };
})();

// ---------- Global App State ----------
export const App = {
	store: AppStorage.load(),
	save: () => AppStorage.save(App.store),
	reset: () => { App.store = AppStorage.defaultStore(); App.save(); },
	runtime: {
		running: false,
		lastTs: 0,           // 마지막 tick 기준
		activeSubjectId: '', // 현재 선택 과목(빈 문자열 = 미분류)
		sessionStartTs: 0,   // 현재 세션 시작(과목 세그먼트 단위)
		sessionSubjectId: '',
		focusStartTs: 0,     // "최장 집중"용: 실행 시작 시각(중단까지)
		rafId: 0,
		lastUiTs: 0,
		lastSaveTs: 0,
		panelOpen: false
	}
};

window.appdump = () => {
	console.log("store:");
	console.log(App.store);
	console.log("runtime:");
	console.log(App.runtime);
};


const GAS_URL = "https://script.google.com/macros/s/AKfycbzh4V2v2v4mzSkQQkf49FrRjRb3pCsnx4I0T4QBgC4CA8YA9JaRJmgOYee9Tq6hCrq-/exec";

//구글 로그인 넣을지 말지는 나중에 물어보기
let userName = localStorage.getItem('ypt_user_name');
if (!userName) {
	userName = prompt("학번_이름을 입력해주세요");
	if (!userName) userName = "익명";
	localStorage.setItem('ypt_user_name', userName);
}


async function sendDataToSheet(targetDateTs) {
	const dateKey = dateKeyLocal(targetDateTs);
	const dayData = App.store.days[dateKey];
	
	// 데이터가 없거나 이미 보냈다면 중단
	if (!dayData || dayData.totalMs <= 0) return;

	const payload = {
		date: dateKey,
		userName: userName,
		totalMs: dayData.totalMs,
		formattedTime: fmtHMS(dayData.totalMs)
	};

	try {
		const response = await fetch(GAS_URL, {
			method: 'POST',
			body: JSON.stringify(payload)
		});
		if (response.ok) {
			console.log(`${dateKey} 데이터 전송 성공: ${userName}`);
			localStorage.setItem(`synced_${dateKey}`, "true");
		}
	} catch (e) {
		console.error("전송 오류:", e);
	}
}

//이동
export async function initAutoSync() {
	const allDays = Object.keys(App.store.days);
	const todayKey = dateKeyLocal(Date.now());
	
	for (const dk of allDays) {
		if (dk < todayKey && localStorage.getItem(`synced_${dk}`) !== "true") {
			const targetTs = new Date(dk).getTime();
			await sendDataToSheet(targetTs);
		}
	}

	setInterval(() => {
		const now = new Date();
		if (now.getHours() === 0 && now.getMinutes() === 0) {
			const yesterdayTs = Date.now() - 120000; 
			const yesterdayKey = dateKeyLocal(yesterdayTs);
			
			if (localStorage.getItem(`synced_${yesterdayKey}`) !== "true") {
				sendDataToSheet(yesterdayTs);
			}
		}
	}, 60000);
}

export function testSpecificTimeSync(targetHour, targetMinute) {
	console.log(`테스트 설정: ${targetHour}시 ${targetMinute}분`);
	
	const testInterval = setInterval(() => {
		const now = new Date();
		const currentH = now.getHours();
		const currentM = now.getMinutes();

		if (currentH === targetHour && currentM === targetMinute) {
			console.log("완");
			
			sendDataToSheet(Date.now());
			
			// 테스트 전송은 한 번만 실행되도록 인터벌 종료 (원치 않으면 주석 처리)
			clearInterval(testInterval); 
		}
	}, 10000); 
}