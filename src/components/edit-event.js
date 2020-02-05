import moment from "moment";
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/light.css';

import Store from '../models/store.js';
import AbstractSmartComponent from './abstract-smart-component.js';
import {EmptyPoint} from '../controllers/point-controller.js';
import {EventTypeToPlaceholderText} from '../const.js';
import {getUpperFirstLetter} from '../utils/common.js';

const DefaultData = {
  deleteButtonText: `Delete`,
  saveButtonText: `Save`
};

const getEditEvents = (point, options) => {
  const {startDate, endDate, price, isFavorite} = point;
  const {type, city, description, offers, photos, externalData} = options;
  let creatingPoint = false;

  const cities = Store.getDestinations().map((destination) => destination.name);

  const cityTemplate = (cityArr) => cityArr.map((currCity) => `<option value=${currCity} ${currCity === city ? `selected` : ``}>${currCity}</option>`);

  if (point === EmptyPoint) {
    creatingPoint = true;
  }

  const start = moment(startDate).format(`DD/MM/YY HH:mm`);
  const end = moment(endDate).format(`DD/MM/YY HH:mm`);

  const deleteButtonText = externalData.deleteButtonText;
  const saveButtonText = externalData.saveButtonText;

  return (
    `<form class="trip-events__item  event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Transfer</legend>

              <div class="event__type-item">
                <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi" ${type === `taxi` ? `checked` : ``}>
                <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus" ${type === `bus` ? `checked` : ``}>
                <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train" ${type === `train` ? `checked` : ``}>
                <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship" ${type === `ship` ? `checked` : ``}>
                <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-transport-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="transport" ${type === `transport` ? `checked` : ``}>
                <label class="event__type-label  event__type-label--transport" for="event-type-transport-1">Transport</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive" ${type === `drive` ? `checked` : ``}>
                <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight"  ${type === `flight` ? `checked` : ``}>
                <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
              </div>
            </fieldset>

            <fieldset class="event__type-group">
              <legend class="visually-hidden">Activity</legend>

              <div class="event__type-item">
                <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in" ${type === `check-in` ? `checked` : ``}>
                <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing" ${type === `sightseeing` ? `checked` : ``}>
                <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant" ${type === `restaurant` ? `checked` : ``}>
                <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
              </div>
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${getUpperFirstLetter(type)} ${EventTypeToPlaceholderText[getUpperFirstLetter(type)]}
          </label>
          <select class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${city}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${cityTemplate(cities)}
          </datalist>
          </select>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">
            From
          </label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${start}">&mdash;
          <label class="visually-hidden" for="event-end-time-1">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${end}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">${saveButtonText}</button>
        <button class="event__reset-btn" type="reset">${creatingPoint ? `Cancel` : deleteButtonText}</button>
        <input id="event-favorite-1" class="event__favorite-checkbox js-event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``}>
        <label class="event__favorite-btn ${creatingPoint ? `visually-hidden` : ``}" for="event-favorite-1">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"></path>
          </svg>
        </label>
        ${creatingPoint ? `` : `<button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>`}
      </header>

      ${offers.length > 0 || description.length > 0 ?
      `<section class="event__details">

      ${offers.length > 0 ?
      `<section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
        ${offers
          .map((offer) => {
            return (
              `<div class="event__offer-selector">
                  <input class="event__offer-checkbox  visually-hidden" id="event-${offer.title}" type="checkbox" name="event-${offer.title}" ${offer.isChecked ? `checked` : ``}>
                  <label class="event__offer-label" for="event-${offer.title}">
                    <span class="event__offer-title">${offer.title}</span>
                    &plus;
                    &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
                  </label>
                </div>`
            );
          }).join(` `)}
          </div>
      </section>` : ` `}

      ${description.length > 0 ?
      `<section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${description}</p>
        ${photos.length > 0 ?
      `<div class="event__photos-container">
        <div class="event__photos-tape">
          ${photos
            .map((photo) => {
              return (
                `<img class="event__photo" src="${photo.src}" alt="${photo.description}">`
              );
            }).join(``)}
        </div>
      </div>` : ` `}

      </section>` : ` `}
      </section>` : ` `}
    </form>`
  );
};

export default class EditEvents extends AbstractSmartComponent {
  constructor(point) {
    super();

    this._point = point;
    this._cityEvent = point.city;
    this._typeEvent = point.type;

    this._offers = [...point.offers];
    this._photos = [...point.photos];

    this._price = point.price;
    this._description = point.description;

    this._externalData = DefaultData;
    this._flatpickrStartDate = null;
    this._flatpickrEndDate = null;
    this._startDate = this.getElement().querySelector(`#event-start-time-1`);
    this._endDate = this.getElement().querySelector(`#event-end-time-1`);

    this._clickHandler = null;
    this._submitHandler = null;
    this._favoritesClickHandler = null;
    this._deleteButtonClickHandler = null;

    this._subscribeOnEvents();
    this._applyFlatpickr();
  }

  getTemplate() {
    return getEditEvents(this._point, {type: this._typeEvent, city: this._cityEvent, description: this._description, offers: this._offers, photos: this._photos, externalData: this._externalData});
  }

  getData() {
    const form = this.getElement();
    return new FormData(form);
  }

  removeElement() {
    if (this._flatpickrStartDate || this._flatpickrEndDate) {
      this._flatpickrStartDate.destroy();
      this._flatpickrEndDate.destroy();
      this._flatpickrStartDate = null;
      this._flatpickrEndDate = null;
    }

    super.removeElement();
  }

  recoveryListeners() {
    this.setClickHandler(this._clickHandler);
    this.setSubmitHandler(this._submitHandler);
    this.setFavoritesClickHandler(this._favoritesClickHandler);
    this.setDeleteButtonClickHandler(this._deleteButtonClickHandler);
    this._subscribeOnEvents();
    this._applyFlatpickr();
  }

  rerender() {
    super.rerender();

    this._applyFlatpickr();
  }

  reset() {
    const point = this._point;
    this._type = point.type;
    this._city = point.city;

    this.rerender();
  }

  setData(data) {
    this._externalData = Object.assign({}, DefaultData, data);
    this.rerender();
  }

  setClickHandler(handler) {
    const element = this.getElement().querySelector(`.event__rollup-btn`);
    if (element) {
      element.addEventListener(`click`, handler);
      this._clickHandler = handler;
    }
  }

  setSubmitHandler(handler) {
    this.getElement().addEventListener(`submit`, handler);
    this._submitHandler = handler;
  }

  setFavoritesClickHandler(handler) {
    this.getElement().querySelector(`.event__favorite-checkbox`).addEventListener(`click`, handler);
    this._favoritesClickHandler = handler;
  }

  setDeleteButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, handler);
    this._deleteButtonClickHandler = handler;
  }

  disableForm() {
    const form = this.getElement();
    const elements = Array.from(form.elements);
    elements.forEach((elm) => {
      elm.readOnly = true;
    });
  }

  activeForm() {
    const form = this.getElement();
    const elements = Array.from(form.elements);
    elements.forEach((elm) => {
      elm.readOnly = false;
    });
  }

  _applyFlatpickr() {
    if (this._flatpickrStartDate || this._flatpickrEndDate) {
      this._flatpickrStartDate.destroy();
      this._flatpickrEndDate.destroy();
      this._flatpickrStartDate = null;
      this._flatpickrEndDate = null;
    }

    const element = this.getElement();

    this._flatpickrStartDate = flatpickr(element.querySelector(`input[name="event-start-time"]`), {
      allowInput: true,
      defaultDate: this._point.startDate,
      dateFormat: `d/m/Y H:i`,
      minDate: this._point.startDate,
      enableTime: true
    });

    this._flatpickrEndDate = flatpickr(element.querySelector(`input[name="event-end-time"]`), {
      allowInput: true,
      defaultDate: this._point.endDate,
      dateFormat: `d/m/Y H:i`,
      minDate: this._point.startDate,
      enableTime: true
    });
  }

  _subscribeOnEvents() {
    const typeList = this.getElement().querySelector(`.event__type-list`);
    const dataList = this.getElement().querySelector(`.event__input--destination`);

    typeList.addEventListener(`change`, (evt) => {
      if (evt.target.tagName === `INPUT`) {
        this._typeEvent = evt.target.value;
        this._offers = Store.getOffers().find(
            (offer) => offer.type === this._typeEvent
        ).offers;
        this.rerender();
      }
    });

    dataList.addEventListener(`change`, (evt) => {
      if (evt.target.tagName === `SELECT`) {
        this._cityEvent = evt.target.value;
        this._photos = Store.getDestinations().find(
            (destination) => destination.name === this._cityEvent
        ).pictures;
        this._description = Store.getDestinations().find(
            (destination) => destination.name === this._cityEvent
        ).description;
        this.rerender();
      }
    });
  }
}
