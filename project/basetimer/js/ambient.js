/* import "../style/ambient.css"; */

const LAT = 36.5, LON = 127.2;
let multiverse = 0;
const root = document.documentElement.style;
const skyLayer = document.getElementById('skyLayer');
const clockEl = document.getElementById('clockT');
const timeRangeEl = document.getElementById('timeRange');
const autoCheckEl = document.getElementById('autoCheck');

// --- 성능 보간 변수 ---
const perfToggleEl = document.getElementById('perfToggle');
let isPerfMode = localStorage.getItem('qpi_perf_mode_v2') === 'true';
let frameCounter = -1; // 렌더링 스로틀링용, 첫 프레임은 무조건 렌더

const flareEls = {
	'h-1': document.getElementById('h-1'), 'r-1': document.getElementById('r-1'),
	'g-1': document.getElementById('g-1'), 'g-2': document.getElementById('g-2'),
	't-1': document.getElementById('t-1'), 'mg-1': document.getElementById('mg-1'),
	'mh-1': document.getElementById('mh-1'),
	'sunFC': document.getElementById('sunFlareCont'),
	'moonFC': document.getElementById('moonFlareCont')
};

// 초기 성능 설정 적용
perfToggleEl.checked = isPerfMode;
if(isPerfMode) document.body.classList.add('perf-active');

perfToggleEl.onchange = (e) => {
	isPerfMode = e.target.checked;
	localStorage.setItem('qpi_perf_mode_v2', isPerfMode);
	if(isPerfMode) document.body.classList.add('perf-active');
	else document.body.classList.remove('perf-active');
};

let manualMinutes = 720, lastTimestamp = performance.now(), currentSpeed = 1;
let isCatchingUp = false, catchUpStartMinutes = 0, catchUpStartTime = 0, catchUpStartMultiverse = 0;
const CATCHUP_DURATION = 2000;

let cachedSunTimes = null, lastCachedDateStr = "";

function getSunTimes(date) {
	const dateStr = date.toDateString();
	if (cachedSunTimes && lastCachedDateStr === dateStr) return cachedSunTimes;
	const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
	const rad = Math.PI / 180;
	const gamma = 2 * Math.PI / 365 * (dayOfYear - 1);
	const eqtime = 229.18 * (0.000075 + 0.001868 * Math.cos(gamma) - 0.032077 * Math.sin(gamma) - 0.014615 * Math.cos(2*gamma) - 0.040849 * Math.sin(2*gamma));
	const decl = 0.006918 - 0.399912 * Math.cos(gamma) + 0.070257 * Math.sin(gamma);
	const ha_rad = Math.acos(Math.cos(90.833 * rad) / (Math.cos(LAT * rad) * Math.cos(decl)) - Math.tan(LAT * rad) * Math.tan(decl));
	const ha = ha_rad / rad;
	lastCachedDateStr = dateStr;
	cachedSunTimes = { sunrise: 720 - 4 * (LON + ha) - eqtime + 540, sunset: 720 - 4 * (LON - ha) - eqtime + 540 };
	return cachedSunTimes;
}

const starCanvas = document.getElementById('starCanvas'), sCtx = starCanvas.getContext('2d');
function initStars() {
	let seed = 277;
	const random = () => { seed = (1664525 * seed + 1013904223) % 4294967296; return seed / 4294967296; };
	starCanvas.width = 4000; starCanvas.height = 4000;
	sCtx.fillStyle = "#fff";
	for(let i=0; i<8000; i++) {
		sCtx.globalAlpha = Math.random(); 
		sCtx.beginPath(); sCtx.arc(random()*4000, random()*4000, random()*1.3+0.3, 0, Math.PI*2); sCtx.fill();
	}
	sCtx.globalAlpha = 1.0;
	sCtx.beginPath(); sCtx.arc(2000, 2000, 1.6, 0, Math.PI*2); sCtx.fill(); 
}
initStars();

function updateOptics(sx, sy, alt, isMoon = false) {
	const cont = isMoon ? flareEls.moonFC : flareEls.sunFC;
	const fadeStart = 0; 
	const visibleRange = 0.3; 
	const rawOpacity = (alt - fadeStart) / visibleRange;
	const finalOpacity = Math.max(0, Math.min(1, rawOpacity));
	
	const maxOpacity = isMoon ? 0.4 : 0.95;
	cont.style.opacity = finalOpacity * maxOpacity;
	
	if (finalOpacity <= 0) return;

	const dx = 50 - sx, dy = 50 - sy;
	const setFP = (id, s) => { 
		const el = flareEls[id];
		if(el){
			el.style.transform = `translate(-50%, -50%) translate(${sx + dx * s}vw, ${sy + dy * s}vh)`;
		}
	};

	if(!isMoon) {
		setFP('h-1', 0.5); setFP('r-1', 1.3); setFP('g-1', 1.6); setFP('g-2', 1.1); setFP('t-1', 0.25);
	} else {
		setFP('mg-1', 1.2); setFP('mh-1', 0.5);
	}
}

let lastZenith = "", lastHorizon = "";

function updateSky(m) {
	const mG = (m % 1440 + 1440) % 1440; 
	const solar = getSunTimes(new Date());
	
	const dawnStart = solar.sunrise - 135;
	const preSunset = solar.sunset - 135;
	const sunsetEnd = solar.sunset + 30;
	
	const kf = [
		{ m: -1440, z: [5, 10, 25], hz: [10, 20, 35] },
		{ m: dawnStart, z: [5, 10, 25], hz: [10, 20, 35] }, 
		{ m: solar.sunrise, z: [40, 80, 140], hz: [255, 150, 100] }, 
		{ m: (solar.sunrise + solar.sunset)/2, z: [25, 90, 180], hz: [180, 230, 255] },
		{ m: preSunset, z: [25, 90, 180], hz: [180, 230, 255] },
		{ m: solar.sunset, z: [20, 30, 80], hz: [245, 125, 75] }, 
		{ m: solar.sunset + 15, z: [10, 15, 40], hz: [60, 30, 60] }, 
		{ m: sunsetEnd, z: [5, 10, 25], hz: [10, 20, 35] }, 
		{ m: 1440, z: [5, 10, 25], hz: [10, 20, 35] }
	];
	
	let zenith = 'rgb(5, 10, 25)', horizon = 'rgb(10, 20, 35)';
	let brightness = 15;

	for(let i=0; i<kf.length-1; i++){
		if(mG >= kf[i].m && mG < kf[i+1].m){
			const t = (mG - kf[i].m) / (kf[i+1].m - kf[i].m);
			const l = (c1, c2) => c1 + (c2-c1)*t;
			const r = Math.round(l(kf[i].hz[0], kf[i+1].hz[0]));
			const g = Math.round(l(kf[i].hz[1], kf[i+1].hz[1]));
			const b = Math.round(l(kf[i].hz[2], kf[i+1].hz[2]));
			const zr = Math.round(l(kf[i].z[0], kf[i+1].z[0]));
			const zg = Math.round(l(kf[i].z[1], kf[i+1].z[1]));
			const zb = Math.round(l(kf[i].z[2], kf[i+1].z[2]));
			zenith = `rgb(${zr}, ${zg}, ${zb})`;
			horizon = `rgb(${r}, ${g}, ${b})`;
			if (multiverse) {
				zenith = `oklch(from ${zenith} l c calc(h + ${multiverse}))`;
				horizon = `oklch(from ${horizon} l c calc(h + ${multiverse}))`;
			}
			brightness = (r + g + b) / 3;
			break;
		}
	}
	
	let tContrast = Math.min(1, Math.max(0, (brightness - 22) / 200));
	if (tContrast < 0.5) tContrast *= 0.5;
	if (tContrast > 0.5) tContrast = tContrast * 0.5 + 0.5;
	const dark_colors = [
		20, 25, 35, 0.65,
		255, 255, 255,
		255, 255, 255,
		0x90, 0xca, 0xf9,
		0x00, 0x33, 0x54,
		255, 0.1,
		255, 255, 255, 0.08
	]
	const bright_colors = [
		235, 245, 255, 0.45,
		0, 20, 40,
		0, 20, 50,
		0x00, 0x7a, 0xff,
		0xfa, 0xfa, 0xfa,
		55, 0.2,
		235, 245, 255, 0.16
	]
	const colors = dark_colors.map((e,i) => (e*(1-tContrast) + bright_colors[i]*tContrast));
	root.setProperty('--glass-bg', `rgba(${colors[0]}, ${colors[1]}, ${colors[2]}, ${colors[3]})`);
	root.setProperty('--text-main', `rgb(${colors[4]}, ${colors[5]}, ${colors[6]})`);
	root.setProperty('--text-sub', `rgba(${colors[7]}, ${colors[8]}, ${colors[9]}, 0.7)`);
	if (!multiverse) {
		root.setProperty('--primary', `rgb(${colors[10]}, ${colors[11]}, ${colors[12]})`)
		root.setProperty('--on-primary-container', `rgb(${colors[13]}, ${colors[14]}, ${colors[15]})`)
	} else {
		root.setProperty('--primary', `oklch(from rgb(${colors[10]}, ${colors[11]}, ${colors[12]}) l c calc(h + ${multiverse}))`);
		root.setProperty('--on-primary-container', `oklch(from rgb(${colors[13]}, ${colors[14]}, ${colors[15]}) l c calc(h + ${multiverse}))`);
	}
	root.setProperty('--glass-border', `rgba(${colors[16]}, ${colors[16]}, ${colors[16]}, ${colors[17]})`);
	root.setProperty('--glass-stack', `rgba(${colors[18]}, ${colors[19]}, ${colors[20]}, ${colors[21]})`);
	root.setProperty('--chip-bg', `rgba(${colors[16]}, ${colors[16]}, ${colors[16]}, 0.1)`);

	if (zenith !== lastZenith || horizon !== lastHorizon) {
		skyLayer.style.background = `linear-gradient(to bottom, ${zenith} 0%, ${horizon} 100%)`;
		lastZenith = zenith; lastHorizon = horizon;
	}
	
	const sunMargin = 20;
	if(mG >= solar.sunrise - sunMargin && mG <= solar.sunset + sunMargin){
		const prog = (mG - solar.sunrise) / (solar.sunset - solar.sunrise);
		const sunAlt = Math.sin(prog * Math.PI); 
		const sx = prog * 120 - 10;
		const sy = 100 - sunAlt * 90;
		root.setProperty('--sun-x', sx + 'vw'); 
		root.setProperty('--sun-y', sy + 'vh');
		root.setProperty('--atm-opacity', Math.max(0, Math.min(0.85, sunAlt * 1.2)));
		updateOptics(sx, sy, sunAlt, false);
	} else { 
		root.setProperty('--sun-y', '150vh'); 
		root.setProperty('--atm-opacity', 0); 
		flareEls.sunFC.style.opacity = 0;
	}
	
	const moonM = (mG + 720) % 1440;
	if(moonM >= solar.sunrise - 140 && moonM <= solar.sunset + 140){
		const prog = (moonM - (solar.sunrise - 120)) / ((solar.sunset + 120) - (solar.sunrise - 120));
		const alt = Math.sin(prog * Math.PI); 
		const mx = prog * 120 - 10;
		const my = 100 - alt * 90;
		root.setProperty('--moon-x', mx + 'vw'); 
		root.setProperty('--moon-y', my + 'vh');
		updateOptics(mx, my, alt, true);
	} else { 
		root.setProperty('--moon-y', '150vh'); 
		flareEls.moonFC.style.opacity = 0;
	}
	
	let sOp = 0, sMaskY = -50;
	if (mG >= solar.sunset - 180 && mG <= solar.sunset + 30) { sOp = (mG - (solar.sunset - 180)) / 210; sMaskY = -50 + (200 * sOp); } 
	else if (mG >= solar.sunrise - 60 && mG <= solar.sunrise + 180) { sOp = 1 - (mG - (solar.sunrise - 60)) / 240; sMaskY = 150 - (200 * (1 - sOp)); } 
	else if (mG > solar.sunset + 30 || mG < solar.sunrise - 60) { sOp = 1; sMaskY = 150; }
	root.setProperty('--star-opacity', Math.max(0, Math.min(1, sOp))); 
	root.setProperty('--star-mask-y', sMaskY + '%');
	root.setProperty('--star-rot', (mG/4)+'deg');
	
	const hRaw = Math.floor(mG/60), mins = Math.floor(mG%60), secs = Math.round((mG*60)%60);
	const newText = `${hRaw.toString().padStart(2,'0')}:${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;
	clockEl.textContent = newText;
}

function handleSyncToggle() { 
	if (autoCheckEl.checked) { 
		isCatchingUp = true; catchUpStartTime = performance.now(); catchUpStartMinutes = manualMinutes; catchUpStartMultiverse = multiverse;
		document.getElementById('manualSection').classList.add('disabled'); 
	} else { 
		isCatchingUp = false; document.getElementById('manualSection').classList.remove('disabled'); 
		const d = new Date(); manualMinutes = d.getHours()*60 + d.getMinutes() + d.getSeconds()/60; 
	} 
}
document.getElementById('autoCheck').addEventListener('change', handleSyncToggle);

function adjustSpeed(f) {
	let currentSign = ((currentSpeed * f) > 0) ? 1 : -1;
	currentSpeed = currentSign * Math.max(0.5, Math.min(1024, Math.abs(currentSpeed * f))); 
	document.getElementById('speedVal').textContent = currentSpeed; 
}
document.getElementById('manualSlower').addEventListener('click', () => adjustSpeed(0.5));
document.getElementById('manualFaster').addEventListener('click', () => adjustSpeed(2));
document.getElementById('manualReverse').addEventListener('click', () => adjustSpeed(-1));

function toggleInfo() { 
	const s = getSunTimes(new Date()); 
	document.getElementById('infoRise').textContent = formatMinutes(s.sunrise); 
	document.getElementById('infoSet').textContent = formatMinutes(s.sunset); 
	document.getElementById('infoDate').textContent = new Date().toLocaleDateString('ko-KR', {month:'short', day:'numeric', weekday:'short'}); 
}
document.getElementById('clock').addEventListener('click', toggleInfo);
function formatMinutes(minutes) { const mSafe = (minutes + 1440) % 1440; return `${Math.floor(mSafe/60).toString().padStart(2,'0')}:${Math.floor(mSafe%60).toString().padStart(2,'0')}`; }

timeRangeEl.oninput = function() { if (!autoCheckEl.checked) { manualMinutes = parseFloat(this.value); updateSky(manualMinutes); } };
document.getElementById("multiverseRange").oninput = function() { if (!autoCheckEl.checked) { multiverse = parseFloat(this.value); updateSky(manualMinutes); } };

function loop(now) {
	const dt = now - lastTimestamp; 
	lastTimestamp = now;
	frameCounter++;

	let m; 
	const d = new Date();
	const target = d.getHours()*60 + d.getMinutes() + d.getSeconds()/60;
	
	if (autoCheckEl.checked) {
		if (isCatchingUp) {
			let t = Math.min((now - catchUpStartTime) / CATCHUP_DURATION, 1);
			let ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
			let dist = (target - catchUpStartMinutes + 1440) % 1440; 
			if(dist > 720) dist -= 1440;
			let distm = (0 - catchUpStartMultiverse + 360) % 360;
			if (distm > 180) distm -= 360;
			m = catchUpStartMinutes + (dist * ease); 
			if (t >= 1) isCatchingUp = false; 
			manualMinutes = m;
			let mm = catchUpStartMultiverse + (distm * ease);
			multiverse = mm;
		} else { m = target; manualMinutes = m; }
	} else { 
		manualMinutes += (dt / 60000) * currentSpeed; 
		m = manualMinutes; 
	}

	// 시계와 슬라이더는 부드러움을 위해 매 프레임 업데이트
	const mG = ((m % 1440) + 1440) % 1440;
	timeRangeEl.value = mG;
	document.getElementById("multiverseRange").value = multiverse;
	const hRaw = Math.floor(mG/60), mins = Math.floor(mG%60), secs = Math.round((mG*60)%60);
	clockEl.textContent = `${hRaw.toString().padStart(2,'0')}:${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;

	requestAnimationFrame(loop);

	// 성능 모드 시 무거운 그래픽 연산 스로틀링 (30프레임당 1회)
	if (isPerfMode) {
		if (isCatchingUp || (!autoCheckEl.checked&&Math.abs(currentSpeed)>2)) {
			if (frameCounter % 2 !== 0) return;
		} else {
			if (frameCounter % 30 !== 0) return;
		}
	}
	updateSky(m);
}
requestAnimationFrame(loop);

/* ----------------------------------------------------
	1. 인공위성 / 스타링크 기능
	---------------------------------------------------- */
const satLayer = document.getElementById('satLayer');

function animateObject(isStarlink = false) {
	const solar = getSunTimes(new Date());
	const mG = (manualMinutes % 1440 + 1440) % 1440;
	let tempSunAlt = -1;
	if (mG >= solar.sunrise && mG <= solar.sunset) {
		const prog = (mG - solar.sunrise) / (solar.sunset - solar.sunrise);
		tempSunAlt = Math.sin(prog * Math.PI);
	}
	if (tempSunAlt > 0.05) return; 

	const side = Math.floor(Math.random() * 4);
	let sx, sy, ex, ey;
	if(side === 0) { sx = -15; sy = Math.random()*100; ex = 115; ey = Math.random()*100; }
	else if(side === 1) { sx = 115; sy = Math.random()*100; ex = -15; ey = Math.random()*100; }
	else if(side === 2) { sx = Math.random()*100; sy = -15; ex = Math.random()*100; ey = 115; }
	else { sx = Math.random()*100; sy = 115; ex = Math.random()*100; ey = -15; }
	const duration = (Math.random() * 20000 + 40000) / ((autoCheckEl.checked)?1:Math.min(Math.abs(currentSpeed),256));
	
	// 성능 모드 시 객체 수 최적화
	const count = isStarlink ? (isPerfMode ? 8 : 18) : 1;
	
	for (let i = 0; i < count; i++) {
		const delay = isStarlink ? i * (700 + Math.random() * 400) / ((autoCheckEl.checked)?1:Math.min(Math.abs(currentSpeed),256)) : 0; 
		setTimeout(() => {
			const sat = document.createElement('div'); sat.className = 'satellite';
			sat.style.opacity = Math.random() * 0.5 + 0.3;
			satLayer.appendChild(sat);
			const startT = performance.now();
			const move = (now) => {
				const t = (now - startT) / duration;
				if (t < 1) { sat.style.transform = `translate(${sx + (ex - sx) * t}vw, ${sy + (ey - sy) * t}vh)`; requestAnimationFrame(move); }
				else { sat.remove(); }
			};
			requestAnimationFrame(move);
		}, delay);
	}
}

setTimeout(() => {
	const satLoop = () => { animateObject(false); setTimeout(satLoop, (Math.random() * 60000 + 40000) / ((autoCheckEl.checked)?1:Math.abs(currentSpeed))); };
	const starlinkLoop = () => { animateObject(true); setTimeout(starlinkLoop, (Math.random() * 120000 + 120000) / ((autoCheckEl.checked)?1:Math.abs(currentSpeed))); };
	satLoop(); starlinkLoop();
}, 5000);

/* ----------------------------------------------------
	2. 오디오 비주얼라이저 기능
	---------------------------------------------------- */
let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let gainNode = audioCtx.createGain(); gainNode.connect(audioCtx.destination);
gainNode.gain.value = 0.25;
const links = [
	'./sound/crickets.mp3',
	'./sound/creepy_tomb.mp3',
	'./sound/so_ambient.mp3'
];
let buffers = [];
for (let e of links) {
	buffers.push(async () => {
		try { return audioCtx.decodeAudioData(await (await fetch(e)).arrayBuffer()); } catch { return null; }
	});
}
let curAudio = -1;
let curSource = null;
async function setAudio(newAudio) {
	if (curAudio === newAudio) return;
	if (curAudio !== -1) {
		try {
			curSource.stop();
			curSource.disconnect();
		} catch {}
	}
	curAudio = newAudio;
	if (newAudio === -1 || !buffers || !buffers[newAudio]) return;
	if (buffers[newAudio] instanceof Function) buffers[newAudio] = await buffers[newAudio]();
	try {
		const source = new AudioBufferSourceNode(audioCtx, {buffer: buffers[newAudio], loop: true});
		source.connect(gainNode); source.start();
		curSource = source;
	} catch {}
}
Array.from(document.getElementsByClassName('soundToggle')).forEach((e) => {
	e.onchange = function() {
		if(this.checked) {
			Array.from(document.getElementsByClassName('soundToggle')).forEach((e)=>{e.checked = false});
			this.checked = true;
			setAudio(e.value);
		} else setAudio(-1);
	};
});
document.getElementById('volumeRange').oninput = (e) => { if(gainNode) gainNode.gain.value = (e.target.value/100)**2; };

const canvas = document.getElementById('vizCanvas'), ctx = canvas.getContext('2d');
let analyser, dataArray, isVizActive = false, sampleRate = 48000, smoothHeights = [];

document.getElementById('btnViz').onclick = async () => {
	try {
		let stream = null;
		try {
			stream = await navigator.mediaDevices.getDisplayMedia({ audio: true });
		} catch {
			alert("오디오 출력을 캡처할 수 없어 기기 마이크를 사용합니다.")
			stream = await navigator.mediaDevices.getUserMedia({ audio: true });
		}
		const aCtx = new AudioContext(); sampleRate = aCtx.sampleRate;
		const src = aCtx.createMediaStreamSource(stream);
		analyser = aCtx.createAnalyser(); src.connect(analyser);
		analyser.fftSize = 1024; analyser.smoothingTimeConstant = 0.92;
		dataArray = new Uint8Array(analyser.frequencyBinCount); isVizActive = true; drawViz();
	} catch (e) { alert(`Capture failed.\n${e}`); }
};

function drawViz() {
	if (!isVizActive) return; requestAnimationFrame(drawViz);
	analyser.getByteFrequencyData(dataArray);
	canvas.width = window.innerWidth; canvas.height = 200; ctx.clearRect(0, 0, canvas.width, canvas.height);
	const bw = canvas.width / 80;
	const minFreq = 80, maxFreq = 14000, nyquist = sampleRate / 2;
	const tColor = getComputedStyle(document.documentElement).getPropertyValue('--text-main').trim();

	for (let i = 0; i < 80; i++) {
		const freq = minFreq * Math.pow(maxFreq / minFreq, i / 79);
		const dIdx = Math.floor((freq / nyquist) * dataArray.length);
		let raw = dataArray[dIdx] || 0;
		let target = (raw / 255) * canvas.height * (0.6 + (i / 80) * 0.5);
		if (!smoothHeights[i]) smoothHeights[i] = 0;
		if (target > smoothHeights[i]) smoothHeights[i] = target; else smoothHeights[i] *= 0.94;
		const h = Math.min(smoothHeights[i], canvas.height * 0.8);
		ctx.fillStyle = tColor.replace('rgb', 'rgba').replace(')', `, ${Math.max(0.08, raw/255 * 0.4)})`);
		ctx.fillRect(i * bw, canvas.height - h, bw - 1, h);
	}
}