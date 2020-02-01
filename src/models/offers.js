export default class OffersModel {
  constructor() {
    this._offers = [];
  }

  getOffers() {
    return this._offers;
  }

  setOffers(offers) {
    this._offers = Array.from(offers);
  }

  getObject() {
    const offersObject = {};
    this._offers.forEach((offer) => {
      offersObject[offer.type] = offer.offers;
    });

    return offersObject;
  }
}
