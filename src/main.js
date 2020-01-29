import {RenderPosition, renderElement} from './utils/render.js';
import TripController from './controllers/trip-controller.js';
import FilterController from './controllers/filter.js';
import CostComponent from './components/cost.js';
import ControlsComponent, {ControlItem} from './components/controls.js';
import EventContainerComponent from './components/event-list.js';
import StatisticsComponent from './components/statistics.js';
import PointsModel from './models/points.js';
import {cards} from './mock/events.js';

const tripMain = document.querySelector(`.trip-main`);
const tripInfo = tripMain.querySelector(`.trip-info`);
const tripControls = tripMain.querySelector(`.trip-controls`);
const tripEvents = document.querySelector(`.trip-events`);
const eventContainerComponent = new EventContainerComponent();
const statisticsComponent = new StatisticsComponent();
const controlsComponent = new ControlsComponent();

renderElement(tripInfo, new CostComponent(cards), RenderPosition.BEFOREEND);
renderElement(tripControls, controlsComponent, RenderPosition.BEFOREEND);
const pointsModel = new PointsModel();
const filterComponent = new FilterController(tripControls, pointsModel);
filterComponent.render();

renderElement(tripEvents, eventContainerComponent, RenderPosition.BEFOREEND);
renderElement(tripEvents, statisticsComponent, RenderPosition.BEFOREEND);

pointsModel.setPoints(cards);

const tripController = new TripController(eventContainerComponent, pointsModel);

statisticsComponent.hide();

tripController.render();

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
