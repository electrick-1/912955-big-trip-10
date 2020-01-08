import {RenderPosition, replace, render} from '../utils/render.js';
import TripInfoComponent from '../components/info.js';
import SortComponent, {SortType} from '../components/sort.js';
import EventsComponent from '../components/event-item.js';
import EditEventsComponent from '../components/edit-event.js';
import NoEventsComponent from '../components/no-events.js';
import DayComponent from '../components/day.js';
import {sortOptions} from '../mock/sort.js';


export default class TripController {
  constructor(container) {
    this._container = container;

    this._noEventsComponent = new NoEventsComponent();
    this._sortComponent = new SortComponent(sortOptions);
  }

  render(cards) {
    const container = this._container.getElement();
    if (cards.length === 0) {
      const addEventButton = document.querySelector(`.trip-main__event-add-btn`);
      addEventButton.setAttribute(`disabled`, true);
      render(container, this._noEventsComponent, RenderPosition.BEFOREEND);
    } else {
      const tripInfo = document.querySelector(`.trip-info`);
      render(tripInfo, new TripInfoComponent(cards), RenderPosition.AFTERBEGIN);
      render(container, this._sortComponent, RenderPosition.AFTERBEGIN);

      const dates = [
        ...new Set(cards.map((card) => new Date(card.startDate).toDateString()))
      ];

      const renderCard = (cont, event) => {
        const onEscKeyDown = (evt) => {
          const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
          if (isEscKey) {
            replaceEditToEvent();
            document.removeEventListener(`keydown`, onEscKeyDown);
          }
        };

        const replaceEditToEvent = () => {
          replace(eventComponent, editEventComponent);
        };

        const replaceEventToEdit = () => {
          replace(editEventComponent, eventComponent);
        };

        const eventComponent = new EventsComponent(event);
        eventComponent.setClickHandler(() => {
          replaceEventToEdit();
          document.addEventListener(`keydown`, onEscKeyDown);
        });

        const editEventComponent = new EditEventsComponent(event);
        editEventComponent.setSubmitHandler(replaceEditToEvent);


        render(cont, eventComponent, RenderPosition.BEFOREEND);
      };

      const renderCards = (cont, events) => {
        events.forEach((event) => {
          renderCard(cont, event);
        });
      };

      const renderTrip = () => {
        dates.forEach((day, index) => {
          render(container, new DayComponent(day, index), RenderPosition.BEFOREEND);
          const dayContainer = container.querySelector(`.trip-days__item:last-of-type`);

          cards.filter((event) => day === new Date(event.startDate).toDateString())
          .forEach((event) => {
            const eventList = dayContainer.querySelector(`.trip-events__list`);
            renderCard(eventList, event);
          });
        });
      };

      renderTrip();

      this._sortComponent.setSortTypeChangeHandler((sortType) => {
        let sortedTasks = [];

        switch (sortType) {
          case SortType.TIME:
            sortedTasks = cards.slice().sort((a, b) => (a.endDate - a.startDate) - (b.endDate - b.startDate));
            break;
          case SortType.PRICE:
            sortedTasks = cards.slice().sort((a, b) => b.price - a.price);
            break;
          case SortType.EVENT:
            sortedTasks = cards;
            break;
        }

        container.innerHTML = ``;
        render(container, this._sortComponent, RenderPosition.AFTERBEGIN);

        if (sortType === SortType.EVENT) {
          renderTrip();
        } else {
          renderCards(container, sortedTasks);
        }
      });
    }
  }
}
