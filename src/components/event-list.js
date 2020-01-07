import AbstractComponent from './abstract-component.js';

const createEventsContainer = () => {
  return (`<ul class="trip-days"></ul>`);
};

export default class EventContainer extends AbstractComponent {
  getTemplate() {
    return createEventsContainer();
  }
}
