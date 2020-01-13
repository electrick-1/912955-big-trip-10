import {createElement} from '../utils.js';

const createEventsContainer = () => {
  return (`<ul class="trip-days"></ul>`);
};

export default class EventContainer {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createEventsContainer();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
