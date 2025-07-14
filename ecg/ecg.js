/***************** ECG Live (BPM + Pause + CSV) *****************/
const SERVICE = 0x180D;          // Heart-Rate Service UUID
const CHAR    = 0x2A37;          // Measurement Char. UUID

/* -------- 전역 상태 -------- */
let chart, x = 0;                // sample index for chart
let baseline = 0, calCnt = 0;    // baseline calc
let lastPeak = 0;                // ms of previous peak
let isPaused = false;            // ⏸ / ▶ 상태
const buffer = [];               // [{t, v}] raw log
const MAX_MS = 10 * 60 * 1000;   // 10 min auto-stop (바꾸면 됨)
let t0 = 0;                      // session start ms

/* -------- UI 엘리먼트 -------- */
const $ = id => document.getElementById(id);
const btnConnect = $('connectBtn');
const btnPause   = $('pauseBtn');
const btnDL      = $('dlBtn');
const elStatus   = $('status');
const elBpm      = $('bpm');
const elTimer    = $('timer');

/* -------- Connect 버튼 -------- */
btnConnect.onclick = async () => {
  try {
    const dev = await navigator.bluetooth.requestDevice({
      filters:[{name:'ECG_R4'}], optionalServices:[SERVICE]
    });
    const server = await dev.gatt.connect();
    await new Promise(r=>setTimeout(r,100));      // 초기화 여유
    const chr = await (await server.getPrimaryService(SERVICE))
                     .getCharacteristic(CHAR);

    initChart();           // 차트 생성
    isPaused = false; btnPause.textContent = '⏸ Pause';
    chr.startNotifications().then(c=>{
      c.addEventListener('characteristicvaluechanged', e=>{
        const v = e.target.value.getUint16(0,true);
        pushData(v);
      });
    });
    setStatus('Connected');
  } catch(e){ setStatus('Error: '+e.message); }
};

/* -------- Pause / Resume 버튼 -------- */
btnPause.onclick = () => {
  isPaused = !isPaused;
  btnPause.textContent = isPaused ? '▶ Resume' : '⏸ Pause';
};

/* -------- CSV 다운로드 -------- */
btnDL.onclick = () => {
  const csv = 'ms,adc\n' + buffer.map(r=>`${r.t},${r.v}`).join('\n');
  const blob = new Blob([csv], {type:'text/csv'});
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url;
  a.download = `ecg_${new Date().toISOString().replace(/[:.]/g,'-')}.csv`;
  a.click(); URL.revokeObjectURL(url);
};

/* -------- 차트 초기화 -------- */
function initChart(){
  chart = new Chart($('chart'), {
    type:'line',
    data:{labels:[],datasets:[{label:'ADC',data:[],borderWidth:1}]},
    options:{animation:false, scales:{x:{display:false}}}
  });
  // 세션 변수 리셋
  x=0; baseline=0; calCnt=0; lastPeak=0; buffer.length=0; t0=0;
  btnDL.disabled = true; elTimer.textContent='(0 s)'; elBpm.textContent='-- BPM';
}

/* -------- 샘플 푸시 & BPM 계산 -------- */
function pushData(v){
  if(isPaused) return;

  const d = chart.data.datasets[0].data;
  d.push(v); chart.data.labels.push(x++);
  if(d.length>500){ d.shift(); chart.data.labels.shift(); }

  /* baseline 계산 (처음 1초) */
  if(calCnt<100){ baseline+=v; calCnt++; return; }
  if(calCnt===100){ baseline/=100; calCnt++; }

  const thresh = baseline + 80;   // 환경에 따라 ± 조정
  const n = d.length;
  if(n>2){
    const a=d[n-3], b=d[n-2], c=d[n-1];
    if(b>a && b>c && b>thresh){
      const now = Date.now();
      if(lastPeak){
        const bpm = 60000/(now-lastPeak);
        elBpm.textContent = bpm.toFixed(0)+' BPM';
      }
      lastPeak = now;
    }
  }
  chart.update('none');

  /* 로그 버퍼 + 타이머 + 자동정지 */
  const now = Date.now();
  if(!t0) t0 = now;
  const dt = now - t0;
  elTimer.textContent = '('+(dt/1000|0)+' s)';
  buffer.push({t:dt, v});
  if(buffer.length>=60) btnDL.disabled = false;    // 0.6 s 이상 저장되면 다운로드 ON
  if(dt>=MAX_MS){ isPaused=true; btnPause.textContent='▶ Resume'; }
}

/* -------- 상태 텍스트 -------- */
const setStatus = txt => elStatus.textContent = txt;
