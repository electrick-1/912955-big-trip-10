import {RenderPosition, replace, remove, renderElement} from '../utils/render.js';
import EventsComponent from '../components/event-item.js';
import EditEventsComponent from '../components/edit-event.js';
import PointModel from '../models/point';

const SHAKE_ANIMATION_TIMEOUT = 600;

export const Mode = {
  CREATING: `creating`,
  DEFAULT: `default`,
  EDIT: `edit`
};

export const EmptyPoint = {
  id: String(Date.now() + Math.random()),
  type: `taxi`,
  city: ``,
  photos: [],
  description: ``,
  startDate: new Date(),
  endDate: new Date(),
  offers: [],
  price: 0,
  isFavorite: false
};

export default class PointController {
  constructor(container, destinationsModel, offersModel, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._destinationsModel = destinationsModel;
    this._offersModel = offersModel;

    this._mode = Mode.DEFAULT;

    this._pointData = {};
    this._newPointData = {};
    this._newCurrentType = null;
    this._newStartDate = null;
    this._newEndDate = null;

    this._eventsComponent = null;
    this._editEventsComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(point, mode) {
    const oldEventComponent = this._eventsComponent;
    const oldEditEventComponent = this._editEventsComponent;
    this._mode = mode;

    this._pointData = point;
    this._newPointData = this._pointData;
    this._eventsComponent = new EventsComponent(this._pointData);
    this._editEventsComponent = new EditEventsComponent(this._pointData, this._destinationsModel, this._offersModel);

    this._eventsComponent.setClickHandler(() => {
      this._replaceEventToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._editEventsComponent.setFavoritesClickHandler(() => {
      const newData = PointModel.clone(point);
      newData.isFavorite = !newData.isFavorite;
      this._onDataChange(this, point, newData);
    });

    this._editEventsComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      this._updatePointData();
      const formData = this._editEventsComponent.getData();
      const data = this._parseFormData(formData);

      this._onDataChange(this, point, data);
      this._replaceEditToEvent();
    });

    // this._editEventsComponent.setData({
    //   saveButtonText: `Saving...`,
    // });

    this._editEventsComponent.setDeleteButtonClickHandler((evt) => {
      evt.preventDefault();
      // this._editEventsComponent.setData({
      //   deleteButtonText: `Deleting...`,
      // });
      if (this._mode === Mode.CREATING) {
        this._onDataChange(this, EmptyPoint, null);
      }
      this.destroy();
    });

    this._editEventsComponent.setClickHandler((evt) => {
      evt.preventDefault();
      this._replaceEditToEvent();
    });

    switch (mode) {
      case Mode.DEFAULT:

        if (oldEventComponent && oldEditEventComponent) {
          replace(this._eventsComponent, oldEventComponent);
          replace(this._editEventsComponent, oldEventComponent);
          this._replaceEditToEvent();
        } else {
          renderElement(this._container, this._eventsComponent, RenderPosition.BEFOREEND);
        }
        break;
      case Mode.CREATING:
        if (oldEventComponent && oldEditEventComponent) {
          remove(oldEventComponent);
          remove(oldEditEventComponent);
        }
        document.addEventListener(`keydown`, this._onEscKeyDown);
        renderElement(this._container, this._editEventsComponent, RenderPosition.AFTERBEGIN);
        break;
    }
  }

  _parseFormData() {
    return new PointModel({
      'id': this._pointData.id,
      'type': this._newPointData.type,
      'is_favourite': this._pointData.isFavorite,
      'base_price': this._newPointData.price,
      'date_from': this._newPointData.startDate,
      'date_to': this._newPointData.endDate,
      'destination': {
        'name': this._newPointData.city,
        'description': ` `,
        'pictures': []},
      'offers': []
    });
  }

  _updatePointData() {
    this._newPointData.type = this._newCurrentType !== null ? this._newCurrentType : this._pointData.type;
    this._newPointData.start = this._newStartDate !== null ? new Date(this._newStartDate) : this._pointData.start;
    this._newPointData.end = this._newEndDate !== null ? new Date(this._newEndDate) : this._pointData.end;
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToEvent();
    }
  }

  destroy() {
    remove(this._editEventsComponent);
    remove(this._eventsComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  // shake() {
  //   // this._editEventsComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
  //   // this._eventsComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
  //
  //   setTimeout(() => {
  //     this._editEventsComponent.getElement().style.animation = ``;
  //     this._eventsComponent.getElement().style.animation = ``;
  //
  //     this._editEventsComponent.setData({
  //       saveButtonText: `Save`,
  //       deleteButtonText: `Delete`,
  //     });
  //   }, SHAKE_ANIMATION_TIMEOUT);
  // }

  _replaceEditToEvent() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);

    replace(this._eventsComponent, this._editEventsComponent);
    this._mode = Mode.DEFAULT;
  }

  _replaceEventToEdit() {
    this._onViewChange();

    replace(this._editEventsComponent, this._eventsComponent);
    this._mode = Mode.EDIT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      if (this._mode === Mode.CREATING) {
        this._onDataChange(this, EmptyPoint, null);
      }
      this._replaceEditToEvent();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
