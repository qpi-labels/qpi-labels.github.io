const SERVICE     = 0x180D;
const CHARACTERISTIC = 0x2A37;
let chart;
let x = 0;
let lastPeak = 0

document.getElementById('connectBtn').onclick = async () => {
  try {
    const dev = await navigator.bluetooth.requestDevice({
      filters: [{ name: 'ECG_R4' }],
      optionalServices: [SERVICE],
    });
    const chr = await (await dev.gatt.connect())
                    .getPrimaryService(SERVICE)
                    .then(s => s.getCharacteristic(CHARACTERISTIC));

    initChart();
    await chr.startNotifications();
    chr.addEventListener('characteristicvaluechanged', e => {
      const v = e.target.value.getUint16(0, true);
      pushData(v);
    });
    setStatus('Connected');
  } catch (e) { setStatus('Error: ' + e); }
};

function initChart() {
  chart = new Chart(
    document.getElementById('chart'),
    { type: 'line',
      data:{labels:[],datasets:[{data:[],borderWidth:1}]},
      data:{labels:[],datasets:[{label:'ADC',data:[],borderWidth:1}]},
      options: { animation: false, scales: { x: { display: false } } } }
  );
}
function pushData(val) {
  const d = chart.data.datasets[0].data;
  d.push(val); if (d.length>500) d.shift();
  d.push(val); chart.data.labels.push(x++);
  if (d.length>500) { d.shift(); chart.data.labels.shift(); }


  /* ─ 피크(맥박) 탐지 ─ 매우 단순 방법:
       ▸ 이번 값이 직전 두 값보다 크고
       ▸ 값이 2000(10-bit 기준) 이상일 때만 심박으로 판단            */
  if (d.length > 2) {
      const a = d[d.length-3], b = d[d.length-2], c = d[d.length-1];
      if (b > a && b > c && b > 2000) {
          const now = Date.now();
          if (lastPeak) {
              const bpm = 60000 / (now - lastPeak);
              document.getElementById('bpm').textContent =
                  bpm.toFixed(0) + ' BPM';
          }
          lastPeak = now;
      }
  }
  chart.update('none');
}
const setStatus = txt => document.getElementById('status').textContent = txt;
