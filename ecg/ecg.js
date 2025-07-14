/***************** ECG Live (BPM + Pause + CSV + Reset + Smooth) *****************/
const SERVICE = 0x180D;
const CHAR    = 0x2A37;

/* -------- 전역 상태 -------- */
let chart, x = 0;
let baseline = 0, calCnt = 0, lastPeak = 0;
let isPaused = false;
const buffer = [];                    // [{t, v}]
const MAX_MS = 10 * 60 * 1000;        // 10 min
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

/* -------- 리셋 함수 -------- */
function resetSession() {
  buffer.length = 0; x = 0; baseline = 0; calCnt = 0; lastPeak = 0; t0 = 0;
  chart.data.labels.length = 0;
  chart.data.datasets[0].data.length = 0;
  chart.update('none');
  btnDL.disabled = true; btnClear.disabled = true;
  elBpm.textContent = '-- BPM';
  elTimer.textContent = '(0 s)';
}

/* -------- Connect -------- */
btnConnect.onclick = async () => {
  try {
    const dev = await navigator.bluetooth.requestDevice({
      filters:[{name:'ECG_R4'}], optionalServices:[SERVICE]});
    const server = await dev.gatt.connect();
    await new Promise(r=>setTimeout(r,100));
    const chr = await (await server.getPrimaryService(SERVICE))
                    .getCharacteristic(CHAR);

    initChart();
    isPaused = false; btnPause.textContent = '⏸ Pause';
    chr.startNotifications().then(c=>{
      c.addEventListener('characteristicvaluechanged', e=>{
        const v = e.target.value.getUint16(0, true);
        pushData(v);
      });
    });
    setStatus('Connected');
  } catch(e){ setStatus('Error: '+e.message); }
};

/* -------- Pause / Resume -------- */
btnPause.onclick = () => {
  isPaused = !isPaused;
  btnPause.textContent = isPaused ? '▶ Resume' : '⏸ Pause';
};

/* -------- CSV 다운로드 -------- */
btnDL.onclick = () => {
  const csv = 'ms,adc\n' + buffer.map(r => `${r.t},${r.v}`).join('\n');
  const blob = new Blob([csv], {type:'text/csv'});
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url;
  a.download = `ecg_${new Date().toISOString().replace(/[:.]/g,'-')}.csv`;
  a.click(); URL.revokeObjectURL(url);

  /* 저장 후 자동 리셋 */
  resetSession();
};

/* -------- Clear 버튼 -------- */
btnClear.onclick = () => resetSession();

/* -------- 차트 초기화 -------- */
function initChart(){
  chart = new Chart($('chart'), {
    type:'line',
    data:{labels:[],datasets:[{
      label:'ADC',
      data:[],
      borderWidth:1,
      pointRadius:0,          // 점 숨기기 → 덜 빽빽
      tension:0.3             // 곡선 스무딩
    }]},
    options:{animation:false, scales:{x:{display:false}}}
  });
  resetSession();
}

/* -------- 데이터 처리 -------- */
function pushData(v){
  if(isPaused) return;

  const d = chart.data.datasets[0].data;
  d.push(v); chart.data.labels.push(x++);
  if(d.length > 500){ d.shift(); chart.data.labels.shift(); }

  /* baseline 계산: 처음 1초 평균 */
  if(calCnt < 100){ baseline += v; calCnt++; return; }
  if(calCnt === 100){ baseline /= 100; calCnt++; }

  /* BPM 계산 (단순 피크 검출) */
  const thr = baseline + 80;
  const n = d.length;
  if(n > 2){
    const a = d[n-3], b = d[n-2], c = d[n-1];
    if(b > a && b > c && b > thr){
      const now = Date.now();
      if(lastPeak){
        const bpm = 60000 / (now - lastPeak);
        elBpm.textContent = bpm.toFixed(0) + ' BPM';
      }
      lastPeak = now;
    }
  }
  chart.update('none');

  /* 버퍼 & 타이머 & 자동정지 */
  const now = Date.now();
  if(!t0) t0 = now;
  const dt = now - t0;
  elTimer.textContent = '(' + (dt/1000|0) + ' s)';
  buffer.push({t: dt, v});
  if(buffer.length >= 60){
    btnDL.disabled = false;
    btnClear.disabled = false;
  }
  if(dt >= MAX_MS){
    isPaused = true;
    btnPause.textContent = '▶ Resume';
  }
}

/* -------- 상태 표시 -------- */
const setStatus = txt => elStatus.textContent = txt;
