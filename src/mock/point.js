import dayjs from 'dayjs';

import { pointsType } from '../const.js';
import { getRandomArrayElement, getRandomInteger, getFormatDate } from '../utils/random.js';
import { DESTINATION, DESCRIPTION, MaxCount, MinCount , OFFERS} from './const.js';


const getDestinationImages = (arrayLength) => new Array(arrayLength).fill('').map(() => ({
  src: `http://picsum.photos/248/152?r=${getRandomInteger(1, 10)}`,
  description: getRandomArrayElement(DESCRIPTION),
}));


const generateDestination = () => {
  const destinationName = getRandomArrayElement(DESTINATION);
  const description = getRandomArrayElement(
    DESCRIPTION);
  const pictures = getDestinationImages(
    getRandomInteger(MinCount.IMG_COUNT, MaxCount.IMG_COUNT));
  return {
    id: 1,
    destinationName,
    description,
    pictures,
  };
};

const generateOffersList = () => {

  let i = 0;
  return new Array(OFFERS.length).fill('').map(() => ({
    typeOffer: getRandomArrayElement(pointsType),
    offers: {
      title: OFFERS[i],
      priceOffer: getRandomInteger(MinCount.OFFER_PRICE, MaxCount.OFFER_PRICE) * 10,
      id: i++,
    }
  }));
};

generateOffersList()

const getPossibleOffers = (type) => generateOffersList().filter((item) => item.typeOffer === type);


const getDateFrom = () => dayjs().add(getRandomInteger(0, 10000), 'm').toDate();


export const generateRoutePoint = () => {
  const type = getRandomArrayElement(pointsType);
  const destination = generateDestination();

  const dateFrom = getDateFrom();
  const a = getRandomInteger(30, 200);
  const dateTo = dayjs(dateFrom).add(a, 'm').toDate();
  const basePrice = getRandomInteger(MinCount.PRICE, MaxCount.PRICE) * 10;

  const offers = getPossibleOffers(type).map((el) => el.offers);
  console.log(offers)

  return {
    id: Date.now() * Math.random(),
    type,
    dateFrom,
    dateTo,
    destination,
    offers,
    basePrice
  };
};


