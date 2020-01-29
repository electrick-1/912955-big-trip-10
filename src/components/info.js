import AbstractComponent from './abstract-component.js';

const getDuration = (startDateUTCTimestamp, endDateUTCTimestamp) => {
  const startDate = new Date(startDateUTCTimestamp);
  const endDate = new Date(endDateUTCTimestamp);
  const monthNameStart = startDate.toLocaleString(`en-US`, {
    month: `short`
  });
  const monthNameEnd = endDate.toLocaleString(`en-US`, {
    month: `short`
  });
  const startDay = startDate.getDate();
  const endDay = endDate.getDate();

  if (monthNameStart === monthNameEnd) {
    return (`${monthNameStart} ${startDay}&nbsp;&mdash;&nbsp;${endDay}`);
  } else {
    return (`${monthNameStart} ${startDay}&nbsp;&mdash;&nbsp;${monthNameEnd} ${endDay}`);
  }
};

const getCities = (points) => {
  let pointsLength = 0;
  switch (points.length) {
    case 2:
      pointsLength = `${points[0].city} &nbsp;&mdash;&nbsp; ${points[points.length - 1].city}`;
      break;
    case 3:
      pointsLength = `${points[0].city} &nbsp;&mdash;&nbsp; ${points[1].city} &nbsp;&mdash;&nbsp; ${points[points.length - 1].city}`;
      break;
    default:
      pointsLength = `${points[0].city} &mdash; ... &mdash; ${points[points.length - 1].city}`;
      break;
  }
  return pointsLength;
};

const getTripInfo = (points) => {
  return (
    `<div class="trip-info__main">
      <h1 class="trip-info__title">
        ${getCities(points)};
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
