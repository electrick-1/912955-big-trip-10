export default class Point {
  constructor(data) {
    this.id = data[`id`];
    this.type = data[`type`];
    this.city = data[`destination`][`name`];
    this.photos = data[`destination`][`pictures`];
    this.description = data[`destination`][`description`];
    this.startDate = new Date(data[`date_from`]);
    this.endDate = new Date(data[`date_to`]);
    this.offers = data[`offers`];
    this.price = data[`base_price`];
    this.isFavorite = Boolean(data[`is_favorite`]);
  }

  toRAW() {
    return {
      'id': this.id,
      'type': this.type,
      'destination': {
        'pictures': this.photos,
        'description': this.description,
        'name': this.city,
      },
      'date_from': this.startDate.toISOString(),
      'date_to': this.endDate.toISOString(),
      'base_price': this.price,
      'offers': this.offers,
      'is_favorite': this.isFavorite,
    };
  }

  static parsePoint(data) {
    return new Point(data);
  }

  static parsePoints(data) {
    return data.map(Point.parsePoint);
  }

  static clone(data) {
    return new Point(data.toRAW());
  }
}
