import {createElement} from '../utils.js';

const getFilters = (filters) => {
  return (
    `<form class="trip-filters" action="#" method="get">
      ${filters.map(({name, isChecked}) => {
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
    }).join(` `)}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

export default class Filters {
  constructor(filters) {
    this._element = null;
    this._filters = filters;
  }

  getTemplate() {
    return getFilters(this._filters);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
