import {MONTH_NAMES} from '../const.js';
import {getRandomIntegerNumber} from '../utils.js';
import {getRandomArrayItem} from '../utils.js';

const FIRST_MONTH_DAY = 1;

const getTripRoute = (tripRoute) => {
  if (tripRoute.length <= 3) {
    return (
      `${tripRoute[0]} &mdash;
      ${tripRoute[1]} &mdash;
      ${tripRoute[2]}`
    );
  } else {
    return (
      `${tripRoute[0]} &mdash;
      ... &mdash; ${tripRoute[tripRoute.length - 1]}`
    );
  }
};

const getTripDate = () => {
  const month = getRandomArrayItem(MONTH_NAMES);
  const lastMonthDay = () => {
    let lastDay = 0;
    if (month === `Apr` || `Jun` || `Sep` || `Nov`) {
      lastDay = 30;
    } else if (month === `Feb`) {
      lastDay = 28;
    } else {
      lastDay = 31;
    }
    return lastDay;
  };

  const startDate = getRandomIntegerNumber(FIRST_MONTH_DAY, lastMonthDay());
  const endDate = getRandomIntegerNumber(startDate, lastMonthDay());
  return (`${month} ${startDate} &mdash; ${endDate}`);
};

export const createTripInfoTemplate = (tripRoute) => {
  return (`
    <div class="trip-info__main">
      <h1 class="trip-info__title">
        ${getTripRoute(tripRoute)}
      </h1>

      <p class="trip-info__dates">${getTripDate()}</p>
    </div>
  `);
};
