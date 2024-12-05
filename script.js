let simulationInterval = null;
let downloadGauge = null;
let uploadGauge = null;

function initializeGauges() {
  const downloadCtx = document.getElementById('downloadGauge').getContext('2d');
  const uploadCtx = document.getElementById('uploadGauge').getContext('2d');

  downloadGauge = new Chart(downloadCtx, {
    type: 'doughnut',
    data: {
      labels: ['Speed (KBps)'],
      title: 'Download Speed',
      datasets: [
        {
          data: [0, 100],
          backgroundColor: ['#007bff', '#e9ecef'],
        },
      ],
    },
    options: {
      circumference: 180,
      rotation: -90,
      cutout: '80%',
    },
  });

  uploadGauge = new Chart(uploadCtx, {
    type: 'doughnut',
    data: {
      labels: ['Speed (KBps)'],
      datasets: [
        {
          data: [0, 100],
          backgroundColor: ['#28a745', '#e9ecef'],
        },
      ],
    },
    options: {
      circumference: 180,
      rotation: -90,
      cutout: '80%',
    },
  });
}

function updateGauge(gauge, value, maxValue) {
  gauge.data.datasets[0].data = [value, maxValue - value];
  gauge.update();
}

function generatePacket(sizeInKB) {
    if (sizeInKB <= 0) {
      throw new Error("El tamaño debe ser mayor a 0.");
    }
    const sizeInBytes = sizeInKB * 1024;  
    const packet = 'x'.repeat(sizeInBytes);  
    return packet;
  }

document.getElementById('start').addEventListener('click', () => {
  const baseSpeed = parseInt(document.getElementById('speed').value, 10);
  const latency = parseInt(document.getElementById('latency').value, 10);
  const packetLoss = parseInt(document.getElementById('loss').value, 10);
  const output = document.getElementById('output');

  if (!baseSpeed || !latency || packetLoss < 0 || packetLoss > 100) {
    output.innerText = 'Please provide valid values.';
    return;
  }

  output.innerText = 'Simulation running...';
  initializeGauges();

  let totalDownloaded = 0;
  let totalUploaded = 0;

  simulationInterval = setInterval(() => {
    const fluctuation = (Math.random() - 0.5) * 0.3 * baseSpeed; // ±15% fluctuation
    const downloadSpeed = Math.max(0, baseSpeed + fluctuation);
    const uploadSpeed = Math.max(0, baseSpeed * 0.5 + fluctuation / 2); // Upload at 50% of download

    if (Math.random() * 100 < packetLoss) {
      output.innerText = 'Packet lost!';
      return;
    }

    totalDownloaded += downloadSpeed;
    totalUploaded += uploadSpeed;


    output.innerText = `Downloaded: ${totalDownloaded.toFixed(2)} KB | Uploaded: ${totalUploaded.toFixed(2)} KB`;

    updateGauge(downloadGauge, downloadSpeed, baseSpeed * 1.3); // Max 130% of base speed
    updateGauge(uploadGauge, uploadSpeed, baseSpeed * 0.65); // Max 65% of base speed
  }, 1000);
});

document.getElementById('stop').addEventListener('click', () => {
  clearInterval(simulationInterval);
  document.getElementById('output').innerText = 'Simulation stopped.';
});
