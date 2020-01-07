import {RenderPosition, replace, render} from '../utils/render.js';
import TripInfoComponent from '../components/info.js';
import SortComponent from '../components/sort.js';
import EventsComponent from '../components/event-item.js';
import EditEventsComponent from '../components/edit-event.js';
import NoEventsComponent from '../components/no-events.js';
import DayComponent from '../components/day.js';
import {sortOptions} from '../mock/sort.js';


export default class TripController {
  constructor(container) {
    this._container = container;

    this._noEventsComponent = new NoEventsComponent();
  }

  render(cards) {
    const container = this._container.getElement();
    if (cards.length === 0) {
      const addEventButton = container.querySelector(`.trip-main__event-add-btn`);
      addEventButton.setAttribute(`disabled`, true);
      render(container, this._noEventsComponent, RenderPosition.BEFOREEND);
    } else {
      render(container, new TripInfoComponent(cards), RenderPosition.AFTERBEGIN);
      render(container, new SortComponent(sortOptions), RenderPosition.AFTERBEGIN);

      const tripDays = document.querySelector(`.trip-days`);
      const dates = [
        ...new Set(cards.map((card) => new Date(card.startDate).toDateString()))
      ];

      dates.forEach((day, index) => {
        render(tripDays, new DayComponent(day, index), RenderPosition.BEFOREEND);
        const dayContainer = tripDays.querySelector(`.trip-days__item:last-of-type`);

        cards.filter((event) => day === new Date(event.startDate).toDateString())
          .forEach((event) => {
            const onEscKeyDown = (evt) => {
              const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
              if (isEscKey) {
                replaceEditToEvent();
                document.removeEventListener(`keydown`, onEscKeyDown);
              }
            };

            const eventList = dayContainer.querySelector(`.trip-events__list`);

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


            render(eventList, eventComponent, RenderPosition.BEFOREEND);
          });
      });
    }
  }
}
