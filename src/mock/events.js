import {getRandomIntegerNumber} from '../utils/common.js';
import {getRandomArrayItem} from '../utils/common.js';

const Types = [
  `Bus`,
  `Check-in`,
  `Drive`,
  `Flight`,
  `Restaurant`,
  `Ship`,
  `Sightseeing`,
  `Taxi`,
  `Train`,
  `Transport`,
  `Trip`
];

const Cities = [
  `Vienna`,
  `Salzburg`,
  `Paris`,
  `Madrid`,
  `Prague`,
  `San Sebastián`,
  `Istanbul`,
  `Kraków`,
  `Siena`,
  `Lisbon`,
  `Porto`,
  `Barcelona`,
  `Seville`,
  `Rome`,
  `Florence`
];

const Descriptions = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat. `,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`
];

const Offers = [
  {
    type: `luggage`,
    name: `Add luggage`,
    price: 10
  },

  {
    type: `comfort`,
    name: `Switch to comfort class`,
    price: 150
  },

  {
    type: `meal`,
    name: `Add meal`,
    price: 2
  },

  {
    type: `seats`,
    name: `Choose seats`,
    price: 9
  }
];

const generatePhotos = () => {
  let photos = [];

  for (let i = 0; i < getRandomIntegerNumber(1, 5); i++) {
    photos.push(`http://picsum.photos/300/150?r=${Math.random()}`);
  }
  return photos;
};

const getRandomInterval = () => {
  return (
    Math.floor(Math.random() * 7) * getRandomIntegerNumber(0, 23) * getRandomIntegerNumber(0, 59) * 60 * 1000
  );
};

const generateStartDate = () => {
  return (
    Date.now() + getRandomInterval()
  );
};

const generateEndDate = () => {
  return (
    generateStartDate() + getRandomInterval()
  );
};

const generateOffers = () => {
  let options = [];

  for (let i = 0; i < getRandomIntegerNumber(0, 2); i++) {
    options.push(getRandomArrayItem(Offers));
  }
  return options;
};

const generateCard = () => {
  return {
    type: getRandomArrayItem(Types),
    city: getRandomArrayItem(Cities),
    photos: generatePhotos(),
    description: Descriptions.slice(0, getRandomIntegerNumber(1, 3)).join(` `),
    startDate: generateStartDate(),
    endDate: generateEndDate(),
    offers: generateOffers(),
    price: getRandomIntegerNumber(50, 150)
  };
};


const generateCards = (count) => {
  return new Array(count)
  .fill(``)
  .map(generateCard)
  .sort((prev, next) => prev.startDate - next.startDate);
};

const cards = generateCards(10);

const menuNames = [`Table`, `Stats`];

export {cards, menuNames};
