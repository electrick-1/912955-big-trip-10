import AbstractComponent from './abstract-component.js';

const getDuration = (startDateUTCTimestamp, endDateUTCTimestamp) => {
  const startDate = new Date(startDateUTCTimestamp);
  const monthName = startDate.toLocaleString(`en-US`, {
    month: `short`
  });
  const startDay = startDate.getDate();
  const endDay = new Date(endDateUTCTimestamp).getDate();

  return (`${monthName} ${startDay}&nbsp;&mdash;&nbsp;${endDay}`);
};

const getTripInfo = (points) => {
  return (
    `<div class="trip-info__main">
      <h1 class="trip-info__title">
        ${points[0].city}
        ${points.length > 2 ? `&mdash; ... &mdash;` : `&mdash;`}
        ${points[points.length - 1].city}
      </h1>
      <p class="trip-info__dates">${getDuration(points[0].startDate, points[points.length - 1].endDate)}</p>
    </div>`
  );
};

export default class TripInfo extends AbstractComponent {
  constructor(points) {
    super();

    this._points = points;
  }

  getTemplate() {
    return getTripInfo(this._points);
  }
}
