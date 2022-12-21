import { createElement } from '../render.js';
import { pointsType, DATE_FORMAT } from '../const.js';
import { DESTINATION } from '../mock/const.js';
import { getFormatDate } from '../utils/utils.js';

const createInputTypeItemMarkup = (types) =>
  types.map((typePoint) => {
    const typeLowerCase = typePoint.toLowerCase();
    return `<div class="event__type-item">
      <input id="event-type-${typeLowerCase}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${typeLowerCase}">
      <label class="event__type-label  event__type-label--${typeLowerCase}" for="event-type-${typeLowerCase}-1">${typePoint}</label>
  </div>`;
  }).join('\n');

const createOptionValueMarkup = (destinations) => destinations
  .map((destination) => `
      <option value="${destination}"></option>`).join('\n');

const createOffersAvailableMarkup = (offers) => offers.map((offer) => `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.title}-1" type="checkbox" name="event-offer-${offer.title}">
    <label class="event__offer-label" for="event-offer-${offer.title}-1">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.priceOffer}</span>
    </label>
    </div>`).join('\n');


const isOffers = (offers) => (offers.length > 0) ? `<section        class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
        ${createOffersAvailableMarkup(offers)}
        </div>
      </section>`
  : '';

const createPhotoListMarkup = (photosList) => photosList
  .map((photo, index) => (`<img class="event__photo" src="${photo.src}" alt="${photo.description}${index + 1}">`
  )).join('\n');

const createDestinationMarkup = (destination) => {
  const { description, pictures } = destination;
  return `
      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${description}</p>
        <div class="event__photos-container">
          <div class="event__photos-tape">
            ${createPhotoListMarkup(pictures)}
          </div>
        </div>
      </section>`;
};

const createFormCreationTemplate = (point) => {
  console.log(point)
  const { type, dateFrom, dateTo, offers, destination } = point;
  const { time, dateValue } = DATE_FORMAT;
  const destinations = DESTINATION;
  const icon = type.toLowerCase();

  return (
    `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-${icon}-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${icon}.png" alt="Event ${icon} icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-${icon}-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${createInputTypeItemMarkup(pointsType)}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
          ${icon}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="Geneva" list="destination-list-1">
          <datalist id="destination-list-1">
            ${createOptionValueMarkup(destinations)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${getFormatDate(dateFrom, dateValue)} ${getFormatDate(dateFrom, time)}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${getFormatDate(dateTo, dateValue)} ${getFormatDate(dateTo, time)}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="">
        </div>
        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Cancel</button>
      </header>
      <section class="event__details">
      ${isOffers(offers)}
      ${createDestinationMarkup(destination)}
      </section>
    </form>
  </li>`
  );
};


export default class FormAddNewPointView {
  constructor({ point }) {
    this.point = point;
  }

  getTemplate() {
    return createFormCreationTemplate(this.point);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
