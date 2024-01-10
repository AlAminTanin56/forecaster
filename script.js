const fuelCostsContainer = document.getElementById("fuelCostsContainer");
let data = [];
let modifiedData = [];

const calculateTotalForEntry = (entry) => {
  return entry.solidFuels + entry.gas + entry.electricity + entry.liquidFuels;
};

document.addEventListener("DOMContentLoaded", function () {
  const fetchDataAndCalculateTotal = async () => {
    try {
      const response = await fetch("data.json");
      data = await response.json();
      modifiedData = data;
      document
        .getElementById("filterElement")
        .addEventListener("change", async () => {
          const selectedValue = document.getElementById("filterElement").value;
          console.log(selectedValue);
          if (selectedValue === "solidFuels") {
            document.getElementById("chartsContainer").innerHTML = "";
            modifiedData = [];
            modifiedData = data.map((entry) => ({
              ...entry,
              solidFuels: entry.solidFuels,
              gas: null,
              liquidFuels: null,
              electricity: null,
            }));
          } else if (selectedValue === "gas") {
            document.getElementById("chartsContainer").innerHTML = "";
            modifiedData = [];
            modifiedData = data.map((entry) => ({
              ...entry,
              gas: entry.gas,
              solidFuels: null,
              liquidFuels: null,
              electricity: null,
            }));
          } else if (selectedValue === "electricity") {
            document.getElementById("chartsContainer").innerHTML = "";
            modifiedData = [];
            modifiedData = data.map((entry) => ({
              ...entry,
              electricity: entry.electricity,
              solidFuels: null,
              gas: null,
              liquidFuels: null,
            }));
          } else if (selectedValue === "liquidFuels") {
            document.getElementById("chartsContainer").innerHTML = "";
            modifiedData = [];
            modifiedData = data.map((entry) => ({
              ...entry,
              liquidFuels: entry.liquidFuels,
              solidFuels: null,
              gas: null,
              electricity: null,
            }));
          } else {
            document.getElementById("chartsContainer").innerHTML = "";
            modifiedData = [];
            modifiedData = data.map((entry) => ({
              ...entry,
              liquidFuels: entry.liquidFuels,
              solidFuels: entry.solidFuels,
              gas: entry.gas,
              electricity: entry.electricity,
            }));
          }

          const uniqueYears = [
            ...new Set(modifiedData.map((entry) => entry.Year)),
          ];
          console.log(uniqueYears);
          uniqueYears.forEach((year) => {
            const yearData = modifiedData.filter(
              (entry) => entry.Year === year
            );
            console.log(yearData);
            createChartForYear(yearData, year);
          });
        });

      const uniqueYears = [...new Set(data.map((entry) => entry.Year))];
      uniqueYears.forEach((year) => {
        const yearData = data.filter((entry) => entry.Year === year);
        createChartForYear(yearData, year);
      });
    } catch (error) {}
  };

  const Forecast = document.getElementById("Forecast");
  const Historical = document.getElementById("Historical");
  const chartContainer = document.getElementById("chartsContainer");
  function addClassToChartContainer() {
    chartContainer.classList.add("forScroll");
    chartContainer.classList.remove("removeScroll");
  }
  function removeClassToChart() {
    chartContainer.classList.add("removeScroll");
    chartContainer.classList.remove("forScroll");
  }
  addClassToChartContainer();
  Forecast.addEventListener("click", removeClassToChart);
  Historical.addEventListener("click", addClassToChartContainer);

  const createChartForYear = (yearData, year) => {
    const canvas = document.createElement("canvas");
    canvas.id = `chart-${year}`;
    canvas.width = 800;
    canvas.height = 550;
    const container = document.getElementById("chartsContainer");
    container.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    const labels = yearData.map((entry) => entry.Month);
    const solidFuelsData = yearData.map((entry) => entry.solidFuels);
    const gasData = yearData.map((entry) => entry.gas);
    const electricityData = yearData.map((entry) => entry.electricity);
    const liquidFuelsData = yearData.map((entry) => entry.liquidFuels);
    console.log(solidFuelsData);
    new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Solid Fuels",
            data: solidFuelsData,
            borderColor:
              solidFuelsData && solidFuelsData.length > 0
                ? "red"
                : "transparent",
            fill: false,
          },
          {
            label: "Gas",
            data: gasData,
            borderColor: gasData && gasData.length > 0 ? "blue" : "transparent",
            fill: false,
          },
          {
            label: "Electricity",
            data: electricityData,
            borderColor:
              electricityData && electricityData.length > 0
                ? "green"
                : "transparent",
            fill: false,
          },
          {
            label: "Liquid Fuels",
            data: liquidFuelsData,
            borderColor:
              liquidFuelsData && liquidFuelsData.length > 0
                ? "orange"
                : "transparent",
            fill: false,
          },
        ],
      },
      options: {
        title: {
          display: true,
          text: `Year ${year}`,
        },
        // Other chart options if needed
      },
    });
  };

  fetchDataAndCalculateTotal();

  // Identify the scrollable container element
  const scrollableContainer = document.getElementById("chartsContainer");
  const errorMessage = document.getElementById("errorMessage");

  // Add event listener for the scroll event on the scrollable container
  scrollableContainer.addEventListener("scroll", function (event) {
    const maxScrollLeft = 5000;
    const currentDate = new Date();
    const january1996 = new Date("January 1996");

    if (scrollableContainer.scrollLeft < 10) {
      errorMessage.innerText = "Cannot scroll backward beyond January 1996";
      errorMessage.style.display = "block";
    } else {
      errorMessage.style.display = "none";
    }
  });
});
