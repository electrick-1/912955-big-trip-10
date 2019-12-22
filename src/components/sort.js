const createSortItem = (sortOption) => {
  return (
    `<div class="trip-sort__item  trip-sort__item--${sortOption}">
      <input id="sort-${sortOption}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sortOption}">
      <label class="trip-sort__btn" for="sort-${sortOption}">
        ${sortOption}
      </label>
    </div>`
  );
};

export const createTripSortTemplate = (options) => {
  const optionsMarkup = options.map((it, i) => createSortItem(it, i === 0)).join(`\n`);
  return (`
    <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      <span class="trip-sort__item  trip-sort__item--day"></span>
      ${optionsMarkup}
      <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
    </form>
  `);
};
