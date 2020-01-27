import AbstractComponent from './abstract-component.js';

const FILTER_ID_PREFIX = `filter-`;

const getFilterNameByID = (id) => {
  return id.substring(FILTER_ID_PREFIX.length);
};

const getFilterMarkup = (filter, isChecked) => {
  const {name} = filter;
  return (
    `<div class="trip-filters__filter">
      <input
      id="filter-${name}"
      class="trip-filters__filter-input  visually-hidden"
      type="radio"
      name="trip-filter"
      value="${name}"
      ${isChecked ? `checked` : ``}>
      <label class="trip-filters__filter-label" for="filter-${name}">
        ${name}
      </label>
    </div>`
  );
};

const getFilterTemplate = (filters) => {
  const filtersMarkup = filters.map((it) => getFilterMarkup(it, it.checked)).join(`\n`);

  return (
    `<form class="trip-filters" action="#" method="get">
      ${filtersMarkup}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

export default class Filters extends AbstractComponent {
  constructor(filters) {
    super();

    this._filters = filters;
  }

  getTemplate() {
    return getFilterTemplate(this._filters);
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`change`, (evt) => {
      const filterName = getFilterNameByID(evt.target.id);
      handler(filterName);
    });
  }
}
