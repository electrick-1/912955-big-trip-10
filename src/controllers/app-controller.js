import API from '../api.js';
import {renderElement, RenderPosition} from '../utils/render.js';
import PointsModel from '../models/points.js';
import TripController from './trip-controller.js';
import FilterController from './filter-controller.js';
import ControlsComponent, {ControlItem} from '../components/controls.js';
import StatisticsComponent from '../components/statistics.js';
import EventContainerComponent from '../components/event-list.js';
import CostComponent from '../components/cost.js';
import TripInfoComponent from '../components/info.js';

const AUTHORIZATION = `Basic YXNzd29yZAo345dXNBw`;
const END_POINT = `https://htmlacademy-es-10.appspot.com/big-trip`;

export default class AppController {
  constructor() {
    this._api = new API(END_POINT, AUTHORIZATION);
    this._controlsComponent = new ControlsComponent();

    this._pointsModel = new PointsModel();
    this._eventContainerComponent = new EventContainerComponent();
    this._costComponent = new CostComponent();
    this._tripInfoComponent = new TripInfoComponent();

    this._tripController = new TripController(this._eventContainerComponent, this._pointsModel, this._api);
    this._priceChangeHandler = this._priceChangeHandler.bind(this);
    this._tripController.setPriceChangeHandler(this._priceChangeHandler);
    this._routeChangeHandler = this._routeChangeHandler.bind(this);
    this._tripController.setRouteChangeHandler(this._routeChangeHandler);
  }

  render() {
    this._statisticsComponent = new StatisticsComponent(this._pointsModel);
    const siteMainElement = document.querySelector(`.page-main`);
    const mainElementContainer = siteMainElement.querySelector(`.page-body__container`);
    const siteHeaderControls = document.querySelector(`.trip-controls`);
    this._filterController = new FilterController(siteHeaderControls, this._pointsModel);
    const tripRoute = document.querySelector(`.trip-info`);

    this._setEventAddBtn();

    renderElement(siteHeaderControls, this._controlsComponent, RenderPosition.BEFOREEND);
    renderElement(mainElementContainer, this._eventContainerComponent, RenderPosition.BEFOREEND);
    renderElement(mainElementContainer, this._statisticsComponent, RenderPosition.BEFOREEND);

    this._statisticsComponent.hide();

    this._setSiteNavigation();

    this._api.getData()
      .then((points) => {
        this._pointsModel.setPoints(points);
        renderElement(tripRoute, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
        this._tripInfoComponent.setTripInfo(points);
        this._filterController.render();
        renderElement(tripRoute, this._costComponent, RenderPosition.BEFOREEND);
        this._tripController.render();
        this._costComponent.setTotalPrice(this._tripController.getTotalPrice());
      });
  }

  _setEventAddBtn() {
    const eventAddBtn = document.querySelector(`.trip-main__event-add-btn`);
    eventAddBtn.addEventListener(`click`, () => {
      this._tripController.onNewEventClick();
      this._tripController.createPoint();
    });
  }

  _setSiteNavigation() {
    this._controlsComponent.setOnChange((controlItem) => {
      switch (controlItem) {
        case ControlItem.STATS:
          this._controlsComponent.setActiveItem(ControlItem.STATS);
          this._tripController.hide();
          this._filterController.hide();
          this._statisticsComponent.show();
          break;
        case ControlItem.TABLE:
          this._controlsComponent.setActiveItem(ControlItem.TABLE);
          this._tripController.show();
          this._filterController.show();
          this._statisticsComponent.hide();
          break;
      }
    });
  }

  _priceChangeHandler() {
    this._costComponent.setTotalPrice(this._tripController.getTotalPrice());
  }

  _routeChangeHandler() {
    this._tripInfoComponent.setTripInfo(this._tripController.getPoints());
  }
}
