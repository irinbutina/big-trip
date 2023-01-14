import { FilterType } from '../const.js';
import { isPointFuture } from './utils.js';

const filter = {
  [FilterType.EVERYTHING]: (points) => points.filter((point) => point !== null),
  [FilterType.FUTURE]: (points) => points.filter((point) => isPointFuture(point.dateFrom))
};

export { filter };
