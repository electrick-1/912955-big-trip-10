import {RenderPosition, replace, render} from '../utils/render.js';
import EventsComponent from '../components/event-item.js';
import EditEventsComponent from '../components/edit-event.js';

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`
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

  render(event) {
    const oldEventComponent = this._eventsComponent;
    const oldTaskEditComponent = this._editEventsComponent;

    this._eventsComponent = new EventsComponent(event);
    this._editEventsComponent = new EditEventsComponent(event);

    this._eventsComponent.setClickHandler(() => {
      this._replaceEventToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._editEventsComponent.setFavoritesClickHandler(() => {
      this._onDataChange(this, event, Object.assign({}, event, {
        isFavorite: !event.isFavorite
      }));
    });

    this._editEventsComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      this._replaceEditToEvent();
    });
    this._editEventsComponent.setClickHandler((evt) => {
      evt.preventDefault();
      this._replaceEditToEvent();
    });

    if (oldEventComponent && oldTaskEditComponent) {
      replace(this._eventsComponent, oldEventComponent);
      replace(this._editEventsComponent, oldEventComponent);
    } else {
      render(this._container, this._eventsComponent, RenderPosition.BEFOREEND);
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToEvent();
    }
  }

  _replaceEditToEvent() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);

    // this._editEventsComponent.reset();

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
      this._replaceEditToEvent();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
