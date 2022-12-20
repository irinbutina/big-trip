import dayjs from 'dayjs';

import { pointsType } from '../const.js';
import { getRandomArrayElement, getRandomInteger, getFormatDate } from '../utils/random.js';
import { DESTINATION, DESCRIPTION, MaxCount, MinCount , OFFERS} from './const.js';


const getDestinationImages = (arrayLength, destination) => new Array(arrayLength).fill('').map(() => ({
  src: `https://loremflickr.com/248/152?${Math.random()}`,
  destination: getRandomArrayElement(DESTINATION),
  // alt: `${destination} photo`,
}));

const generateDestination = () => {
  const destinationName = getRandomArrayElement(DESTINATION);
  const description = DESCRIPTION.slice().splice(0, getRandomInteger(MinCount.DESCRIPTION_COUNT, MaxCount.DESCRIPTION_COUNT));
  const pictures = getDestinationImages(
    getRandomInteger(MinCount.IMG_COUNT, MaxCount.IMG_COUNT), destinationName);
  return {
    id: 1,
    destinationName,
    description,
    pictures,
  };
};


console.log(generateDestination())


const generateOffer = () => ({
  id:  Date.now() * Math.random(),
  title: OFFERS[getRandomInteger(0, OFFERS.length - 1)],
  priceOffer: getRandomInteger(MinCount.OFFER_PRICE, MaxCount.OFFER_PRICE) * 10,
});


const generateOffersList = () => new Array(pointsType.length).fill('').map((type, index) => ({
  typeOffer: pointsType[index],
  offers: Array.from({length: getRandomInteger(MinCount.OFFER_COUNT, MaxCount.OFFER_COUNT)}, generateOffer)
}));


const getPossibleOffers = (type) => generateOffersList().filter((item) => item.typeOffer === type);


const getDateFrom = () => dayjs().add(getRandomInteger(0, 10000), 'm').toDate();


export const generateRoutePoint = () => {
  const type = getRandomArrayElement(pointsType);
  const destination = generateDestination();

  const dateFrom = getDateFrom();
  const a = getRandomInteger(30, 200);
  const dateTo = dayjs(dateFrom).add(a, 'm').toDate();
  const basePrice = getRandomInteger(MinCount.PRICE, MaxCount.PRICE) * 10;
  const offers = getPossibleOffers(type)[0].offers;
  console.log(destination)

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


