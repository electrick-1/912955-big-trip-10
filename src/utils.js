const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor((max - min + 1) * Math.random());
};

const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length - 1);

  return array[randomIndex];
};

const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN: container.prepend(element);
      break;
    case RenderPosition.BEFOREEND: container.append(element);
      break;
  }
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

export {RenderPosition, getRandomIntegerNumber, getRandomArrayItem, createElement, render, parseDate, parseTime};
