import AbstractComponent from './abstract-component.js';

export default class EventContainer extends AbstractComponent {
  getTemplate() {
    return (`<ul class="trip-days"></ul>`);
  }
}
