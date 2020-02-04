import AbstractComponent from './abstract-component.js';

const getCost = (points) => {

  let cost = points.reduce((sum, point) => {
    return sum + point.price + point.offers.reduce((offerCost, it) => {
      return offerCost + it.price;
    }, 0);
  }, 0);

  return (
    `<p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
    </p>`
  );
};

export default class Cost extends AbstractComponent {
  constructor(points) {
    super();

    this._points = points;
  }

  getTemplate() {
    return getCost(this._points);
  }
}
