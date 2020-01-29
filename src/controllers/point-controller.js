import {RenderPosition, replace, remove, renderElement} from '../utils/render.js';
import EventsComponent from '../components/event-item.js';
import EditEventsComponent from '../components/edit-event.js';

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
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._mode = Mode.DEFAULT;

    this._eventsComponent = null;
    this._editEventsComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(point, mode) {
    const oldEventComponent = this._eventsComponent;
    const oldEditEventComponent = this._editEventsComponent;
    this._mode = mode;

    this._eventsComponent = new EventsComponent(point);
    this._editEventsComponent = new EditEventsComponent(point);

    this._eventsComponent.setClickHandler(() => {
      this._replaceEventToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._editEventsComponent.setFavoritesClickHandler(() => {
      this._onDataChange(this, point, Object.assign({}, point, {
        isFavorite: !point.isFavorite
      }));
    });

    this._editEventsComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      const data = this._editEventsComponent.getData();
      this._onDataChange(this, point, Object.assign({}, point, data));
      this._replaceEditToEvent();
    });

    this._editEventsComponent.setDeleteButtonClickHandler((evt) => {
      evt.preventDefault();
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
