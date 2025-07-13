const SERVICE     = 0x180D;
const CHARACTERISTIC = 0x2A37;
let chart;

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
      data: { labels: [], datasets: [{ data: [], borderWidth: 1 }] },
      options: { animation: false, scales: { x: { display: false } } } }
  );
}
function pushData(val) {
  const d = chart.data.datasets[0].data;
  d.push(val); if (d.length > 500) d.shift();   // 5 s 버퍼
  chart.update('none');
}
const setStatus = txt => document.getElementById('status').textContent = txt;
