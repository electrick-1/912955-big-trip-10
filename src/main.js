import {createTripInfoTemplate} from './components/info.js';
import {createTripControlsTemplate} from './components/controls.js';
import {createTripFiltersTemplate} from './components/filters.js';
import {createTripSortTemplate} from './components/sort.js';
import {createAddTripEventsTemplate} from './components/add-events.js';
import {createEditTripEventsTemplate} from './components/edit-events.js';
import {createTripEventListTemplate} from './components/event-list.js';
import {createTripEventsItem} from './components/events-item.js';

const TRIP_COUNT = 3;

const render = (container, template, place = `beforeEnd`) => {
  container.insertAdjacentHTML(place, template);
};

const tripMain = document.querySelector(`.trip-main`);
const tripInfo = tripMain.querySelector(`.trip-info`);

render(tripInfo, createTripInfoTemplate(), `afterBegin`);

const tripControls = tripMain.querySelector(`.trip-controls`);
const tripControlsMenu = tripControls.querySelector(`h2:nth-of-type(1)`);
const tripControlsFilters = tripControls.querySelector(`h2:nth-of-type(2)`);

render(tripControlsMenu, createTripControlsTemplate(), `afterEnd`);
render(tripControlsFilters, createTripFiltersTemplate(), `afterEnd`);

const tripEvets = document.querySelector(`.trip-events`);

render(tripEvets, createTripSortTemplate());
render(tripEvets, createAddTripEventsTemplate());
render(tripEvets, createEditTripEventsTemplate());
render(tripEvets, createTripEventListTemplate());

const tripEventList = tripEvets.querySelector(`.trip-events__list`);

for (let i = 0; i < TRIP_COUNT; i++) {
  render(tripEventList, createTripEventsItem());
}
