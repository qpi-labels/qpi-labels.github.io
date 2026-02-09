/* import "../style/timer.css"; */

import { dateKey, endOfDay, ensureDay, startOfDay } from "./util.js";
import { renderHUD, renderPanel, renderAll } from "./render.js";
import { App, initAutoSync, testSpecificTimeSync } from "./data.js";

// =========================
// 5. YPT Local Study Timer (offline, localStorage only)
// =========================
// 설계 목표:
// - Date.now 기반으로 오차 최소화(탭 비활성/전환에도 누적 정확)
// - 자정(로컬) 기준 날짜 자동 분리
// - 날짜 -> 과목 -> 시간(ms) 구조 유지
// - 기능별 모듈 분리 + 전역 상태(AppState)로 관리
// - 네트워크/서버/계정 기능 없음

// ---------- Time allocation (handles midnight split) ----------
export function commitDelta(nowTs) {
	const rt = App.runtime;
	commit: {
		if (!rt.running || !rt.lastTs) break commit;
		if (nowTs <= rt.lastTs) break commit;

		const sid = rt.activeSubjectId || '';
		let t0 = rt.lastTs;
		while (t0 < nowTs) {
			const dk = dateKey(t0);
			const dayEnd = endOfDay(t0);
			const t1 = Math.min(nowTs, dayEnd);
			const ms = t1 - t0;

			const day = ensureDay(dk);
			day.totalMs += ms;
			if (!day.subjects[sid]) day.subjects[sid] = 0;
			day.subjects[sid] += ms;

			t0 = t1;
		}
		rt.lastTs = nowTs;
	}

	if (!rt.running || !rt.sessionStartTs) return;
	const startKey = dateKey(rt.sessionStartTs);
	const nowKey = dateKey(nowTs);
	if (startKey === nowKey) return;

	// handle midnight
	const sid = rt.sessionSubjectId || '';
	endSession(nowTs);
	rt.sessionStartTs = startOfDay(nowTs);
	rt.sessionSubjectId = sid;
}

export function endSession(endTs) {
	const rt = App.runtime;
	if (!rt.sessionStartTs) return;
	const s = rt.sessionStartTs;
	const sid = rt.sessionSubjectId || '';
	rt.sessionStartTs = 0;
	rt.sessionSubjectId = '';
	if (endTs <= s) return;
	let t0 = s;
	while (t0 < endTs) {
		const dk = dateKey(t0);
		const dayEnd = endOfDay(t0);
		const t1 = Math.min(endTs, dayEnd);
		const day = ensureDay(dk);
		day.sessions.push({ start: t0, end: t1, sid });
		t0 = t1;
	}
}

// ---------- Tick loop (requestAnimationFrame 기반) ----------
export function scheduleTick() {
	if (App.runtime.rafId) return;
	const tick = () => {
		App.runtime.rafId = requestAnimationFrame(tick);

		const nowTs = Date.now();

		if (App.runtime.running) {
			// 시간 누적
			// rAF가 느리거나 백그라운드 후 복귀해도 now-lastTs로 정확히 반영
			commitDelta(nowTs);

			// save throttling (every ~2s)
			if (nowTs - (App.runtime.lastSaveTs || 0) > 2000) {
				App.runtime.lastSaveTs = nowTs;
				App.save();
			}
		}

		// UI update throttling (~2fps)
		if (nowTs - (App.runtime.lastUiTs || 0) > 500) {
			App.runtime.lastUiTs = nowTs;
			renderHUD();
		}
		
		// panel이 열려 있고 공부 중이면 가볍게 갱신(너무 자주 X)
		if (App.runtime.running && App.runtime.panelOpen) {
			if (nowTs - (App.runtime.lastUiPanelTs || 0) > 500) {
				App.runtime.lastUiPanelTs = nowTs;
				renderPanel();
			}
		}
	};
	App.runtime.rafId = requestAnimationFrame(tick);
}

// Visibility: background/foreground 전환 시에도 Date.now 기반으로 정확히 누적되지만,
// 복귀 시 UI/자정 분리를 한 번 더 보정
document.addEventListener('visibilitychange', () => {
	if (!document.hidden) {
		const nowTs = Date.now();
		if (App.runtime.running) {
			// long sleep 보정
			commitDelta(nowTs);
			App.save();
		}
		renderAll();
	}
});

// ---------- Init ----------
// restore last subject
App.runtime.activeSubjectId = App.store.settings.lastSubjectId || '';

// initial render
renderAll();

// start tick loop (always on; lightweight throttling inside)
scheduleTick();

// sync
initAutoSync();
//테스트 끝나면 주석 처리 잊지 않기
testSpecificTimeSync(21, 0);