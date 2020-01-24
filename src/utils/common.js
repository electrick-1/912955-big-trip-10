const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor((max - min + 1) * Math.random());
};

const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length - 1);

  return array[randomIndex];
};

const getUpperFirstLetter = (type) => {
  return (
    type[0].toUpperCase() + type.slice(1, type.length)
  );
};

const formatDuration = (time) => {
  const days = Math.floor(time / (1000 * 60 * 60 * 24)).toString().padStart(2, `0`);
  const hours = (Math.floor(time / (1000 * 60 * 60)) % 24).toString().padStart(2, `0`);
  const minutes = (Math.floor(time / (1000 * 60)) % 60).toString().padStart(2, `0`);

  const totalDays = days > 0 ? `${days}D ` : ``;
  let totalHours = `${hours}H `;

  if (days === 0) {
    totalHours = hours > 0 ? `${hours}H ` : ``;
  }

  return `${totalDays}${totalHours}${minutes}M`;
};

export {getRandomIntegerNumber, getRandomArrayItem, getUpperFirstLetter, formatDuration};
