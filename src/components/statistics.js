import AbstractSmartComponent from './abstract-smart-component.js';
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

const LabelsTitleByType = [
  [`bus`, `🚌`],
  [`check-in`, `🏨`],
  [`drive`, `🚗`],
  [`flight`, `✈️`],
  [`restaurant`, `🍴`],
  [`ship`, `🛳`],
  [`sightseeing`, `🏛`],
  [`taxi`, `🚕`],
  [`train`, `🚂`],
  [`transport`, `🚊`],
  [`ride`, `🚕`]
];

const TitleChart = {
  MONEY: `MONEY`,
  TRANSPORT: `TRANSPORT`,
  TIME: `TIME SPENT`
};

const PlaceholderChart = {
  EURO: `€`,
  PIECES: `x`,
  HOURS: `H`
};

const getChartMoney = (points) => {
  let taxi = 0;
  let bus = 0;
  let train = 0;
  let ship = 0;
  let transport = 0;
  let drive = 0;
  let flight = 0;
  let checkIn = 0;
  let sightseeing = 0;
  let restaurant = 0;

  points.forEach((point) => {
    switch (point.type) {
      case `Taxi`:
        taxi += point.price;
        break;
      case `Bus`:
        bus += point.price;
        break;
      case `Train`:
        train += point.price;
        break;
      case `Ship`:
        ship += point.price;
        break;
      case `Transport`:
        transport += point.price;
        break;
      case `Drive`:
        drive += point.price;
        break;
      case `Flight`:
        flight += point.price;
        break;
      case `Check-in`:
        checkIn += point.price;
        break;
      case `Sightseeing`:
        sightseeing += point.price;
        break;
      case `Restaurant`:
        restaurant += point.price;
        break;
    }
  });
  return [
    [`taxi`, taxi],
    [`bus`, bus],
    [`train`, train],
    [`ship`, ship],
    [`transport`, transport],
    [`drive`, drive],
    [`flight`, flight],
    [`check-in`, checkIn],
    [`sightseeing`, sightseeing],
    [`restaurant`, restaurant]
  ].filter((money) => money[1] !== 0).sort((a, b) => b - a);
};

const getChartTransport = (points) => {
  let taxi = 0;
  let bus = 0;
  let train = 0;
  let ship = 0;
  let transport = 0;
  let drive = 0;
  let flight = 0;

  points.forEach((point) => {
    switch (point.type) {
      case `Taxi`:
        taxi++;
        break;
      case `Bus`:
        bus++;
        break;
      case `Train`:
        train++;
        break;
      case `Ship`:
        ship++;
        break;
      case `Transport`:
        transport++;
        break;
      case `Drive`:
        drive++;
        break;
      case `Flight`:
        flight++;
        break;
    }
  });
  return [
    [`taxi`, taxi],
    [`bus`, bus],
    [`train`, train],
    [`ship`, ship],
    [`transport`, transport],
    [`drive`, drive],
    [`flight`, flight],
  ].filter((pieces) => pieces[1] !== 0).sort((a, b) => b - a);
};

const getHours = (point) => {
  return Math.floor((point.endDate - point.startDate) / (1000 * 60 * 60));
};

const getChartTime = (points) => {
  let taxi = 0;
  let bus = 0;
  let train = 0;
  let ship = 0;
  let transport = 0;
  let drive = 0;
  let flight = 0;
  let checkIn = 0;
  let sightseeing = 0;
  let restaurant = 0;

  points.forEach((point) => {
    switch (point.type) {
      case `Taxi`:
        taxi += getHours(point);
        break;
      case `Bus`:
        bus += getHours(point);
        break;
      case `Train`:
        train += getHours(point);
        break;
      case `Ship`:
        ship += getHours(point);
        break;
      case `Transport`:
        transport += getHours(point);
        break;
      case `Drive`:
        drive += getHours(point);
        break;
      case `Flight`:
        flight += getHours(point);
        break;
      case `Check-in`:
        checkIn += getHours(point);
        break;
      case `Sightseeing`:
        sightseeing += getHours(point);
        break;
      case `Restaurant`:
        restaurant += getHours(point);
        break;
    }
  });
  return [
    [`taxi`, taxi],
    [`bus`, bus],
    [`train`, train],
    [`ship`, ship],
    [`transport`, transport],
    [`drive`, drive],
    [`flight`, flight],
    [`check-in`, checkIn],
    [`sightseeing`, sightseeing],
    [`restaurant`, restaurant]
  ].filter((hours) => hours[1] !== 0).sort((a, b) => b - a);
};

const renderChart = (ctx, points, title, placeholders, isPlaceholderOnLeft = false) => {
  const filteredData = points.sort((a, b) => b[1] - a[1]);
  const filteredTitles = filteredData.map((element) => LabelsTitleByType.filter((it) => it[0] === element[0])).map((arr) => arr[0][1]);

  return new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: filteredTitles,
      datasets: [{
        data: filteredData.map((arr) => arr[1]),
        backgroundColor: `#FFFFFF`,
        maxBarThickness: 50,
        barThickness: 50,
        minBarLength: 50
      }]
    },
    options: {
      title: {
        display: true,
        fontSize: 24,
        fontColor: `#000000`,
        backgroundColor: `transparent`,
        text: title,
        position: `left`
      },
      legend: {
        display: false
      },
      plugins: {
        datalabels: {
          formatter(value) {
            return isPlaceholderOnLeft ? `${placeholders}${value}` : `${value}${placeholders}`;
          },
          font: {
            size: 18,
            weight: `bold`
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`
        }
      },
      tooltips: {
        enabled: false
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            display: true
          },
          gridLines: {
            display: false,
            drawBorder: false
          }
        }],
        xAxes: [{
          ticks: {
            display: false
          },
          gridLines: {
            display: false,
            drawBorder: false
          }
        }]
      }
    }
  });
};

const getStatistics = () => {
  return (
    `<section class="statistics">
      <h2 class="visually-hidden">Trip statistics</h2>

      <div class="statistics__item statistics__item--money">
        <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--transport">
        <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--time-spend">
        <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
      </div>
    </section>`
  );
};

export default class Statistics extends AbstractSmartComponent {
  constructor(pointsModel) {
    super();

    this._pointsModel = pointsModel;

    this._moneyChart = null;
    this._transportChart = null;
    this._timeChart = null;

    this._renderCharts = this._renderCharts.bind(this);
  }

  getTemplate() {
    return getStatistics();
  }

  _renderCharts() {
    const element = this.getElement();

    const moneyCtx = element.querySelector(`.statistics__chart--money`);
    const transportCtx = element.querySelector(`.statistics__chart--transport`);
    const timeCtx = element.querySelector(`.statistics__chart--time`);

    this._resetCharts();

    this._moneyChart = renderChart(
        moneyCtx,
        getChartMoney(this._pointsModel),
        TitleChart.MONEY,
        PlaceholderChart.EURO,
        true
    );

    this._transportChart = renderChart(
        transportCtx,
        getChartTransport(this._pointsModel),
        TitleChart.TRANSPORT,
        PlaceholderChart.PIECES
    );

    this._timeChart = renderChart(
        timeCtx,
        getChartTime(this._pointsModel),
        TitleChart.TIME,
        PlaceholderChart.HOURS
    );
  }

  rerender() {
    super.rerender();
    this._renderCharts();
  }

  _resetCharts() {
    if (this._moneyChart) {
      this._moneyChart.destroy();
      this._moneyChart = null;
    }

    if (this._transportChart) {
      this._transportChart.destroy();
      this._transportChart = null;
    }

    if (this._timeChart) {
      this._timeChart.destroy();
      this._timeChart = null;
    }
  }

  show() {
    super.show();
    this.rerender();
  }

  recoveryListeners() {}
}
