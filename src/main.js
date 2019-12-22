import {createTripInfoTemplate} from './components/info.js';
import {createTripControlsTemplate} from './components/controls.js';
import {createTripFiltersTemplate} from './components/filters.js';
import {createTripSortTemplate} from './components/sort.js';
import {createAddTripEventsTemplate} from './components/add-events.js';
import {createEditTripEventsTemplate} from './components/edit-events.js';
import {createTripEventListTemplate} from './components/event-list.js';
import {createTripEventsTemplate} from './components/events-item.js';
import {generateCards} from './mock/mock.js';
import {sortOptions} from './mock/mock.js';
import {filters} from './mock/mock.js';
import {Cities} from './mock/mock.js';

const TRIP_COUNT = 3;

const render = (container, template, place = `beforeEnd`) => {
  container.insertAdjacentHTML(place, template);
};

const tripMain = document.querySelector(`.trip-main`);
const tripInfo = tripMain.querySelector(`.trip-info`);

render(tripInfo, createTripInfoTemplate(Cities), `afterBegin`);

const tripControls = tripMain.querySelector(`.trip-controls`);
const tripControlsMenu = tripControls.querySelector(`h2:nth-of-type(1)`);
const tripControlsFilters = tripControls.querySelector(`h2:nth-of-type(2)`);

render(tripControlsMenu, createTripControlsTemplate(), `afterEnd`);
render(tripControlsFilters, createTripFiltersTemplate(filters), `afterEnd`);

const tripEvents = document.querySelector(`.trip-events`);
render(tripEvents, createTripSortTemplate(sortOptions));
render(tripEvents, createAddTripEventsTemplate());
render(tripEvents, createEditTripEventsTemplate());
render(tripEvents, createTripEventListTemplate());

const tripEventList = tripEvents.querySelector(`.trip-events__list`);
const cards = generateCards(TRIP_COUNT);
cards.slice(0).forEach((task) => {
  render(tripEventList, createTripEventsTemplate(task));
});
