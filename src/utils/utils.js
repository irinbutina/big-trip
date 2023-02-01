import dayjs from 'dayjs';

export const getTodayDate = () => dayjs().toISOString();
export const getFormatDate = (date, format) => dayjs(date).format(format);

export const getOfferAtr = (offer) => offer.split(' ').map((el) => el.toLowerCase()).join('-');

export const getPossibleOffers = (offers, type) =>
  offers.find((offer) => offer.typeOffer === type.toLowerCase()).offers;


export const getCurrentDestination = (destinations, id) => destinations.find((destination) => destination.id === id);


export const isEscKey = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

export const isPointFuture = (dateFrom) => dateFrom && dayjs(dateFrom).isAfter(dayjs());

// export const isDatesEqual = (dateA, dateB) => dayjs(dateA).isSame(dateB, 'D');

export const isDatesEqual = (dateA, dateB) => (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB, 'D');

export const isPriceEqual = (priceA, priceB) => (priceA === null && priceB === null) || priceA === priceB;
