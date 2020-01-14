import AbstractComponent from './abstract-component.js';

const getCost = (cards) => {
  let cost = cards.reduce((sum, current) => sum + current.price, 0);

  return (
    `<p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
    </p>`
  );
};

export default class Cost extends AbstractComponent {
  constructor(cards) {
    super();

    this._cards = cards;
  }

  getTemplate() {
    return getCost(this._cards);
  }
}
