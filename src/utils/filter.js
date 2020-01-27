import {FilterType} from '../const.js';

const getFuturePoints = (points, date) => {
  return points.filter((point) => point.startDatetime > date);
};

const getPastPoints = (points, date) => {
  return points.filter((point) => point.endDatetime < date);
};

export const getPointsByFilter = (points, filterType) => {
  const nowDate = new Date();

  switch (filterType) {
    case FilterType.EVERYTHING:
      return points.sort((a, b) => a.startDate - b.startDate);
    case FilterType.FUTURE:
      return getFuturePoints(points, nowDate);
    case FilterType.PAST:
      return getPastPoints(points, nowDate);
  }

  return points;
};
