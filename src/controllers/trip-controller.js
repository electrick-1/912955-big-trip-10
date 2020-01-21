import {RenderPosition, renderElement} from '../utils/render.js';
import TripInfoComponent from '../components/info.js';
import SortComponent, {SortType} from '../components/sort.js';
import DayComponent from '../components/day.js';
import {sortOptions} from '../mock/sort.js';
import PointController from './point-controller.js';

const tripEvents = document.querySelector(`.trip-events`);
const tripInfo = document.querySelector(`.trip-main__trip-info`);

const renderCards = (
    cards,
    container,
    onDataChange,
    onViewChange,
    isDefaultSorting = true
) => {
  const pointControllers = [];
  const dates = isDefaultSorting
    ? [...new Set(cards.map((card) => new Date(card.startDate).toDateString()))]
    : [true];

  dates.forEach((date, index) => {
    const day = isDefaultSorting
      ? new DayComponent(date, index + 1)
      : new DayComponent();

    if (day._date === undefined) {
      day._date = ``;
      day._index = ``;
    }

    cards.filter((_card) => {
      return isDefaultSorting
        ? date === new Date(_card.startDate).toDateString()
        : _card;
    })
    .forEach((_card) => {
      const pointController = new PointController(
          day.getElement().querySelector(`.trip-events__list`),
          onDataChange,
          onViewChange
      );
      pointController.render(_card);
      pointControllers.push(pointController);
    });
    renderElement(container.getElement(), day, RenderPosition.BEFOREEND);
  });
  return pointControllers;
};

export default class TripController {
  constructor(container) {
    this._container = container;

    this._cards = [];
    this._showedEvents = [];
    this._sortComponent = new SortComponent(sortOptions);
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
  }

  render(cards) {
    if (this._cards.length === 0) {
      this._cards = cards;
    }
    this._showedEvents = renderCards(
        cards,
        this._container,
        this._onDataChange,
        this._onViewChange
    );

    renderElement(
        tripInfo,
        new TripInfoComponent(cards),
        RenderPosition.AFTERBEGIN
    );

    renderElement(
        tripEvents,
        this._sortComponent,
        RenderPosition.AFTERBEGIN
    );

    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      let sortedCards = [];
      let isDefaultSorting = false;

      switch (sortType) {
        case SortType.EVENT:
          sortedCards = cards.slice();
          isDefaultSorting = true;
          break;
        case SortType.TIME:
          sortedCards = this._cards.slice().sort((a, b) => (a.endDate - a.startDate) - (b.endDate - b.startDate));
          break;
        case SortType.PRICE:
          sortedCards = this._cards.slice().sort((a, b) => b.price - a.price);
          break;
      }

      this._container.getElement().innerHTML = ``;
      this._showedEvents = renderCards(
          sortedCards,
          this._container,
          this._onDataChange,
          this._onViewChange,
          isDefaultSorting
      );
    });
  }

  _onDataChange(pointController, oldData, newData) {
    const index = this._cards.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._cards = [
      ...this._cards.slice(0, index),
      newData,
      this._cards.slice(index + 1)
    ];

    pointController.render(newData);
  }

  _onViewChange() {
    this._showedEvents.forEach((it) => it.setDefaultView());
  }
}
