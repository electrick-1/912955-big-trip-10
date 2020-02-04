import {RenderPosition, renderElement} from '../utils/render.js';
import CostComponent from '../components/cost.js';
import TripInfoComponent from '../components/info.js';
import SortComponent, {SortType} from '../components/sort.js';
import DayComponent from '../components/day.js';
import PointController, {Mode as PointControllerMode, EmptyPoint} from './point-controller.js';
import NoEventsComponent from '../components/no-events.js';

const sortOptions = [
  {
    type: `event`,
    name: `event`,
    isChecked: true
  },

  {
    type: `time`,
    name: `time`,
    isChecked: false
  },

  {
    type: `price`,
    name: `price`,
    isChecked: false
  },
];

const tripEvents = document.querySelector(`.trip-events`);
const tripInfo = document.querySelector(`.trip-main__trip-info`);

const renderPoints = (
    points,
    container,
    onDataChange,
    onViewChange,
    isDefaultSorting = true
) => {
  const pointControllers = [];
  const dates = isDefaultSorting
    ? [...new Set(points.map((point) => new Date(point.startDate).toDateString()))]
    : [true];

  dates.forEach((date, index) => {
    const day = isDefaultSorting
      ? new DayComponent(date, index + 1)
      : new DayComponent();

    points.filter((point) => {
      return isDefaultSorting
        ? date === new Date(point.startDate).toDateString()
        : point;
    })
    .forEach((point) => {
      const pointController = new PointController(
          day.getElement().querySelector(`.trip-events__list`),
          onDataChange,
          onViewChange
      );
      pointController.render(point, PointControllerMode.DEFAULT);
      pointControllers.push(pointController);
    });
    renderElement(container.getElement(), day, RenderPosition.BEFOREEND);
  });
  return pointControllers;
};

const getTotalPrice = (points) => {
  let cost = points.reduce((sum, point) => {
    return sum + point.price + point.offers.reduce((offerCost, it) => {
      return offerCost + it.price;
    }, 0);
  }, 0);

  return (
    `<p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
    </p>`
  );
};

export default class TripController {
  constructor(container, pointsModel, api) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._api = api;

    this._showedControllers = [];
    this._sortComponent = new SortComponent(sortOptions);
    this._noEventsComponent = new NoEventsComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._pointsModel.setFilterChangeHandler(this._onFilterChange);
    this._totalPrice = null;
  }

  hide() {
    this._container.hide();
  }

  show() {
    this._container.show();
  }

  getTotalPrice() {
    return this._totalPrice;
  }

  render() {
    const points = this._pointsModel.getPoints();

    if (points.length === 0) {
      renderElement(this._container.getElement(), this._noEventsComponent, RenderPosition.BEFOREEND);
      return;
    }

    this._showedControllers = renderPoints(
        points,
        this._container,
        this._onDataChange,
        this._onViewChange
    );

    // this._totalPrice = getTotalPrice(points);
    renderElement(tripInfo, new CostComponent(points), RenderPosition.AFTERBEGIN);
    renderElement(tripInfo, new TripInfoComponent(points), RenderPosition.AFTERBEGIN);
    renderElement(tripEvents, this._sortComponent, RenderPosition.AFTERBEGIN);
  }

  createPoint() {
    if (this._createPoint) {
      return;
    }

    this._createPoint = new PointController(this._container.getElement(), this._onDataChange, this._onViewChange);
    this._createPoint.render(EmptyPoint, PointControllerMode.CREATING);
    this._onViewChange();
  }

  _removePoints() {
    this._container.getElement().innerHTML = ``;
    this._showedControllers.forEach((pointController) => pointController.destroy);
    this._showedControllers = [];
  }

  _updatePoints() {
    this._removePoints();
    this._showedControllers = renderPoints(
        this._pointsModel.getPoints(),
        this._container,
        this._onDataChange,
        this._onViewChange
    );
    this._totalPrice = getTotalPrice(this._pointModel.getPoints());
  }

  _onDataChange(pointController, oldData, newData) {
    if (oldData === EmptyPoint) {
      this._createPoint = null;
      if (newData === null) {
        this._api.deletePoint(oldData.id)
        .then(() => {
          pointController.destroy();
          this._updatePoints();
        })
        .catch(() => {
          pointController.shake();
        });
      } else {
        this._api.createPoint(newData)
        .then((pointModel) => {
          this._pointsModel.addPoint(pointModel);

          this._showedControllers = [].concat(pointController, this._showedControllers);
          this._updatePoints();
        })
        .catch(() => {
          pointController.shake();
        });
      }
    } else if (newData === null) {
      this._api.deletePoint(oldData.id)
        .then(() => {
          this._pointsModel.removePoint(oldData.id);
          this._updatePoints();
        })
        .catch(() => {
          pointController.shake();
        });
    } else {
      this._api.updatePoint(oldData.id, newData)
      .then((pointModel) => {
        const isSuccess = this._pointsModel.updatePoints(oldData.id, pointModel);
        if (isSuccess) {
          this._updatePoints();
        }
      })
      .catch(() => {
        pointController.shake();
      });
    }
  }

  _onViewChange() {
    this._showedControllers.forEach((it) => it.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    let sortedCards = [];
    let isDefaultSorting = false;
    const points = this._pointsModel.getPoints();

    switch (sortType) {
      case SortType.EVENT:
        sortedCards = points.slice();
        isDefaultSorting = true;
        break;
      case SortType.TIME:
        sortedCards = points.slice().sort((a, b) => (a.endDate - a.startDate) - (b.endDate - b.startDate));
        break;
      case SortType.PRICE:
        sortedCards = points.slice().sort((a, b) => b.price - a.price);
        break;
    }

    this._container.getElement().innerHTML = ``;
    this._showedControllers = renderPoints(
        sortedCards,
        this._container,
        this._onDataChange,
        this._onViewChange,
        isDefaultSorting
    );
    this._totalPrice = getTotalPrice(sortedCards);
  }
  _onFilterChange() {
    this._updatePoints();
    this._createPoint = null;
  }
}
