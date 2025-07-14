/***************** ECG Live (BPM 포함) *****************/
const SERVICE = 0x180D;             // Heart-Rate Service
const CHAR    = 0x2A37;             // Measurement Char.
let chart, x = 0;                   // 샘플 번호
let baseline = 0, calCount = 0;     // 베이스라인 계산용
let lastPeak = 0;                   // 직전 피크 시각(ms)

/* ─ 연결 버튼 ─ */
document.getElementById('connectBtn').onclick = async () => {
  try {
    const dev = await navigator.bluetooth.requestDevice({
      filters:[{name:'ECG_R4'}], optionalServices:[SERVICE]});
    const server = await dev.gatt.connect();
    await new Promise(r => setTimeout(r, 100));   // 초기화 여유
    const svc = await server.getPrimaryService(SERVICE);
    const chr = await svc.getCharacteristic(CHAR);

    initChart();
    await chr.startNotifications();
    chr.addEventListener('characteristicvaluechanged', e => {
      const v = e.target.value.getUint16(0,true);
      pushData(v);
    });
    setStatus('Connected');
  } catch(e){ setStatus('Error: '+e.message); }
};

/* ─ 차트 초기화 ─ */
function initChart(){
  chart = new Chart(document.getElementById('chart'),{
    type:'line',
    data:{labels:[],datasets:[{label:'ADC',data:[],borderWidth:1}]},
    options:{animation:false, scales:{x:{display:false}}}
  });
}

/* ─ 데이터 푸시 + BPM 계산 ─ */
function pushData(v){
  const d = chart.data.datasets[0].data;
  d.push(v); chart.data.labels.push(x++);
  if(d.length>500){ d.shift(); chart.data.labels.shift(); }

  /* 1) 처음 1초(~100샘플) 평균 → baseline */
  if(calCount < 100){ baseline += v; calCount++; return; }
  if(calCount === 100){ baseline /= 100; calCount++; }

  const thresh = baseline + 80;      // 임계 = 베이스라인+80
  /* 2) 아주 단순한 피크 판정 ↓ */
  const l = d.length;
  if(l>2){
    const a=d[l-3], b=d[l-2], c=d[l-1];
    if(b>a && b>c && b>thresh){
      const now = Date.now();
      if(lastPeak){
        const bpm = 60000/(now-lastPeak);
        document.getElementById('bpm').textContent =
          bpm.toFixed(0)+' BPM';
      }
      lastPeak = now;
    }
  }
  chart.update('none');
}

/* ─ 상태 텍스트 변경 ─ */
const setStatus = t => document.getElementById('status').textContent = t;
