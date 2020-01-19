import {RenderPosition, render} from '../utils/render.js';
import TripInfoComponent from '../components/info.js';
import EventsComponent from '../components/event-item.js';
import SortComponent, {SortType} from '../components/sort.js';
import NoEventsComponent from '../components/no-events.js';
import DayComponent from '../components/day.js';
import {sortOptions} from '../mock/sort.js';
import PointController from './point-controller.js';

const renderCards = (container, dates, events, onDataChange, onViewChange) => {
  dates.forEach((day, index) => {
    render(container, new DayComponent(day, index), RenderPosition.BEFOREEND);
    const dayContainer = container.querySelector(`.trip-days__item:last-of-type`);

    events.filter((event) => day === new Date(event.startDate).toDateString())
    .forEach((event) => {

      const eventList = dayContainer.querySelector(`.trip-events__list`);
      const pointController = new PointController(eventList, onDataChange, onViewChange);
      pointController.render(event);

      return pointController;
    });
  });
};


export default class TripController {
  constructor(container) {
    this._container = container;

    this._cards = [];
    this._showedEvents = [];
    this._eventsComponent = new EventsComponent();
    this._noEventsComponent = new NoEventsComponent();
    this._sortComponent = new SortComponent(sortOptions);
    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  render(cards) {
    this._cards = cards;

    const container = this._container.getElement();
    if (cards.length === 0) {
      const addEventButton = document.querySelector(`.trip-main__event-add-btn`);
      addEventButton.setAttribute(`disabled`, true);
      render(container, this._noEventsComponent, RenderPosition.BEFOREEND);
      return;
    }
    const tripInfo = document.querySelector(`.trip-info`);
    render(tripInfo, new TripInfoComponent(cards), RenderPosition.AFTERBEGIN);
    render(container, this._sortComponent, RenderPosition.AFTERBEGIN);

    const dates = [
      ...new Set(cards.map((card) => new Date(card.startDate).toDateString()))
    ];

    const newEvents = renderCards(this._container, dates, cards, this._onDataChange, this._onViewChange);
    this._showedEvents = this._showedEvents.concat(newEvents);
  }

  _onDataChange(pointController, oldData, newData) {
    const index = this._cards.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._cards = [].concat(this._cards.slice(0, index), newData, this._cards.slice(index + 1));

    pointController.render(this._cards[index]);
  }

  _onViewChange() {
    this._showedEvents.forEach((it) => it.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    let sortedTasks = [];

    switch (sortType) {
      case SortType.TIME:
        sortedTasks = this._cards.slice().sort((a, b) => (a.endDate - a.startDate) - (b.endDate - b.startDate));
        break;
      case SortType.PRICE:
        sortedTasks = this._cards.slice().sort((a, b) => b.price - a.price);
        break;
      case SortType.EVENT:
      default:
        sortedTasks = this._cards;
        break;
    }

    this._container.innerHTML = ``;
    render(this._container, this._sortComponent, RenderPosition.AFTERBEGIN);

    if (sortType === SortType.EVENT) {
      renderCards(this._container, this._cards, this._onDataChange, this._onViewChange);
    } else {
      renderCards(this._container, sortedTasks, this._onDataChange, this._onViewChange);
    }
  }
}
