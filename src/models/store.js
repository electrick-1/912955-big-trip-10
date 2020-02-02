export default class Store {
  constructor() {
    this._destinations = null;
    this._offers = null;
  }

  static setDestinations(destinations) {
    Store._destinations = destinations;
  }

  static setOffers(offers) {
    Store._offers = offers;
  }

  static getDestinations() {
    return Store._destinations;
  }

  static getOffers() {
    return Store._offers;
  }
}
