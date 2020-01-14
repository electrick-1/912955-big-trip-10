import {RenderPosition, render} from './utils/render.js';
import TripController from './controllers/trip-controller.js';
import CostComponent from './components/cost.js';
import ControlsComponent from './components/controls.js';
import FiltersComponent from './components/filters.js';
import EventContainerComponent from './components/event-list.js';
import {cards} from './mock/events.js';
import {filters} from './mock/filters.js';

const tripMain = document.querySelector(`.trip-main`);
const tripInfo = tripMain.querySelector(`.trip-info`);
const tripControls = tripMain.querySelector(`.trip-controls`);
const tripEvents = document.querySelector(`.trip-events`);
const eventContainerComponent = new EventContainerComponent();

render(tripInfo, new CostComponent(cards), RenderPosition.BEFOREEND);
render(tripControls, new ControlsComponent(), RenderPosition.BEFOREEND);
render(tripControls, new FiltersComponent(filters), RenderPosition.BEFOREEND);
render(tripEvents, eventContainerComponent, RenderPosition.BEFOREEND);


const tripController = new TripController(eventContainerComponent);

tripController.render(cards);
