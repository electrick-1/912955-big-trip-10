import {RenderPosition, renderElement} from './utils/render.js';
import TripController from './controllers/trip-controller.js';
import FilterController from './controllers/filter.js';
import CostComponent from './components/cost.js';
import ControlsComponent from './components/controls.js';
import EventContainerComponent from './components/event-list.js';
import PointsModel from './models/points.js';
import {cards} from './mock/events.js';

const tripMain = document.querySelector(`.trip-main`);
const tripInfo = tripMain.querySelector(`.trip-info`);
const tripControls = tripMain.querySelector(`.trip-controls`);
const tripEvents = document.querySelector(`.trip-events`);
const eventContainerComponent = new EventContainerComponent();

renderElement(tripInfo, new CostComponent(cards), RenderPosition.BEFOREEND);
renderElement(tripControls, new ControlsComponent(), RenderPosition.BEFOREEND);
const pointsModel = new PointsModel();
const filterComponent = new FilterController(tripControls, pointsModel);
filterComponent.render();

renderElement(tripEvents, eventContainerComponent, RenderPosition.BEFOREEND);

pointsModel.setPoints(cards);

const tripController = new TripController(eventContainerComponent, pointsModel);

tripController.render();
