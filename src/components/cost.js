import AbstractComponent from './abstract-component.js';

const getCost = () => {
  return (
    `<p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">0</span>
    </p>`
  );
};

export default class Cost extends AbstractComponent {
  constructor() {
    super();

    this._cost = this.getElement().querySelector(`.trip-info__cost-value`);
  }

  getTemplate() {
    return getCost();
  }

  setTotalPrice(cost) {
    this._cost.textContent = cost;
  }
}
