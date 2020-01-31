import AbstractSmartComponent from './abstract-smart-component.js';
import moment from 'moment';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const LegendName = {
  MONEY: `MONEY`,
  TRANSPORT: `TRANSPORT`,
  TIME: `TIME-SPENT`
};

const LabelName = {
  EURO: `€`,
  PIECES: `x`,
  HOURS: `H`
};

const generateChartData = (legendName, points) => {
  const labels = [...new Set(points.map((point) => point.type))];

  switch (legendName) {
    case LegendName.MONEY:
      return labels.map((label) => ({
        label, value: points
          .filter((point) => point.type === label)
          .reduce((acc, curr) => acc + Number(curr.price), 0)
      }))
      .filter((point) => point.value !== 0)
      .sort((a, b) => b.value - a.value);

    case LegendName.TRANSPORT:
      const transportLabels = [
        `taxi`,
        `bus`,
        `train`,
        `ship`,
        `transport`,
        `drive`
      ];
      return transportLabels.map((label) => ({
        label, value: points.filter((point) => point.type.toLowerCase() === label).length
      }))
      .filter((point) => point.value !== 0)
      .sort((a, b) => b.value - a.value);

    case LegendName.TIME:
      return labels.map((label) => ({
        label, value: points.filter((point) => point.type === label)
        .reduce((acc, curr) => acc + Math.round(moment.duration(curr.endDate - curr.startDate, `milliseconds`) / (60 * 60 * 1000)), 0)
      }))
      .filter((point) => point.value !== 0)
      .sort((a, b) => b.value - a.value);
    default:
      return [];
  }
};

const renderChart = (ctx, data, label, legend, isLabelPositionLeft = false) => {
  return new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: data.map((item) => item.label),
      datasets: [{
        data: data.map((item) => item.value),
        backgroundColor: `lightgray`,
        bordercolor: `grey`,
        borderwidth: 1,
        barThickness: 30,
        barPercentage: 1.0
      }]
    },
    options: {
      responsive: false,
      aspectRatio: 2.2,
      title: {
        display: true,
        fontSize: 24,
        fontColor: `#000000`,
        backgroundColor: `transparent`,
        text: legend,
        position: `left`
      },
      legend: {
        display: false
      },
      tooltips: {
        mode: `nearest`,
        titleAlign: `left`
      },
      scales: {
        xAxes: [{
          gridLines: {
            display: false
          },
          ticks: {
            beginAtZero: true
          }
        }],
        yAxes: [{
          gridLines: {
            display: false
          }
        }]
      },
      plugins: {
        datalabels: {
          formatter(value) {
            return isLabelPositionLeft ? `${label}${value}` : `${value}${label}`;
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
        generateChartData(`MONEY`, this._pointsModel),
        LabelName.EURO,
        LegendName.MONEY,
        true
    );

    this._transportChart = renderChart(
        transportCtx,
        generateChartData(`TRANSPORT`, this._pointsModel),
        LabelName.PIECES,
        LegendName.TRANSPORT
    );

    this._timeChart = renderChart(
        timeCtx,
        generateChartData(`TIME-SPENT`, this._pointsModel),
        LabelName.HOURS,
        LegendName.TIME
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
