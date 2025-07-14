/***************** ECG Live (BPM + Pause + CSV + Reset + Smooth) *****************/
const SERVICE = 0x180D;
const CHAR    = 0x2A37;

/* -------- 전역 상태 -------- */
let chart;                       // Chart.js 인스턴스
let x = 0, baseline = 0, calCnt = 0, lastPeak = 0;
let isPaused = false;
const buffer = [];               // [{t, v}]
const MAX_MS = 10 * 60 * 1000;   // 10 min
let t0 = 0;

/* -------- UI -------- */
const $  = id => document.getElementById(id);
const btnConnect = $('connectBtn');
const btnPause   = $('pauseBtn');
const btnDL      = $('dlBtn');
const btnClear   = $('clearBtn');
const elStatus   = $('status');
const elBpm      = $('bpm');
const elTimer    = $('timer');

/* -------- 차트 생성 -------- */
function initChart() {
  chart = new Chart($('chart'), {
    type : 'line',
    data : { labels: [], datasets: [{
      label       : 'ADC',
      data        : [],
      borderWidth : 1,
      pointRadius : 0,
      tension     : 0.3
    }]},
    options : {
      animation : false,
      scales    : { x: { display:false } }
    }
  });
}

/* -------- 세션 리셋 -------- */
function resetSession(hard = false) {
  buffer.length = 0;
  x = baseline = calCnt = lastPeak = 0;
  t0 = 0;

  elBpm.textContent   = '-- BPM';
  elTimer.textContent = '(0 s)';
  btnDL.disabled = btnClear.disabled = true;

  if (hard && chart) {          // Clear 버튼
    chart.destroy();
    initChart();
    return;
  }

  if (chart) {                  // 일반 리셋
    chart.data.labels = [];
    chart.data.datasets[0].data = [];
    delete chart.options.scales.y?.min;
    delete chart.options.scales.y?.max;
    chart.update();
  }
}

/* -------- BLE Connect -------- */
btnConnect.onclick = async () => {
  try {
    /* ★ 차트 새로 만들지 않고 상태만 초기화 */
    resetSession();                       // ← initChart() 삭제

    const dev = await navigator.bluetooth.requestDevice({
      filters:[{name:'ECG_R4'}], optionalServices:[SERVICE]
    });
    const chr = await (await (await dev.gatt.connect())
                  .getPrimaryService(SERVICE)).getCharacteristic(CHAR);

    isPaused = false; btnPause.textContent = '⏸ Pause';
    setStatus('Connected');

    chr.startNotifications().then(c=>{
      c.addEventListener('characteristicvaluechanged', e => {
        pushData(e.target.value.getUint16(0, true));
      });
    });

    dev.addEventListener('gattserverdisconnected',
                         () => setStatus('Disconnected'));
  } catch(e) { setStatus('Error: ' + e.message); }
};

/* -------- Pause / Resume -------- */
btnPause.onclick = () => {
  isPaused = !isPaused;
  btnPause.textContent = isPaused ? '▶ Resume' : '⏸ Pause';
};

/* -------- CSV 다운로드 -------- */
btnDL.onclick = () => {
  const csv  = 'ms,adc\n' + buffer.map(r => `${r.t},${r.v}`).join('\n');
  const blob = new Blob([csv], {type:'text/csv'});
  const url  = URL.createObjectURL(blob);

  const a = Object.assign(document.createElement('a'), {
    href:url,
    download:`ecg_${new Date().toISOString().replace(/[:.]/g,'-')}.csv`
  });
  a.click(); URL.revokeObjectURL(url);

  resetSession();          // 소프트 리셋
};

/* -------- Clear 버튼 -------- */
btnClear.onclick = () => resetSession(true);   // 하드 리셋

/* -------- 실시간 데이터 처리 -------- */
function pushData(v){
  if (isPaused || !chart) return;

  const D = chart.data.datasets[0].data;
  D.push(v); chart.data.labels.push(x++);
  if (D.length > 500) { D.shift(); chart.data.labels.shift(); }

  /* baseline 계산 */
  if (calCnt < 100) { baseline += v; calCnt++; return; }
  if (calCnt === 100){ baseline /= 100; calCnt++; }

  /* BPM 계산 */
  const thr = baseline + 80;
  const n = D.length;
  if (n > 2) {
    const a = D[n-3], b = D[n-2], c = D[n-1];
    if (b > a && b > c && b > thr) {
      const now = Date.now();
      if (lastPeak) elBpm.textContent = (60000/(now-lastPeak)).toFixed(0) + ' BPM';
      lastPeak = now;
    }
  }
  chart.update('none');

  /* 버퍼 & 타이머 & 자동정지 */
  const now = Date.now();
  if (!t0) t0 = now;
  const dt = now - t0;
  elTimer.textContent = `(${dt/1000|0} s)`;

  buffer.push({t:dt, v});
  if (buffer.length >= 60) { btnDL.disabled = btnClear.disabled = false; }
  if (dt >= MAX_MS) { isPaused = true; btnPause.textContent = '▶ Resume'; }
}

/* -------- 상태 표시 -------- */
const setStatus = txt => elStatus.textContent = txt;

/* -------- 초기 로딩 -------- */
initChart();
resetSession();
