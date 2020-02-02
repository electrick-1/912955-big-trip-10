import API from './api.js';
// import Destinations from './models/destinations.js';
// import Offers from './models/offers.js';
import PointsModel from './models/points.js';
import {RenderPosition, renderElement} from './utils/render.js';
import TripController from './controllers/trip-controller.js';
import FilterController from './controllers/filter.js';
import ControlsComponent, {ControlItem} from './components/controls.js';
import EventContainerComponent from './components/event-list.js';
import StatisticsComponent from './components/statistics.js';
import Store from './models/store.js';

const AUTHORIZATION = `Basic YXNzd29yZAo345dXNBw`;
const END_POINT = `https://htmlacademy-es-10.appspot.com/big-trip/`;

const api = new API(END_POINT, AUTHORIZATION);
const pointsModel = new PointsModel();

const tripMain = document.querySelector(`.trip-main`);
const tripControls = tripMain.querySelector(`.trip-controls`);
const tripEvents = document.querySelector(`.trip-events`);
const eventContainerComponent = new EventContainerComponent();
const controlsComponent = new ControlsComponent();

renderElement(tripControls, controlsComponent, RenderPosition.BEFOREEND);
renderElement(tripEvents, eventContainerComponent, RenderPosition.BEFOREEND);

const filterComponent = new FilterController(tripControls, pointsModel);
filterComponent.render();

const statisticsComponent = new StatisticsComponent(pointsModel.getPoints());
renderElement(tripEvents, statisticsComponent, RenderPosition.BEFOREEND);
statisticsComponent.hide();

const tripController = new TripController(eventContainerComponent, pointsModel, api);

Promise.all([
  api.getDestinations(),
  api.getOffers(),
  api.getPoints()
]).then((res) => {
  pointsModel.setPoints(res[2]);
  tripController.render();
});

document.querySelector(`.trip-main__event-add-btn`)
  .addEventListener(`click`, () => {
    tripController.createPoint();
  });

controlsComponent.setOnChange((controlItem) => {
  switch (controlItem) {
    case ControlItem.TABLE:
      controlsComponent.setActiveItem(ControlItem.TABLE);
      tripController._sortComponent.show();
      tripController.show();
      statisticsComponent.hide();
      break;
    case ControlItem.STATS:
      controlsComponent.setActiveItem(ControlItem.STATS);
      tripController._sortComponent.hide();
      tripController.hide();
      statisticsComponent.show();
      break;
  }
});
