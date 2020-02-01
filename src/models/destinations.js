export default class DestinationsModel {
  constructor() {
    this._destinations = [];
  }

  getDestinations() {
    return this._destinations;
  }

  getDestinationsNames() {
    return [...new Set(this._destinations.map(({name}) => name))];
  }

  setDestinations(destinations) {
    this._destinations = Array.from(destinations);
  }

  getObject() {
    const destinationsObject = {};
    this._destinations.forEach((destination) => {
      destinationsObject[destination.name] = {
        description: destination.description,
        pictures: destination.pictures,
      };
    });

    return destinationsObject;
  }
}
