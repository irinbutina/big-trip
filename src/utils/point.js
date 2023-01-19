import dayjs from 'dayjs';

// export const sortPointsByDate = () => {
//   console.log('sortPointsByDate')
// }

// export const sortPointsByPrice = () => {
//   console.log('sortPointsByPrice')
// }

// export const sortPointsByDate = (a, b) => dayjs(a.dateFrom).diff(b.dateFrom);

// export const sortPointsByTime = (a, b) => {
//   return dayjs(a.endTime).diff(a.startTime) - dayjs(b.endTime).diff(b.startTime);
// };

// export const sortPointsByPrice = (a, b) => b.basePrice - a.basePrice;


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
