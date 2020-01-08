import AbstractComponent from './abstract-component.js';

export const SortType = {
  EVENT: `event`,
  TIME: `time`,
  PRICE: `price`
};

const getSort = (options) => {
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      <span class="trip-sort__item  trip-sort__item--day"></span>
      ${options.map(({type, name, isChecked}) => {
      return (
        `<div class="trip-sort__item  trip-sort__item--${name}">
        <input id="sort-${name}" class="trip-sort__input visually-hidden" ${isChecked ? `checked` : ``} type="radio" name="trip-sort" value="sort-${name}">
        <label class="trip-sort__btn" data-sort-type="${type}" for="sort-${name}">${name}</label>
        </div>`
      );
    }).join(` `)}
      <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
    </form>`
  );
};

export default class Sort extends AbstractComponent {
  constructor(options) {
    super();

    this._options = options;
    this._currentSortType = SortType.EVENT;
  }

  getTemplate() {
    return getSort(this._options);
  }

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName.toLowerCase() !== `label`) {
        return;
      }

      const sortType = evt.target.dataset.sortType;

      if (this._currentSortType === sortType) {
        return;
      }

      this._currentSortType = sortType;
      this.getElement().querySelectorAll(`.trip-sort__input`).forEach((it) => it.removeAttribute(`checked`, `checked`));
      this.getElement().querySelector(`#sort-${this._currentSortType}`).setAttribute(`checked`, `checked`);

      handler(this._currentSortType);
    });
  }
}
