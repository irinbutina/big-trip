import Observable from '../framework/observable.js';
import {UpdateType} from '../const.js';

export default class PointsModel extends Observable {
  #pointsApiService = null;
  #points = [];
  #offers = [];
  #destinations = [];

  constructor({pointsApiService}) {
    super();
    this.#pointsApiService = pointsApiService;
  }

  get points() {
    return this.#points;
  }

  get offers() {
    return this.#offers;
  }

  get destinations() {
    return this.#destinations;
  }

  async init() {
    try {
      const points = await this.#pointsApiService.points;
      const offers = await this.#pointsApiService.offers;
      const destinations = await this.#pointsApiService.destinations;
      this.#points = points.map(this.#adaptToClient);
      this.#offers = offers.map(this.#adaptToClientOfferByType);
      this.#destinations = destinations.map(this.#adaptToClientDestination);
    } catch(err) {
      this.#points = [];
      this.#offers = [];
      this.#destinations = [];
    }
    this._notify(UpdateType.INIT);
  }

  async updatePoint(updateType, update) {
    console.log(update, updateType)
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this._notify(updateType, update);

    try {
      const response = await this.#pointsApiService.updatePoint(update);
      const updatedPoint = this.#adaptToClient(response);
      console.log(updatedPoint)
      this.#points = [
        ...this.#points.slice(0, index),
        update,
        ...this.#points.slice(index + 1),
      ];

      this._notify(updateType, updatedPoint);
      console.log(updatedPoint)
    } catch(err) {
      throw new Error('Can\'t update point');
    }
  }

  async addPoint(updateType, update) {

    console.log(update)
    try {
      const response = await this.#pointsApiService.addPoint(update);

      console.log(response)
      const newPoint = this.#adaptToClient(response);
      console.log(this.#points)
      this.#points = [ newPoint, ...this.#points ];
      console.log(this.#points)
      this._notify(updateType, newPoint);
    } catch(err) {
      throw new Error('Can\'t add point');
    }
  }

  async deletePoint (updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    try {
      await this.#pointsApiService.deletePoint(update);
      this.#points = [
        ...this.#points.slice(0, index),
        ...this.#points.slice(index + 1),
      ];
      this._notify(updateType);
    } catch (err) {
      throw new Error('Can\'t delete point');
    }
  }

  #adaptToClient(point) {
    const adaptedPoint = {
      ...point,
      dateFrom: point['date_from'] !== null ? new Date(point['date_from']) : point['date_from'], // На клиенте дата хранится как экземпляр Date
      dateTo:  point['date_to'] !== null ? new Date(point['date_to']) : point['date_to'],
      destinationId: point['destination'],
      offersId: point['offers'],
      basePrice: point['base_price'],
    };

    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['destination'];
    delete adaptedPoint['offers'];

    return adaptedPoint;
  }

  #adaptToClientOfferByType(offer) {
    const adaptedOffer = {
      ...offer,
      typeOffer: offer['type'] ,
    };

    delete adaptedOffer['type'];

    return adaptedOffer;
  }

  #adaptToClientDestination(destination) {
    const adaptedDestination = {
      ...destination,
      destinationName: destination['name'] ,
    };

    delete adaptedDestination['name'];

    return adaptedDestination;
  }
}
