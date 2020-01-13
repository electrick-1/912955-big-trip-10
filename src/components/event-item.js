import {parseTime, createElement} from '../utils.js';

const getEvents = (event) => {
  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${event.type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${event.type} to airport</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="2019-03-18T10:30">${parseTime(event.startDate)}</time>
            —
            <time class="event__end-time" datetime="2019-03-18T11:00">${parseTime(event.endDate)}</time>
          </p>
          <p class="event__duration">1H 30M</p>
        </div>

        <p class="event__price">
          €&nbsp;<span class="event__price-value">${event.price}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
        ${event.offers
          .map((offer) => {
            return (`
              <li class="event__offer">
                <span class="event__offer-title">${offer.name}</span>
                +
                €&nbsp;<span class="event__offer-price">${offer.price}</span>
               </li>
              `);
          })
        .join(` `)}
        </ul>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};

export default class Events {
  constructor(event) {
    this._element = null;
    this._event = event;
  }

  getTemplate() {
    return getEvents(this._event);
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
