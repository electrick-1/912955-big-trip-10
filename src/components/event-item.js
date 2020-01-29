import moment from "moment";
import AbstractComponent from './abstract-component.js';
import {EventTypeToPlaceholderText} from '../const.js';
import {formatDuration, getUpperFirstLetter} from '../utils/common.js';

const getEvents = (point) => {
  const startDatetime = moment(point.startDate).format(`YYYY-MM-DDThh:mm:ss`);
  const endDatetime = moment(point.endDate).format(`YYYY-MM-DDThh:mm:ss`);

  const startTime = moment(point.startDate).format(`HH:mm`);
  const endTime = moment(point.endDate).format(`HH:mm`);

  const duration = formatDuration(point.endDate - point.startDate);

  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${point.type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${getUpperFirstLetter(point.type)} ${EventTypeToPlaceholderText[getUpperFirstLetter(point.type)]} ${point.city}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${startDatetime}">${startTime}</time>
            —
            <time class="event__end-time" datetime="${endDatetime}">${endTime}</time>
          </p>
          <p class="event__duration">${duration}</p>
        </div>

        <p class="event__price">
          €&nbsp;<span class="event__price-value">${point.price}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
        ${point.offers
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
  constructor(point) {
    super();

    this._point = point;
  }

  getTemplate() {
    return getEvents(this._point);
  }

  setClickHandler(handler) {
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, handler);
  }
}
