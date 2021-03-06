import AbstractComponent from './abstract-component.js';

const createDay = (date, index) => {
  return (
    `<li class="trip-days__item  day">
            <div class="day__info">
              <span class="day__counter">${index ? index : ``}</span>
              <time class="day__date" datetime="${date ? new Date(date).toDateString().substr(4, 6) : ``}">${date ? new Date(date).toDateString().substr(4, 6) : ``}</time>
            </div>
            <ul class="trip-events__list">
            </ul>
          </li>`
  );
};

export default class Day extends AbstractComponent {
  constructor(date, index) {
    super();

    this._date = date;
    this._index = index;
  }

  getTemplate() {
    return createDay(this._date, this._index);
  }
}
