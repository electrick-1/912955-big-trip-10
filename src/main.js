import {render} from './utils.js';
import {getTripInfo} from './components/info.js';
import {getControls} from './components/controls.js';
import {getFilters} from './components/filters.js';
import {getSort} from './components/sort.js';
import {getEditEvents} from './components/edit-event.js';
import {createEventsContainer} from './components/event-list.js';
import {getEvents} from './components/event-item.js';
import {createDay} from './components/day.js';
import {cards} from './mock/events.js';
import {sortOptions} from './mock/sort.js';
import {filters} from './mock/filters.js';


const tripMain = document.querySelector(`.trip-main`);
const tripInfo = tripMain.querySelector(`.trip-info`);

render(tripInfo, getTripInfo(cards), `afterBegin`);

const tripControls = tripMain.querySelector(`.trip-controls`);

render(tripControls, getControls());
render(tripControls, getFilters(filters));

const tripEvents = document.querySelector(`.trip-events`);
render(tripEvents, getSort(sortOptions));
render(tripEvents, createEventsContainer());

const tripDays = document.querySelector(`.trip-days`);
const dates = [
  ...new Set(cards.map((card) => new Date(card.startDate).toDateString()))
];

dates.forEach((day, index) => {
  render(tripDays, createDay(day, index));
  const dayContainer = tripDays.querySelector(`.trip-days__item:last-of-type`);
  cards.filter((event) => day === new Date(event.startDate).toDateString())
    .forEach((event, i) => {
      const eventList = dayContainer.querySelector(`.trip-events__list`);
      if (index === 0 && i === 0) {
        render(eventList, getEditEvents(event));
      } else {
        render(eventList, getEvents(event));
      }
    }

    );
});
