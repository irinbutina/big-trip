import {generateRoutePoint} from '../mock/point.js';
// import { POINTS_AMOUNT } from '../mock/const.js';
const POINTS_AMOUNT = 8;

export default class PointsModel {
  #points = Array.from({length: POINTS_AMOUNT}, generateRoutePoint);

  get points() {
    return this.#points;
  }
}
