import {RenderPosition, render} from './utils.js';
import TripInfoComponent from './components/info.js';
import CostComponent from './components/cost.js';
import ControlsComponent from './components/controls.js';
import FiltersComponent from './components/filters.js';
import SortComponent from './components/sort.js';
import EventsComponent from './components/event-item.js';
import EditEventsComponent from './components/edit-event.js';
import EventContainerComponent from './components/event-list.js';
import NoEventsComponent from './components/no-events.js';
import DayComponent from './components/day.js';
import {cards} from './mock/events.js';
import {sortOptions} from './mock/sort.js';
import {filters} from './mock/filters.js';

const tripMain = document.querySelector(`.trip-main`);
const tripInfo = tripMain.querySelector(`.trip-info`);
const tripControls = tripMain.querySelector(`.trip-controls`);
const tripEvents = document.querySelector(`.trip-events`);
const addEventButton = tripMain.querySelector(`.trip-main__event-add-btn`);

render(tripInfo, new CostComponent(cards).getElement(), RenderPosition.BEFOREEND);
render(tripControls, new ControlsComponent().getElement(), RenderPosition.BEFOREEND);
render(tripControls, new FiltersComponent(filters).getElement(), RenderPosition.BEFOREEND);
render(tripEvents, new EventContainerComponent().getElement(), RenderPosition.BEFOREEND);

if (cards.length === 0) {
  addEventButton.setAttribute(`disabled`, true);
  render(tripEvents, new NoEventsComponent().getElement(), RenderPosition.BEFOREEND);
} else {
  render(tripInfo, new TripInfoComponent(cards).getElement(), RenderPosition.AFTERBEGIN);
  render(tripEvents, new SortComponent(sortOptions).getElement(), RenderPosition.AFTERBEGIN);

  const tripDays = document.querySelector(`.trip-days`);
  const dates = [
    ...new Set(cards.map((card) => new Date(card.startDate).toDateString()))
  ];

  dates.forEach((day, index) => {
    render(tripDays, new DayComponent(day, index).getElement(), RenderPosition.BEFOREEND);
    const dayContainer = tripDays.querySelector(`.trip-days__item:last-of-type`);
    cards.filter((event) => day === new Date(event.startDate).toDateString())
      .forEach((event) => {
        const eventList = dayContainer.querySelector(`.trip-events__list`);

        const onEscKeyDown = (evt) => {
          const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
          if (isEscKey) {
            replaceEditToEvent();
            document.removeEventListener(`keydown`, onEscKeyDown);
          }
        };

        const replaceEditToEvent = () => {
          eventList.replaceChild(eventComponent.getElement(), editEventComponent.getElement());
        };

        const replaceEventToEdit = () => {
          eventList.replaceChild(editEventComponent.getElement(), eventComponent.getElement());
        };

        const eventComponent = new EventsComponent(event);
        const editButton = eventComponent.getElement().querySelector(`.event__rollup-btn`);
        editButton.addEventListener(`click`, () => {
          replaceEventToEdit();
          document.addEventListener(`keydown`, onEscKeyDown);
        });

        const editEventComponent = new EditEventsComponent(event);
        editEventComponent.getElement().addEventListener(`submit`, () => replaceEditToEvent);

        render(eventList, eventComponent.getElement(), RenderPosition.BEFOREEND);
      });
  });
}
