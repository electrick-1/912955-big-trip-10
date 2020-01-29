import AbstractComponent from './abstract-component.js';

const ACTIVE_CONTROL_CLASS = `trip-tabs__btn--active`;

export const ControlItem = {
  TABLE: `control__table`,
  STATS: `control__stats`
};

const getControls = () => {
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      <a id="control__table" class="trip-tabs__btn trip-tabs__btn--active" href="#">Table</a>
      <a id="control__stats" class="trip-tabs__btn" href="#">Stats</a>
    </nav>`
  );
};

export default class Controls extends AbstractComponent {
  getTemplate() {
    return getControls();
  }

  setActiveItem(selectedItem) {
    this.getElement().querySelectorAll(`.trip-tabs__btn`)
      .forEach((it) => {
        if (it.id === selectedItem) {
          it.classList.add(ACTIVE_CONTROL_CLASS);
        } else {
          it.classList.remove(ACTIVE_CONTROL_CLASS);
        }
      });
  }

  setOnChange(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== `A`) {
        return;
      }
      evt.preventDefault();

      const controlItem = evt.target.id;

      handler(controlItem);
    });
  }
}
