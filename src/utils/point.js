import dayjs from 'dayjs';

const getWeightForNullValue = (valueA, valueB) => {
  if (valueA === null && valueB === null) {
    return 0;
  }

  if (valueA === null) {
    return 1;
  }

  if (valueB === null) {
    return -1;
  }

  return null;
};

export const sortPointsByDate = (pointA, pointB) => {
  const weight = getWeightForNullValue(pointA, pointB);
  return weight ?? dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));
};

export const sortPointsByPrice = (pointA, pointB) => {
  const weight = getWeightForNullValue(pointA, pointB);
  return weight ?? pointB.basePrice - pointA.basePrice;
};
