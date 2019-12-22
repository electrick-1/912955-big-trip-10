const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor((max - min + 1) * Math.random());
};

const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);

  return array[randomIndex];
};

export {getRandomIntegerNumber, getRandomArrayItem};
