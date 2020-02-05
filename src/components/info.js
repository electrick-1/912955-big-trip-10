import AbstractComponent from './abstract-component.js';

const TRIP_LENGTH = {
  ZERO: 0,
  ONE: 1,
  TWO: 2,
  THREE: 3
};

const getCities = (points) => {
  let pointsLength = 0;
  switch (points.length) {
    case TRIP_LENGTH.ZERO:
      pointsLength = ``;
      break;
    case TRIP_LENGTH.ONE:
      pointsLength = points[0].city;
      break;
    case TRIP_LENGTH.TWO:
      pointsLength = points[0].city + `\u00A0\u2013\u00A0` + points[points.length - 1].city;
      break;
    case TRIP_LENGTH.THREE:
      pointsLength = points[0].city + `\u00A0\u2013\u00A0` + points[1].city + `\u00A0\u2013\u00A0` + points[points.length - 1].city;
      break;
    default:
      pointsLength = points[0].city + `\u00A0\u2013\u00A0...\u00A0\u2013\u00A0` + points[points.length - 1].city;
      break;
  }
  return pointsLength;
};

const getTripInfo = () => {
  return (
    `<div class="trip-info__main">
      <h1 class="trip-info__title"></h1>
      <p class="trip-info__dates"></p>
    </div>`
  );
};

export default class TripInfo extends AbstractComponent {
  constructor() {
    super();

    this._tripTitle = this.getElement().querySelector(`.trip-info__title`);
    this._tripDates = this.getElement().querySelector(`.trip-info__dates`);
  }

  getTemplate() {
    return getTripInfo();
  }

  setTripInfo(points) {
    this._tripTitle.textContent = getCities(points);
    if (points.length === 0) {
      this._tripDates.textContent = ``;
    } else if (points.length === 1) {
      this._tripDates.textContent = (new Date(points[0].startDate)).toDateString().substr(4, 6);
    } else {
      this._tripDates.textContent = (new Date(points[0].startDate)).toDateString().substr(4, 6) + ` - ` + (new Date(points[points.length - 1].endDate)).toDateString().substr(4, 6);
    }
  }
}
