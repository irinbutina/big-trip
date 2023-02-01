import ApiService from './framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class PointsApiService extends ApiService {
  get points() {
    const aaa = this._load({url: 'points'})
      .then(ApiService.parseResponse);
      console.log(aaa)
    return aaa;
  }

  get offers() {
    const bbb = this._load({ url: 'offers' })
      .then(ApiService.parseResponse);
      console.log(bbb)
      return bbb;
  }

  get destinations() {
    return this._load({ url: 'destinations' })
      .then(ApiService.parseResponse);
  }

  async updatePoint(point) {
    const response = await this._load({
      url: `points/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    // console.log(parsedResponse)
    return parsedResponse;
  }

  async addPoint(point) {
    const response = await this._load({
      url: 'points',
      method: Method.POST,
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  async deletePoint(point) {
    console.log(point.id)
    const response = await this._load({
      url: `points/${point.id}`,
      method: Method.DELETE,
    });
    console.log(response)

    return response;
  }

  #adaptToServer(point) {
    const adaptedPoint = {
      ...point,
      'base_price': point.basePrice,
      'date_from': point.dateFrom instanceof Date ? point.dateFrom.toISOString() : null, // На сервере дата хранится в ISO формате
      'date_to': point.dateTo instanceof Date ? point.dateTo.toISOString() : null,
      'destination': point.destinationId,
      'offers': point.offersId,
    };

    delete adaptedPoint['basePrice'];
    delete adaptedPoint['dateFrom'];
    delete adaptedPoint['dateTo'];
    delete adaptedPoint['destinationId'];
    delete adaptedPoint['offersId'];

    return adaptedPoint;
  }
}
