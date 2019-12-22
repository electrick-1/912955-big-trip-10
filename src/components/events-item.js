const createTripEventsItem = (cardData) => {
  const {type, city, photos, description, startDate, endDate, options} = cardData;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const UTC = 7; //  Поправка на часовой пояс UTC+7
  const fixedTime = UTC * 60 * 60 * 1000;
  const interval = new Date(endDate - startDate - fixedTime);

  const getMinutes = (time) => {
    if (time.getMinutes() < 10) {
      return (`0` + time.getMinutes());
    } else {
      return time.getMinutes();
    }
  };

  const offers = () => {
    if (options[0]) {
      return (
        `<p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${options[0].price}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          <li class="event__offer">
            <span class="event__offer-title">${options[0].name}</span>
            &plus;
            &euro;&nbsp;<span class="event__offer-price">${options[0].price}</span>
           </li>
        </ul>`
      );
    } else {
      return ``;
    }
  };

  return (
    `<div class="event">
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type}</h3>

      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="2019-03-18T10:30">${start.getHours()}:${getMinutes(start)}</time>
          &mdash;
          <time class="event__end-time" datetime="2019-03-18T11:00">${end.getHours()}:${getMinutes(end)}</time>
        </p>
        <p class="event__duration">${interval.getHours()}H ${getMinutes(interval)}M </p>
      </div>

      ${offers()}

      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>`
  );
};

export const createTripEventsTemplate = (trip) => {
  return (`
    <li class="trip-events__item">
      ${createTripEventsItem(trip)}
    </li>
  `);
};
