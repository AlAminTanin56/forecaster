const currentMonth = new Date().getMonth() + 1; // Month is 0-indexed
const initialMonth = currentMonth === 1 ? 12 : currentMonth - 1;


// ! Fetching the data from data.json... 
const gettingDataFromOutside = async () => {
  try {
    const response = await fetch('data.json');
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

const createDatasets = async () => {
  try {
    const dataFromOutside = await gettingDataFromOutside();
    const data = {
      labels: Array.from({ length: 12 }, (_, i) => {
        const month = (initialMonth + i) % 12 || 12;
        return month.toLocaleString('en-US', { minimumIntegerDigits: 2 });
      }),
      datasets: dataFromOutside,
    };

    return data;
  } catch (error) {
    throw error;
  }
};

let fuelChart;
(async () => {
  try {
    const data = await createDatasets();
    const ctx = document.getElementById('fuelChart').getContext('2d');
    fuelChart = new Chart(ctx, {
      type: 'bar',
      data: data,
      options: {
        scales: {
          x: {
            type: 'category',
            labels: data.labels,
            beginAtZero: true,
          },
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return value.toFixed(1);
              },
            },
          },
        },
        tooltips: {
          callbacks: {
            label: function (tooltipItem) {
              return tooltipItem.yLabel.toFixed(1) + 'p';
            },
          },
        },
      },
    });

    // Calling updateChart after the initial data is loaded
    await updateChart(); // Useing 'await' to make sure the update completes before moving on
  } catch (error) {
    console.error('Error initializing chart:', error);
  }
})();


// ! Updating the chart here.
async function updateChart() {
  const selectedYear = document.getElementById('yearSelector').value;
  fuelChart.data.labels = Array.from({ length: 12 }, (_, i) => {
    const month = (initialMonth + i) % 12 || 12;
    return month.toLocaleString('en-US', { minimumIntegerDigits: 2 });
  });

  const newDatasets = await Promise.all(
    fuelChart.data.datasets.map(async dataset => {
      return {
        ...dataset,
        data: await fetchDataForYear(dataset.label, selectedYear),
      };
    })
  );

  fuelChart.data.datasets = newDatasets;
  fuelChart.update();
}

function fetchDataForYear(fuelType, year) {
  return Array.from({ length: 12 }, () => Math.floor(Math.random() * 100));
}

function changeYear(offset) {
  const yearSelector = document.getElementById('yearSelector');
  const currentYearIndex = yearSelector.selectedIndex;
  const newIndex = currentYearIndex + offset;

  if (newIndex >= 0 && newIndex < yearSelector.options.length) {
    yearSelector.selectedIndex = newIndex;
    updateChart();
  }
}

function toggleControls(showControls) {
  const controls = document.querySelector('.controls');
  controls.style.display = showControls ? 'flex' : 'none';
  updateChart();
}

document.addEventListener('DOMContentLoaded', updateChart);
