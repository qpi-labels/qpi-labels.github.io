import { ui, openSubjectModal, setActiveSubject, startTimer, maskChipbar, openDayDetail } from "./ui.js";
import { fmtHMS, escapeHtml, startOfWeek, dateKey, startOfMonth, daysInMonth, pad2, clamp, ensureDay } from "./util.js";
import { App } from "./data.js";


// ---------- HUD rendering ----------
function getDayTotalMs(dk) {
	const d = App.store.days[dk];
	return d ? (d.totalMs || 0) : 0;
}

export function renderHUDSubjects() {
	// select options
	ui.subjectSelect.innerHTML = '<option value="">미분류</option>';
	App.store.subjects.forEach(s => {
		const opt = document.createElement('option');
		opt.value = s.id;
		opt.textContent = s.name;
		ui.subjectSelect.appendChild(opt);
	});

	// selection
	const sid = App.runtime.activeSubjectId || '';
	ui.subjectSelect.value = sid;

	// chips
	ui.subjectChips.innerHTML = '';
	// 미분류 chip
	const unc = document.createElement('button');
	unc.type = 'button';
	unc.className = 'chip' + (sid === '' ? ' active' : '');
	unc.innerHTML = `<span class="dot" style="background: rgba(255,255,255,0.22)"></span><span>미분류</span>`;
	unc.addEventListener('click', () => {
		setActiveSubject('');
		if (!App.runtime.running) startTimer();
	});
	ui.subjectChips.appendChild(unc);

	App.store.subjects.forEach(s => {
		const chip = document.createElement('button');
		chip.type = 'button';
		chip.className = 'chip' + (s.id === sid ? ' active' : '');
		chip.innerHTML = `<span class="dot" style="background:${s.color}"></span><span>${escapeHtml(s.name)}</span>`;
		chip.addEventListener('click', () => {
			setActiveSubject(s.id);
			// 열품타 느낌: 과목 선택 시 바로 측정 시작(정지 상태일 때)
			if (!App.runtime.running) startTimer();
		});
		ui.subjectChips.appendChild(chip);
	});
	maskChipbar();

	// mode subject select enable/disable
	const mode = App.store.settings.viewMode || 'total';
	ui.subjectSelect.disabled = (mode !== 'subject');
}

export function renderHUD() {
	// goal progress

	const nowTs = Date.now();
	const dk = dateKey(nowTs);
	const day = ensureDay(dk);
	const goal = App.store.settings.dailyGoalMs || 0;
	const totalMs = (day.totalMs || 0) + (App.runtime.running && App.runtime.lastTs ? (nowTs - App.runtime.lastTs) : 0);
	const totalSubjectMs = (day.subjects?.[App.runtime.activeSubjectId || ''] || 0) + (App.runtime.running && App.runtime.lastTs ? (nowTs - App.runtime.lastTs) : 0);

	const mode = App.store.settings.viewMode || 'total';
	ui.studyTime.textContent = fmtHMS((mode === 'total') ? totalMs : totalSubjectMs);

	if (goal > 0) {
		const pct = clamp((totalMs / goal) * 100, 0, 100);
		ui.goalBarFill.style.width = `${pct}%`;
		ui.goalProgressBar.style.width = `${pct}%`;
		ui.goalProgressText.textContent = `${Math.floor(pct)}% · ${fmtHMS(totalMs)} / ${fmtHMS(goal)}`;
		ui.kpiTodaySub.textContent = `목표 ${fmtHMS(goal)} · ${Math.min(100, Math.floor((totalMs/goal)*100))}%`;

		if (totalMs >= goal) ui.studyHud.classList.add('goal-hit');
		else ui.studyHud.classList.remove('goal-hit');
	} else {
		ui.goalBarFill.style.width = `0%`;
		ui.goalProgressBar.style.width = `0%`;
		ui.goalProgressText.textContent = '목표 없음';
		ui.studyHud.classList.remove('goal-hit');
	}

	// goal inputs
	ui.goalNow.textContent = goal > 0 ? fmtHMS(goal) : '목표 없음';
}

// ---------- Panel render ----------
export function renderPanel() {
	ui.panelSubtitle.textContent = `${dateKey()} · 오프라인`;

	switch (App.store.settings.panelTab) {
		case 'stats':
			renderStats(); break;
		case 'calendar':
			renderCalendar(); break;
		case 'subjects':
			renderSubjects(); break;
		case 'goal':
			renderGoal(); break;
	}
}

function renderStats() {
	const _p = App.store.settings.statsPeriod || 'today';
	ui.periodTodayBtn.classList.toggle('active', _p === 'today');
	ui.periodWeekBtn.classList.toggle('active', _p === 'week');
	ui.periodMonthBtn.classList.toggle('active', _p === 'month');
	
	/* kpi */
	const todayAgg = aggregatePeriod('today');
	const weekAgg = aggregatePeriod('week');
	const monthAgg = aggregatePeriod('month');
	const goal = App.store.settings.dailyGoalMs || 0;

	ui.kpiToday.textContent = fmtHMS(todayAgg.totalMs);
	ui.kpiTodaySub.textContent = goal > 0
		? `목표 ${fmtHMS(goal)} · ${Math.min(100, Math.floor((todayAgg.totalMs/goal)*100))}%`
		: '목표 없음';

	ui.kpiWeek.textContent = fmtHMS(weekAgg.totalMs);
	ui.kpiWeekSub.textContent = `평균 ${fmtHMS(weekAgg.avgAllMs)}`;

	ui.kpiMonth.textContent = fmtHMS(monthAgg.totalMs);
	ui.kpiMonthSub.textContent = `평균 ${fmtHMS(monthAgg.avgAllMs)}`;

	// focus info (overall best, and this week best)
	const bestAll = App.store.meta.bestFocusMs || 0;
	const bestWeek = weekAgg.longestFocusMs || 0;
	ui.focusInfo.textContent = `최장 집중 ${fmtHMS(Math.max(bestWeek, bestAll))}`;

	/* breakdown */
	const agg = aggregatePeriod(App.store.settings.statsPeriod || 'today');
	const total = agg.totalMs || 0;
	const entries = [];

	// subjects from current list first
	App.store.subjects.forEach(s => {
		const ms = agg.perSubject[s.id] || 0;
		entries.push({ id: s.id, name: s.name, ms, color: s.color, exists: true });
	});

	// include deleted subjects that still have time
	for (const sid of Object.keys(agg.perSubject)) {
		if (sid === '') continue;
		if (!App.store.subjects.some(s => s.id === sid)) {
			const ms = agg.perSubject[sid] || 0;
			if (ms > 0) entries.push({ id: sid, name: '삭제된 과목', ms, color: 'rgba(255,255,255,0.25)', exists: false });
		}
	}

	// unclassified
	const un = agg.perSubject[''] || 0;
	if (un > 0) entries.push({ id: '', name: '미분류', ms: un, color: 'rgba(255,255,255,0.22)', exists: true });

	// sort
	entries.sort((a,b)=> b.ms - a.ms);

	ui.breakdownList.innerHTML = '';
	if (entries.every(e => e.ms <= 0)) {
		const empty = document.createElement('div');
		empty.className = 'item';
		empty.innerHTML = `<div class="flex-row"><div class="item-name">기록이 없어요</div><div class="item-time">00:00:00</div></div>`;
		ui.breakdownList.appendChild(empty);
		return;
	}

	entries.forEach(e => {
		if (e.ms <= 0) return;
		const pct = total > 0 ? Math.min(100, (e.ms / total) * 100) : 0;
		const item = document.createElement('div');
		item.className = 'item';
		item.innerHTML = `
<div class="flex-row">
	<div class="item-name" title="${escapeHtml(e.name)}">
		<span style="display:inline-flex; align-items:center; gap:8px; min-width:0;">
			<span class="small-swatch" style="background:${e.color};"></span>
			<span class="item-actual-name">${escapeHtml(e.name)}</span>
		</span>
	</div>
	<div class="item-time">${fmtHMS(e.ms)}</div>
</div>
<div class="bar"><div style="width:${pct.toFixed(1)}%; background:${e.color};"></div></div>
		`;
		ui.breakdownList.appendChild(item);
	});

	/* weekday bars */
	const ws = startOfWeek(Date.now());
	const labels = ['월','화','수','목','금','토','일'];
	const totals = Array.from({length:7}, (_,i)=> getDayTotalMs(dateKey(ws + i*86400000)));
	const max = Math.max(1, ...totals);

	ui.weekdayBars.innerHTML = '';
	labels.forEach((lab, i) => {
		const v = totals[i];
		const pct = Math.round((v / max) * 100);
		const wrap = document.createElement('div');
		wrap.className = 'week-bar' + (v <= 0 ? ' zero' : '');
		wrap.innerHTML = `<div class="barcol"><div style="height:${pct}%"></div></div><div class="wlabel">${lab}</div>`;
		ui.weekdayBars.appendChild(wrap);
	});
}

function aggregatePeriod(period) {
	const now = Date.now();
	let keys;
	let label;

	if (period === 'today') {
		const dk = dateKey();
		keys = [dk];
		label = dk;
	} else if (period === 'week') {
		const ws = startOfWeek(now);
		keys = Array.from({length:7}, (_,i)=> dateKey(ws + i*86400000));
		label = `${keys[0]} ~ ${keys[6]}`;
	} else { // month
		const ms = startOfMonth(now);
		const dim = daysInMonth(now);
		keys = Array.from({length:dim}, (_,i)=> dateKey(ms + i*86400000));
		const d = new Date(ms);
		label = `${d.getFullYear()}-${pad2(d.getMonth()+1)}`;
	}

	const perSubject = {}; // id -> ms
	let total = 0;
	let studiedDays = 0;
	let longest = 0;

	keys.forEach(dk => {
		const day = App.store.days[dk];
		const t = day?.totalMs || 0;
		total += t;
		if (t > 0) studiedDays += 1;
		longest = Math.max(longest, day?.longestFocusMs || 0);
		if (day?.subjects) {
			for (const [sid, ms] of Object.entries(day.subjects)) {
				perSubject[sid] = (perSubject[sid] || 0) + (ms || 0);
			}
		}
	});

	const daysCount = keys.length;
	const avgAll = total / Math.max(1, daysCount);

	return { period, label, keys, totalMs: total, perSubject, longestFocusMs: longest, avgAllMs: avgAll, studiedDays };
}

function renderCalendar() {
	// dow header once
	if (!ui.calDow.dataset.built) {
		const dows = ['M','T','W','T','F','S','S'];
		ui.calDow.innerHTML = '';
		dows.forEach(d => {
			const el = document.createElement('div');
			el.className = 'cal-dow';
			el.textContent = d;
			ui.calDow.appendChild(el);
		});
		ui.calDow.dataset.built = '1';
	}

	const monthTs = App.store.settings.calendarMonthTs || startOfMonth(Date.now());
	const d = new Date(monthTs);
	const year = d.getFullYear();
	const month = d.getMonth(); // 0-based
	ui.calTitle.textContent = `${year}-${pad2(month+1)}`;

	const first = new Date(year, month, 1);
	const firstDow = first.getDay(); // 0 Sun
	const offset = (firstDow === 0 ? 6 : firstDow - 1); // Monday=0
	const dim = new Date(year, month+1, 0).getDate();

	// grid cells
	ui.calGrid.innerHTML = '';
	const totalCells = Math.ceil((offset + dim) / 7) * 7;

	const todayKey = dateKey();

	for (let i = 0; i < totalCells; i++) {
		const dayNum = i - offset + 1;
		if (dayNum < 1 || dayNum > dim) {
			const blank = document.createElement('div');
			blank.style.opacity = '0';
			ui.calGrid.appendChild(blank);
			continue;
		}

		const cellDate = new Date(year, month, dayNum);
		cellDate.setHours(0,0,0,0);
		const dk = dateKey(cellDate.getTime());
		const total = getDayTotalMs(dk);

		const cell = document.createElement('button');
		cell.type = 'button';
		cell.className = 'cal-day' + (total <= 0 ? ' off' : '') + (dk === todayKey ? ' today' : '');
		cell.innerHTML = `<div class="dnum">${dayNum}</div><div class="dtime">${total > 0 ? fmtHMS(total) : ''}</div>`;
		if (total <= 0) cell.setAttribute('tabindex', '-1');
		if (total > 0 || dk === todayKey) {
			cell.addEventListener('click', () => openDayDetail(dk));
		} else {
			// off day: do nothing
		}
		ui.calGrid.appendChild(cell);
	}
}

function renderSubjects() {
	ui.subjectsManageList.innerHTML = '';
	if (App.store.subjects.length === 0) {
		const empty = document.createElement('div');
		empty.className = 'item';
		empty.innerHTML = `<div class="flex-row"><div class="item-name">과목이 없어요</div><div class="item-time">^v^</div></div>`;
		ui.subjectsManageList.appendChild(empty);
		return;
	}

	App.store.subjects
		.slice()
		.sort((a,b)=> (a.createdAt||0) - (b.createdAt||0))
		.forEach(s => {
			let total = 0;
			for (const dk of Object.keys(App.store.days)) {
				const d = App.store.days[dk];
				total += (d.subjects?.[s.id] || 0);
			}
			const row = document.createElement('div');
			row.className = 'flex-row msub';
			row.innerHTML = `
<div class="flex-row">
	<span class="swatch" style="background:${s.color}"></span>
	<div class="msub-name" title="${escapeHtml(s.name)}">${escapeHtml(s.name)}</div>
</div>
<div class="flex-row">
	<div class="msub-time">${fmtHMS(total)}</div>
	<button class="icon-btn" aria-label="Edit" style="width:34px;height:34px;border-radius:14px;">
		<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
			<path d="M4 20H8L18.5 9.5C19.3 8.7 19.3 7.4 18.5 6.6L17.4 5.5C16.6 4.7 15.3 4.7 14.5 5.5L4 16V20Z"/>
		</svg>
	</button>
</div>
			`;
			const editBtn = row.querySelector('button[aria-label="Edit"]');
			editBtn.addEventListener('click', () => openSubjectModal('edit', s.id));
			ui.subjectsManageList.appendChild(row);
		});
}

function renderGoal() {
	const goal = App.store.settings.dailyGoalMs || 0;
	ui.goalHours.value = Math.floor(goal / 3600000);
	ui.goalMinutes.value = Math.floor((goal % 3600000) / 60000);
	ui.goalNow.textContent = goal > 0 ? fmtHMS(goal) : '목표 없음';
}

export function renderAll() {
	renderHUDSubjects();
	renderHUD();
	renderPanel();
}