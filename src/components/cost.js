import {createElement} from '../utils.js';

const getCost = (cards) => {
  let cost = 0;
  cards.forEach((card) => {
    cost += card.price;
    card.offers.forEach((offer) => {
      cost += offer.price;
    });
  });

  return (
    `<p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
    </p>`
  );
};

export default class Cost {
  constructor(cards) {
    this._element = null;
    this._cards = cards;
  }

  getTemplate() {
    return getCost(this._cards);
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
