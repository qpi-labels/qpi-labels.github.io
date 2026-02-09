import tinycolor from "./tinycolor.js";
import { renderSubjectsUI, renderHUD, renderAll, renderPanel } from "./render.js";
import { commitDelta, finalizeCurrentSession } from "./timer.js";
import { clamp, dateKeyLocal, ensureDay, escapeHtml, fmtHMS, should_dismiss_dialog, startOfMonthLocal, subjectById, uid } from "./util.js";
import { App } from "./data.js";

// ---------- DOM ----------
export const ui = {
	// HUD
	studyHud: document.getElementById('studyHud'),
	studyTime: document.getElementById('studyTime'),
	goalBarFill: document.getElementById('goalBarFill'),
	modeTotalBtn: document.getElementById('modeTotalBtn'),
	modeSubjectBtn: document.getElementById('modeSubjectBtn'),
	subjectSelect: document.getElementById('subjectSelect'),
	subjectChips: document.getElementById('subjectChips'),
	addSubjectBtn: document.getElementById('addSubjectBtn'),
	toggleBtn: document.getElementById('studyToggleBtn'),
	toggleText: document.getElementById('studyToggleText'),
	toggleIcon: document.getElementById('studyToggleIcon'),
	openPanelBtn: document.getElementById('openStatsBtn'),

	// Panel
	panelSheet: document.getElementById('panelSheet'),
	panelTitle: document.getElementById('panelTitle'),
	panelSubtitle: document.getElementById('panelSubtitle'),
	panelScroll: document.getElementById('panelScroll'),
	closePanelBtn: document.getElementById('closePanelBtn'),
	tabBtnStats: document.getElementById('tabBtnStats'),
	tabBtnCalendar: document.getElementById('tabBtnCalendar'),
	tabBtnSubjects: document.getElementById('tabBtnSubjects'),
	tabBtnGoal: document.getElementById('tabBtnGoal'),
	tabStats: document.getElementById('tabStats'),
	tabCalendar: document.getElementById('tabCalendar'),
	tabSubjects: document.getElementById('tabSubjects'),
	tabGoal: document.getElementById('tabGoal'),

	// Stats
	kpiToday: document.getElementById('kpiToday'),
	kpiTodaySub: document.getElementById('kpiTodaySub'),
	kpiWeek: document.getElementById('kpiWeek'),
	kpiWeekSub: document.getElementById('kpiWeekSub'),
	kpiMonth: document.getElementById('kpiMonth'),
	kpiMonthSub: document.getElementById('kpiMonthSub'),
	periodTodayBtn: document.getElementById('periodTodayBtn'),
	periodWeekBtn: document.getElementById('periodWeekBtn'),
	periodMonthBtn: document.getElementById('periodMonthBtn'),
	breakdownList: document.getElementById('breakdownList'),
	weekdayBars: document.getElementById('weekdayBars'),
	focusInfo: document.getElementById('focusInfo'),
	exportBtn: document.getElementById('exportBtn'),
	resetTodayBtn: document.getElementById('resetTodayBtn'),
	resetAllBtn: document.getElementById('resetAllBtn'),

	// Calendar
	calPrevBtn: document.getElementById('calPrevBtn'),
	calNextBtn: document.getElementById('calNextBtn'),
	calTitle: document.getElementById('calTitle'),
	calDow: document.getElementById('calDow'),
	calGrid: document.getElementById('calGrid'),

	// Subjects panel
	addSubjectBtn2: document.getElementById('addSubjectBtn2'),
	subjectsManageList: document.getElementById('subjectsManageList'),

	// Goal
	goalNow: document.getElementById('goalNow'),
	goalHours: document.getElementById('goalHours'),
	goalMinutes: document.getElementById('goalMinutes'),
	goalResetBtn: document.getElementById('goalResetBtn'),
	goalSaveBtn: document.getElementById('goalSaveBtn'),
	goalProgressText: document.getElementById('goalProgressText'),
	goalProgressBar: document.getElementById('goalProgressBar'),

	// Subject modal
	subjectModal: document.getElementById('subjectModal'),
	subjectModalTitle: document.getElementById('subjectModalTitle'),
	subjectModalDesc: document.getElementById('subjectModalDesc'),
	subjectNameInput: document.getElementById('subjectNameInput'),
	colorDots: document.getElementById('colorDots'),
	subjectColorInput: document.getElementById('subjectColorInput'),
	subjectCancelBtn: document.getElementById('subjectCancelBtn'),
	subjectSaveBtn: document.getElementById('subjectSaveBtn'),
	subjectDeleteBtn: document.getElementById('subjectDeleteBtn'),

	// Day detail modal
	dayDetailModal: document.getElementById('dayDetailModal'),
	dayDetailTitle: document.getElementById('dayDetailTitle'),
	dayDetailSub: document.getElementById('dayDetailSub'),
	dayDetailList: document.getElementById('dayDetailList'),
	dayDetailCloseBtn: document.getElementById('dayDetailCloseBtn'),

	// Confirm modal
	confirmModal: document.getElementById('confirmModal'),
	confirmTitle: document.getElementById('confirmTitle'),
	confirmText: document.getElementById('confirmText'),
	confirmCancelBtn: document.getElementById('confirmCancelBtn'),
	confirmOkBtn: document.getElementById('confirmOkBtn'),
};

// ---------- Event wiring ----------
// HUD interactions
ui.modeTotalBtn.addEventListener('click', () => setViewMode('total'));
ui.modeSubjectBtn.addEventListener('click', () => setViewMode('subject'));
ui.addSubjectBtn.addEventListener('click', () => openSubjectModal('add'));
ui.subjectSelect.addEventListener('change', () => setActiveSubject(ui.subjectSelect.value));
ui.subjectChips.addEventListener('scroll', maskChipbar);
ui.toggleBtn.addEventListener('click', toggleTimer);

// Panel open/close
ui.openPanelBtn.addEventListener('click', () => openPanel(App.store.settings.panelTab || 'stats'));
ui.closePanelBtn.addEventListener('click', closePanel);
ui.panelSheet.addEventListener('transitionend', (e) => {
	if (e.propertyName === 'max-height') maskPanel();
});
ui.panelScroll.addEventListener('scroll', maskPanel);

ui.tabBtnStats.addEventListener('click', () => setPanelTab('stats'));
ui.tabBtnCalendar.addEventListener('click', () => setPanelTab('calendar'));
ui.tabBtnSubjects.addEventListener('click', () => setPanelTab('subjects'));
ui.tabBtnGoal.addEventListener('click', () => setPanelTab('goal'));

// Stats controls
ui.periodTodayBtn.addEventListener('click', () => setStatsPeriod('today'));
ui.periodWeekBtn.addEventListener('click', () => setStatsPeriod('week'));
ui.periodMonthBtn.addEventListener('click', () => setStatsPeriod('month'));
ui.exportBtn.addEventListener('click', exportJSON);
ui.resetTodayBtn.addEventListener('click', resetToday);
ui.resetAllBtn.addEventListener('click', resetAll);

// Calendar controls
ui.calPrevBtn.addEventListener('click', () => shiftCalendarMonth(-1));
ui.calNextBtn.addEventListener('click', () => shiftCalendarMonth(1));

// Subjects panel
ui.addSubjectBtn2.addEventListener('click', () => openSubjectModal('add'));

// Goal panel
ui.goalSaveBtn.addEventListener('click', saveGoalFromInputs);
ui.goalResetBtn.addEventListener('click', resetGoalDefault);


// Subject modal
ui.subjectModal.addEventListener('click', (e) => {
	if (!should_dismiss_dialog(ui.subjectModal, e)) return;
	closeSubjectModal();
});
ui.subjectCancelBtn.addEventListener('click', closeSubjectModal);
ui.subjectColorInput.addEventListener('input', syncColorDotActive);
ui.subjectNameInput.addEventListener('keydown', (e) => {
	if (e.key === 'Enter') upsertSubject();
	if (e.key === 'Escape') closeSubjectModal();
});
ui.subjectSaveBtn.addEventListener('click', upsertSubject);
ui.subjectDeleteBtn.addEventListener('click', async () => {
	const sid = subjectModalTargetId;
	const ok = await confirmDialog('과목 삭제', '이 과목을 삭제할까요? (기록은 남지만 과목 목록에서 제거됨)');
	closeConfirm(false);
	if (!ok) return;
	deleteSubject(sid);
	closeSubjectModal();
});

// Day detail modal
ui.dayDetailModal.addEventListener('click', (e) => {
	if (!should_dismiss_dialog(ui.dayDetailModal, e)) return;
	closeDayDetail();
});
ui.dayDetailCloseBtn.addEventListener('click', closeDayDetail);

// Confirm modal
ui.confirmCancelBtn.addEventListener('click', () => closeConfirm(false));
ui.confirmOkBtn.addEventListener('click', () => closeConfirm(true));



function setViewMode(mode) {
	const m = (mode === 'subject') ? 'subject' : 'total';
	App.store.settings.viewMode = m;
	App.save();

	ui.modeTotalBtn.classList.toggle('active', m === 'total');
	ui.modeSubjectBtn.classList.toggle('active', m === 'subject');
	ui.subjectSelect.disabled = (m !== 'subject');

	renderHUD();
}

export function setActiveSubject(subjectId) {
	const rt = App.runtime;
	const id = subjectId || '';
	const prev = rt.activeSubjectId || '';
	if (prev === id) return;

	const nowTs = Date.now();

	// running이면 현재까지 시간 확정 + 세션 분리
	if (rt.running) {
		commitDelta(nowTs);
		finalizeCurrentSession(nowTs);

		rt.activeSubjectId = id;

		// 새 세션 시작(끊김 없이)
		rt.sessionStartTs = nowTs;
		rt.sessionSubjectId = id;
		rt.lastTs = nowTs;
	} else {
		rt.activeSubjectId = id;
	}

	App.store.settings.lastSubjectId = id;
	App.save();
	renderSubjectsUI();
	renderHUD();
}

export function maskChipbar() {
	const sw = ui.subjectChips.scrollWidth;
	const w = ui.subjectChips.clientWidth;
	const sl = ui.subjectChips.scrollLeft;
	if (sl === 0) ui.subjectChips.style.setProperty('--left-mask', 'black');
	else ui.subjectChips.style.setProperty('--left-mask', 'transparent');
	if (sl+w >= sw-1) ui.subjectChips.style.setProperty('--right-mask', 'black');
	else ui.subjectChips.style.setProperty('--right-mask', 'transparent');
}

function toggleTimer() {
	if (App.runtime.running) pauseTimer();
	else startTimer();
}

export function startTimer() {
	const rt = App.runtime;
	if (rt.running) return;

	const nowTs = Date.now();
	rt.running = true;
	rt.lastTs = nowTs;

	rt.focusStartTs = nowTs;

	rt.sessionStartTs = nowTs;
	rt.sessionSubjectId = rt.activeSubjectId || '';

	setRunningUI(true);
}

function pauseTimer() {
	const rt = App.runtime;
	if (!rt.running) return;

	const nowTs = Date.now();
	commitDelta(nowTs);
	finalizeCurrentSession(nowTs);

	if (rt.focusStartTs) {
		const focusMs = nowTs - rt.focusStartTs;
		const dk = dateKeyLocal(nowTs);
		const day = ensureDay(dk);
		day.longestFocusMs = Math.max(day.longestFocusMs || 0, focusMs);
		App.store.meta.bestFocusMs = Math.max(App.store.meta.bestFocusMs || 0, focusMs);
	}

	rt.running = false;
	rt.lastTs = 0;
	rt.focusStartTs = 0;

	setRunningUI(false);
	App.save();
	renderAll();
}

function setRunningUI(running) {
	if (running) {
		ui.toggleBtn.classList.add('running');
		ui.toggleText.textContent = 'PAUSE';
		ui.toggleIcon.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
			<path d="M7 5H10V19H7V5Z" fill="var(--text-main)" style="transition: fill 0.5s;"/>
			<path d="M14 5H17V19H14V5Z" fill="var(--text-main)" style="transition: fill 0.5s;"/>
		</svg>`;
	} else {
		ui.toggleBtn.classList.remove('running');
		ui.toggleText.textContent = 'START';
		ui.toggleIcon.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
			<path d="M8 5V19L19 12L8 5Z" fill="var(--text-main)" style="transition: fill 0.5s;"/>
		</svg>`;
	}
}

// ---------- UI: Panel ----------
function openPanel(tab=null) {
	if (App.runtime.panelOpen) { closePanel(); return; }
	ui.panelSheet.classList.add('active');
	App.runtime.panelOpen = true;
	setPanelTab(tab || App.store.settings.panelTab || 'stats');
	renderPanel();
}

function closePanel() {
	ui.panelSheet.classList.remove('active');
	App.runtime.panelOpen = false;
}

function maskPanel() {
	const sh = ui.panelScroll.scrollHeight;
	const h = ui.panelScroll.clientHeight;
	const st = ui.panelScroll.scrollTop;
	if (h === 0) return;
	if (st === 0) ui.panelScroll.style.setProperty('--top-mask', 'black');
	else ui.panelScroll.style.setProperty('--top-mask', 'transparent');
	if (st+h >= sh-1) ui.panelScroll.style.setProperty('--bottom-mask', 'black');
	else ui.panelScroll.style.setProperty('--bottom-mask', 'transparent');
}

function setPanelTab(tab) {
	const t = tab || 'stats';
	App.store.settings.panelTab = t;
	App.save();

	const tabs = [
		{ key: 'stats', btn: ui.tabBtnStats, el: ui.tabStats, title: '통계' },
		{ key: 'calendar', btn: ui.tabBtnCalendar, el: ui.tabCalendar, title: '캘린더' },
		{ key: 'subjects', btn: ui.tabBtnSubjects, el: ui.tabSubjects, title: '과목' },
		{ key: 'goal', btn: ui.tabBtnGoal, el: ui.tabGoal, title: '목표' },
	];
	tabs.forEach(x => {
		x.btn.classList.toggle('active', x.key === t);
		x.el.classList.toggle('active', x.key === t);
	});
	const cur = tabs.find(x => x.key === t);
	ui.panelTitle.textContent = cur ? cur.title : '통계';
	renderPanel();
	maskPanel();
}

// ---------- Stats computations ----------
function setStatsPeriod(period) {
	App.store.settings.statsPeriod = period;
	App.save();
	// UI button states
	ui.periodTodayBtn.classList.toggle('active', period === 'today');
	ui.periodWeekBtn.classList.toggle('active', period === 'week');
	ui.periodMonthBtn.classList.toggle('active', period === 'month');
	renderPanel();
}

// ---------- Export / Reset ----------
function exportJSON() {
	// 저장 구조가 날짜 -> 과목 -> 시간(ms) 이므로, 사용 편의를 위해 "초 단위" 요약도 함께 제공
	const payload = JSON.stringify(App.store, null, 2);
	const filename = `ypt_${dateKeyLocal()}.json`;

	if (navigator.clipboard && navigator.clipboard.writeText) {
		navigator.clipboard.writeText(payload)
			.then(() => {
				// 최소 알림 (공부 방해 최소)
				ui.panelSubtitle.textContent = `${dateKeyLocal()} · JSON 복사됨`;
			})
			.catch(() => downloadJSON(payload, filename));
	} else {
		downloadJSON(payload, filename);
	}
}

function downloadJSON(payload, filename) {
	const blob = new Blob([payload], { type: 'application/json' });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	a.remove();
	URL.revokeObjectURL(url);
}

async function resetToday() {
	const ok = await confirmDialog('오늘 초기화', '오늘 공부 기록을 초기화할까요? (되돌릴 수 없음)');
	if (!ok) return;
	const dk = dateKeyLocal();
	App.store.days[dk] = { totalMs: 0, subjects: {}, sessions: [], longestFocusMs: 0 };
	App.save();
	pauseTimer(); // 안전하게 중지
	renderAll();
}

async function resetAll() {
	const ok = await confirmDialog('전체 초기화', '모든 공부 기록/과목/설정을 초기화할까요? (되돌릴 수 없음)');
	if (!ok) return;
	App.reset();
	App.runtime.running = false;
	App.runtime.lastTs = 0;
	App.runtime.activeSubjectId = '';
	setRunningUI(false);
	renderAll();
}

// ---------- Calendar nav ----------
function shiftCalendarMonth(delta) {
	const cur = App.store.settings.calendarMonthTs || startOfMonthLocal(Date.now());
	const d = new Date(cur);
	d.setMonth(d.getMonth() + delta);
	d.setDate(1);
	d.setHours(0,0,0,0);
	App.store.settings.calendarMonthTs = d.getTime();
	App.save();
	renderPanel();
}

// ---------- Goal ----------
function saveGoalFromInputs() {
	const h = clamp(parseInt(ui.goalHours.value || '0', 10) || 0, 0, 23);
	const m = clamp(parseInt(ui.goalMinutes.value || '0', 10) || 0, 0, 59);
	const goal = (h * 60 + m) * 60000;
	App.store.settings.dailyGoalMs = goal;
	App.save();
	renderAll();
}

function resetGoalDefault() {
	App.store.settings.dailyGoalMs = 2 * 60 * 60 * 1000;
	App.save();
	renderAll();
}


// ---------- UI: Subject modal ----------
const COLOR_PRESETS = [
	'#90caf9', '#a5d6a7', '#f48fb1', '#ffcc80',
	'#ce93d8', '#80cbc4', '#fff59d', '#b0bec5'
];

let subjectModalMode = 'add'; // 'add' | 'edit'
let subjectModalTargetId = '';

export function openSubjectModal(mode='add', subjectId='') {
	subjectModalMode = mode;
	subjectModalTargetId = subjectId || '';

	ui.subjectModal.showModal();

	// build color dots
	ui.colorDots.innerHTML = '';
	COLOR_PRESETS.forEach(c => {
		const dot = document.createElement('button');
		dot.type = 'button';
		dot.className = 'cdot';
		dot.style.background = c;
		dot.addEventListener('click', () => {
			ui.subjectColorInput.value = c;
			syncColorDotActive();
		});
		ui.colorDots.appendChild(dot);
	});

	if (mode === 'add') {
		ui.subjectModalTitle.textContent = '과목 추가';
		ui.subjectModalDesc.textContent = '과목명과 색상을 정하면 과목별 누적 시간이 자동 기록됩니다.';
		ui.subjectNameInput.value = '';
		ui.subjectColorInput.value = '#90caf9';
		ui.subjectDeleteBtn.style.display = 'none';
	} else {
		const s = subjectById(subjectId);
		ui.subjectModalTitle.textContent = '과목 수정';
		ui.subjectModalDesc.textContent = '이름/색상을 바꿔도 누적 기록은 유지됩니다.';
		ui.subjectNameInput.value = s ? s.name : '';
		ui.subjectColorInput.value = s?.color || '#90caf9';
		ui.subjectDeleteBtn.style.display = 'inline-flex';
	}

	syncColorDotActive();
	setTimeout(() => ui.subjectNameInput.focus(), 0);
}

function closeSubjectModal() {
	ui.subjectModal.close();
	subjectModalTargetId = '';
}

function syncColorDotActive() {
	const val = (ui.subjectColorInput.value || '').toLowerCase();
	[...ui.colorDots.children].forEach(btn => {
		const bg = (btn.style.background || '').toLowerCase();
		btn.classList.toggle('active', tinycolor.equals(bg, val));
	});
}

function upsertSubject() {
	const name = (ui.subjectNameInput.value || '').trim();
	const color = (ui.subjectColorInput.value || '#90caf9').trim();
	if (!name) return;

	// name duplicate check (case-insensitive), except self
	const dup = App.store.subjects.some(s => s.name.toLowerCase() === name.toLowerCase() && s.id !== subjectModalTargetId);
	if (dup) return;

	if (subjectModalMode === 'add') {
		const id = uid('s');
		App.store.subjects.push({ id, name, color, createdAt: Date.now() });
		// auto select
		setActiveSubject(id);
	} else {
		const s = subjectById(subjectModalTargetId);
		if (s) {
			s.name = name;
			s.color = color;
		}
	}
	App.save();
	renderAll();
	closeSubjectModal();
}

function deleteSubject(subjectId) {
	// 과목 삭제 시: 과목 목록에서만 제거.
	// 과거 기록(subjectId 키)은 남아 있지만 UI에서는 "삭제된 과목"으로 보이게 처리.
	App.store.subjects = App.store.subjects.filter(s => s.id !== subjectId);
	if (App.runtime.activeSubjectId === subjectId) setActiveSubject('');
	if (App.store.settings.lastSubjectId === subjectId) App.store.settings.lastSubjectId = '';
	App.save();
	renderAll();
}

export function openDayDetail(dk) {
	const day = ensureDay(dk);
	ui.dayDetailTitle.textContent = dk;
	ui.dayDetailSub.textContent = `총 ${fmtHMS(day.totalMs || 0)}`;

	// subject breakdown
	const entries = [];
	for (const [sid, ms] of Object.entries(day.subjects || {})) {
		if (!ms) continue;
		entries.push({ sid, ms });
	}
	entries.sort((a,b)=> b.ms - a.ms);

	ui.dayDetailList.innerHTML = '';
	if (entries.length === 0) {
		const empty = document.createElement('div');
		empty.className = 'item';
		empty.innerHTML = `<div class="item-row"><div class="item-name">기록 없음</div><div class="item-time">00:00:00</div></div>`;
		ui.dayDetailList.appendChild(empty);
	} else {
		const total = Math.max(1, day.totalMs || 0);
		entries.forEach(e => {
			const pct = Math.min(100, (e.ms / total) * 100);
			const item = document.createElement('div');
			const s = (e.sid) ? subjectById(e.sid) : undefined;
			let name = escapeHtml((s !== undefined) ? (s?.name ?? '삭제된 과목') : '미분류');
			let color = s?.color ?? 'rgba(255,255,255,0.28)';
			item.className = 'item';
			item.innerHTML = `
				<div class="item-row">
					<div class="item-name" title="${name}">
						<span style="display:inline-flex; align-items:center; gap:8px; min-width:0;">
							<span class="swatch" style="width:10px;height:10px; background:${color};"></span>
							<span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:240px;">${name}</span>
						</span>
					</div>
					<div class="item-time">${fmtHMS(e.ms)}</div>
				</div>
				<div class="bar"><div style="width:${pct.toFixed(1)}%; background:${color};"></div></div>
			`;
			ui.dayDetailList.appendChild(item);
		});
	}

	ui.dayDetailModal.showModal();
}

function closeDayDetail() {
	ui.dayDetailModal.close();
}

// ---------- Confirm modal ----------
let confirmResolve = null;
function confirmDialog(title, text) {
	ui.confirmTitle.textContent = title || '확인';
	ui.confirmText.textContent = text || '';
	ui.confirmModal.showModal();
	return new Promise((resolve) => { confirmResolve = resolve; });
}
function closeConfirm(result=false) {
	ui.confirmModal.close();
	if (confirmResolve) confirmResolve(result);
	confirmResolve = null;
}