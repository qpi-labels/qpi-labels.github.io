/***************** ECG Live (BPM + Pause + CSV + Reset + Filters) *****************/
const SERVICE = 0x180D;
const CHAR    = 0x2A37;
const FS      = 100;                 // UNO R4에서 100 Hz로 보낸다고 가정

/* -------- 전역 상태 -------- */
let chart;                           // Chart.js 인스턴스
let x = 0, baseline = 0, calCnt = 0; // baseline 계산용
let isPaused = false;
const buffer = [];                   // [{t, v}] - CSV 저장용 (raw 값)
const MAX_MS = 10 * 60 * 1000;       // 10 min
let t0 = 0;                          // 세션 시작 시각(ms)

// BPM 관련 상태
let sampleIndex   = 0;               // 들어온 전체 샘플 카운트
let lastPeakTime  = 0;               // 마지막 R-peak 시각(ms)
let rrMs          = [];              // 최근 RR 간격(ms) 배열

// 필터 상태 (high-pass + moving average)
let hpPrevX = 0, hpPrevY = 0;
const SMOOTH_N = 3;
const smoothBuf = new Float32Array(SMOOTH_N);
let smoothIdx = 0;

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
function initChart () {
  const canvas = $('chart');

  // 이미 Chart 인스턴스가 있으면 제거
  const oldChart = Chart.getChart(canvas);
  if (oldChart) oldChart.destroy();

  chart = new Chart(canvas, {
    type : 'line',
    data : {
      labels: [],
      datasets: [{
        label       : 'ADC (filtered)',
        data        : [],
        borderWidth : 1,
        pointRadius : 0,
        tension     : 0.3
      }]
    },
    options : {
      animation : false,
      scales    : { x: { display:false } }
    }
  });
}

/* -------- 세션 리셋 -------- */
function resetSession(hard = false) {
  buffer.length = 0;
  x = baseline = calCnt = 0;
  t0 = 0;
  isPaused = false;

  // BPM / 필터 상태 초기화
  sampleIndex  = 0;
  lastPeakTime = 0;
  rrMs = [];
  hpPrevX = hpPrevY = 0;
  smoothBuf.fill(0);
  smoothIdx = 0;

  elBpm.textContent   = '-- 박/분';
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
    if (chart.options.scales.y) {
      delete chart.options.scales.y.min;
      delete chart.options.scales.y.max;
    }
    chart.update();
  }
}

/* -------- High-pass 필터 (1차 IIR) -------- */
function highpass(x) {
  const alpha = 0.995;          // 0.99~0.999 사이에서 튜닝 가능
  const y = alpha * (hpPrevY + x - hpPrevX);
  hpPrevY = y;
  hpPrevX = x;
  return y;
}

/* -------- Moving average 필터 -------- */
function smooth(v) {
  smoothBuf[smoothIdx] = v;
  smoothIdx = (smoothIdx + 1) % SMOOTH_N;
  let sum = 0;
  for (let i = 0; i < SMOOTH_N; i++) sum += smoothBuf[i];
  return sum / SMOOTH_N;
}

/* -------- BLE Connect -------- */
btnConnect.onclick = async () => {
  try {
    resetSession(); // 상태만 초기화 (차트는 재사용)

    const dev = await navigator.bluetooth.requestDevice({
      filters:[{ name:'ECG_R4' }],
      optionalServices:[SERVICE]
    });
    const chr = await (await (await dev.gatt.connect())
                  .getPrimaryService(SERVICE)).getCharacteristic(CHAR);

    isPaused = false;
    btnPause.textContent = '⏸ Pause';
    setStatus('Connected');

    await chr.startNotifications();
    chr.addEventListener('characteristicvaluechanged', e => {
      const v = e.target.value.getUint16(0, true); // raw ADC
      pushData(v);
    });

    dev.addEventListener('gattserverdisconnected', () => {
      setStatus('Disconnected');
      isPaused = true;
      btnPause.textContent = '▶ Resume';
    });
  } catch(e) {
    setStatus('Error: ' + e.message);
  }
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
  a.click();
  URL.revokeObjectURL(url);

  resetSession();          // 소프트 리셋
};

/* -------- Clear 버튼 -------- */
btnClear.onclick = () => resetSession(true);   // 하드 리셋

/* -------- 실시간 데이터 처리 -------- */
function pushData(vRaw){
  if (isPaused || !chart) return;

  sampleIndex++;

  // 필터: high-pass → moving average
  let v = vRaw;
  v = highpass(v);
  v = smooth(v);

  const D = chart.data.datasets[0].data;
  D.push(v);
  chart.data.labels.push(x++);
  if (D.length > 500) {
    D.shift();
    chart.data.labels.shift();
  }

  const now = Date.now();

  /* baseline 계산 (필터된 값 기준) */
  if (calCnt < 100) {
    baseline += v;
    calCnt++;
    chart.update('none');
    // baseline 캘리브레이션 동안도 그래프는 그리되 BPM은 건너뜀
  } else if (calCnt === 100) {
    baseline /= 100;
    calCnt++;
  }

  /* ----- BPM 계산: 동적 임계값 + 불응기 + 평균 RR ----- */
  const n = D.length;
  if (calCnt > 100 && n > 5) {
    const WIN = Math.min(200, n);      // 최근 2초(200 샘플) 사용
    let sum = 0;
    for (let i = n - WIN; i < n; i++) sum += D[i];
    const mean = sum / WIN;

    let varSum = 0;
    for (let i = n - WIN; i < n; i++) {
      const d = D[i] - mean;
      varSum += d * d;
    }
    const std = Math.sqrt(varSum / WIN);
    const thr = mean + 1.0 * std;      // k=1.0~1.5 사이에서 튜닝

    // 3포인트 피크 검출 + 0.3초 불응기
    const a = D[n-3], b = D[n-2], c = D[n-1];
    const MIN_RR_MS = 300;

    if (b > a && b > c && b > thr && now - lastPeakTime > MIN_RR_MS) {
      if (lastPeakTime) {
        const rr = now - lastPeakTime; // ms
        rrMs.push(rr);
        if (rrMs.length > 10) rrMs.shift();  // 최근 10개만 유지

        // 평균 RR → BPM
        const avgRR = rrMs.reduce((s, x) => s + x, 0) / rrMs.length;
        const bpm = 60000 / avgRR;
        elBpm.textContent = bpm.toFixed(0) + ' 박/분';
      }
      lastPeakTime = now;
    }
  }

  chart.update('none');

  /* 버퍼 & 타이머 & 자동정지 */
  if (!t0) t0 = now;
  const dt = now - t0;
  elTimer.textContent = `(${dt/1000|0} s)`;

  // CSV 저장용 버퍼는 raw 값 사용
  buffer.push({t:dt, v:vRaw});
  if (buffer.length >= 60) {
    btnDL.disabled    = false;
    btnClear.disabled = false;
  }
  if (dt >= MAX_MS) {
    isPaused = true;
    btnPause.textContent = '▶ Resume';
  }
}

/* -------- 상태 표시 -------- */
const setStatus = txt => elStatus.textContent = txt;

/* -------- 초기 로딩 -------- */
initChart();
resetSession();
