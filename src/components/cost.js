import AbstractComponent from './abstract-component.js';

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

export default class Cost extends AbstractComponent {
  constructor(cards) {
    super();

    this._cards = cards;
  }

  getTemplate() {
    return getCost(this._cards);
  }
}
