import { App } from "./data.js";

// ---------- Utils ----------
export const pad2 = (n) => String(n).padStart(2, '0');
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const escapeHtml = (str) => String(str)
	.replaceAll('&', '&amp;')
	.replaceAll('<', '&lt;')
	.replaceAll('>', '&gt;')
	.replaceAll('"', '&quot;')
	.replaceAll("'", '&#039;');

export function fmtHMS(ms) {
	const sec = Math.max(0, Math.floor(ms / 1000));
	const h = Math.floor(sec / 3600);
	const m = Math.floor((sec % 3600) / 60);
	const s = sec % 60;
	return `${pad2(h)}:${pad2(m)}:${pad2(s)}`;
}

export function dateKeyLocal(ts) {
	const d = ts!==undefined ? new Date(ts) : new Date();
	return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export function startOfDayLocal(ts) {
	const d = new Date(ts);
	d.setHours(0, 0, 0, 0);
	return d.getTime();
}

export function startOfMonthLocal(ts) {
	const d = new Date(ts);
	d.setDate(1);
	d.setHours(0, 0, 0, 0);
	return d.getTime();
}

export function endOfDayLocal(ts) {
	return startOfDayLocal(ts) + 24 * 60 * 60 * 1000;
}

export function startOfWeekLocal(ts) {
	// 월요일 시작(한국에서 일반적)
	const d = new Date(ts);
	const day = d.getDay(); // 0=Sun
	const diff = (day === 0 ? -6 : 1 - day); // Monday
	d.setDate(d.getDate() + diff);
	d.setHours(0, 0, 0, 0);
	return d.getTime();
}

export function daysInMonthLocal(ts) {
	const d = new Date(ts);
	return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
}

export function uid(prefix='id') {
	return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

export function should_dismiss_dialog(el, e) {
	if (e.target !== el) return false;
	const rect = el.getBoundingClientRect();
	const clickedInDialog = rect.top <= event.clientY &&
	event.clientY <= rect.top + rect.height &&
	rect.left <= event.clientX &&
	event.clientX <= rect.left + rect.width;
	if (clickedInDialog) return false;
	return true;
}

export function ensureDay(dk) {
	if (!App.store.days[dk]) {
		App.store.days[dk] = { totalMs: 0, subjects: {}, sessions: [], longestFocusMs: 0 };
	}
	return App.store.days[dk];
}

export function subjectById(id) {
	return App.store.subjects.find(s => s.id === id) || null;
}