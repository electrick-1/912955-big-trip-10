const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor((max - min + 1) * Math.random());
};

const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length - 1);

  return array[randomIndex];
};

const render = (container, template, place = `beforeEnd`) => {
  container.insertAdjacentHTML(place, template);
};

const parseDate = (UTCTimestamp) => {
  const date = new Date(UTCTimestamp);
  return (
    `${date.getDate()}/${date.getMonth()}/${String(date.getFullYear()).slice(2)}`
  );
};

const parseTime = (UTCTimestamp) => {
  const date = new Date(UTCTimestamp);
  return (
    `${date.getHours()}:${date.getMinutes()}`
  );
};

export {getRandomIntegerNumber, getRandomArrayItem, render, parseDate, parseTime};
