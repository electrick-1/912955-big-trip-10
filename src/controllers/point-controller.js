import moment from "moment";
import {RenderPosition, replace, remove, renderElement} from '../utils/render.js';
import EventsComponent from '../components/event-item.js';
import EditEventsComponent from '../components/edit-event.js';
import PointModel from '../models/point';
import Store from '../models/store.js';

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

const parseFormData = (formData) => {
  const selectedOffers = [
    ...document.querySelectorAll(`.event__offer-checkbox:checked + label[for^="event"]`)
  ];
  const destination = Store.getDestinations().find(
      (city) => city.name === formData.get(`event-destination`)
  );

  return new PointModel({
    'base_price': Number(formData.get(`event-price`)),
    'date_from': new Date(
        moment(formData.get(`event-start-time`), `DD/MM/YYYY HH:mm`).valueOf()
    ).toISOString(),
    'date_to': new Date(
        moment(formData.get(`event-end-time`), `DD/MM/YYYY HH:mm`).valueOf()
    ).toISOString(),
    'destination': {
      'description': destination.description,
      'name': destination.name,
      'pictures': destination.pictures
    },
    'id': `0`,
    'is_favorite': formData.get(`event-favorite`) ? true : false,
    'offers': selectedOffers.map((offer) => ({
      'title': offer.querySelector(`.event-offer-title`).textContent,
      'price': Number(offer.querySelector(`.event-offer-price`).textContent)
    })),
    'type': formData.get(`event-type`)
  });
};

export default class PointController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._mode = Mode.DEFAULT;

    this._pointData = {};
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
    this._eventsComponent = new EventsComponent(this._pointData);
    this._editEventsComponent = new EditEventsComponent(this._pointData);

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
      const formData = this._editEventsComponent.getData();
      const data = parseFormData(formData);
      this._editEventsComponent.disableForm();

      this._editEventsComponent.setData({
        saveButtonText: `Saving...`,
      });

      this._onDataChange(this, point, data);
      this._editEventsComponent.activeForm();
      this._replaceEditToEvent();

    });


    this._editEventsComponent.setDeleteButtonClickHandler((evt) => {
      evt.preventDefault();
      this._editEventsComponent.setData({
        deleteButtonText: `Deleting...`,
      });
      this._editEventsComponent.disableForm();
      if (this._mode === Mode.CREATING) {
        this._onDataChange(this, EmptyPoint, null);
      }
      this._editEventsComponent.activeForm();
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

  shake() {
    this._editEventsComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    this._eventsComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      this._editEventsComponent.getElement().style.animation = ``;
      this._eventsComponent.getElement().style.animation = ``;

      this._editEventsComponent.setData({
        saveButtonText: `Save`,
        deleteButtonText: `Delete`
      });
    }, SHAKE_ANIMATION_TIMEOUT);
  }

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
