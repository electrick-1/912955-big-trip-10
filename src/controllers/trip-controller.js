import {RenderPosition, renderElement} from '../utils/render.js';
import TripInfoComponent from '../components/info.js';
import SortComponent, {SortType} from '../components/sort.js';
import DayComponent from '../components/day.js';
import {sortOptions} from '../mock/sort.js';
import PointController, {Mode as PointControllerMode, EmptyPoint} from './point-controller.js';
import NoEventsComponent from '../components/no-events.js';

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

export default class TripController {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;

    this._showedControllers = [];
    this._sortComponent = new SortComponent(sortOptions);
    this._noEventsComponent = new NoEventsComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._pointsModel.setFilterChangeHandler(this._onFilterChange);
  }

  hide() {
    this._container.hide();
  }

  show() {
    this._container.show();
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
  }

  _onDataChange(pointController, oldData, newData) {
    if (oldData === EmptyPoint) {
      this._createPoint = null;
      if (newData === null) {
        pointController.destroy();
        this._updatePoints();
      } else {
        this._pointsModel.addPoints(newData);
        pointController.render(newData, PointControllerMode.DEFAULT);

        const destroyedPoint = this._showedControllers.pop();
        destroyedPoint.destroy();

        this._showedControllers = [].concat(this._container, this._showedControllers);
        this._updatePoints();
      }
    } else if (newData === null) {
      this._pointsModel.removePoint(oldData.id);
      this._updatePoints();
    } else {
      const isSuccess = this._pointsModel.updatePoints(oldData.id, newData);
      if (isSuccess) {
        pointController.render(newData, PointControllerMode.DEFAULT);
        this._updatePoints();
      }
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
  }
  _onFilterChange() {
    this._updatePoints();
  }
}
