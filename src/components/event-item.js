import moment from "moment";
import AbstractComponent from './abstract-component.js';
import {EventTypeToPlaceholderText} from '../const.js';
import {formatDuration} from '../utils/common.js';

const getEvents = (event) => {

  const startDatetime = moment(event.startDate).format(`YYYY-MM-DDThh:mm:ss`);
  const endDatetime = moment(event.endDate).format(`YYYY-MM-DDThh:mm:ss`);

  const startTime = moment(event.startDate).format(`HH:mm`);
  const endTime = moment(event.endDate).format(`HH:mm`);

  const duration = formatDuration(event.endDate - event.startDate);

  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${event.type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${event.type} ${EventTypeToPlaceholderText[event.type]} ${event.city}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${startDatetime}">${startTime}</time>
            —
            <time class="event__end-time" datetime="${endDatetime}">${endTime}</time>
          </p>
          <p class="event__duration">${duration}</p>
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

export default class Events extends AbstractComponent {
  constructor(event) {
    super();

    this._event = event;
  }

  getTemplate() {
    return getEvents(this._event);
  }

  setClickHandler(handler) {
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, handler);
  }
}
