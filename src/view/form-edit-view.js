import he from 'he';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { pointsType, DATE_FORMAT, FormType, BLANK_POINT } from '../const.js';
import { getFormatDate, getOfferAtr, getPossibleOffers, getCurrentDestination } from '../utils/utils.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';


const ResetButtonText = {
  CANCEL: 'Cancel',
  DELETE: 'Delete',
};

const createRollupButtonTemplate = () =>
  `<button class="event__rollup-btn" type="button">
    <span class="visually-hidden">Open event</span>
  </button>`;

const createPointsTypeMenuTemplate = (currentType, id) =>
  pointsType.map((typePoint) => {
    const typeLowerCase = typePoint.toLowerCase();
    const isChecked = currentType.toLowerCase() === typeLowerCase ? 'checked' : '';
    return `<div class="event__type-item">
    <input id="event-type-${typeLowerCase}-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${typeLowerCase}" ${isChecked}>
    <label class="event__type-label  event__type-label--${typeLowerCase}" for="event-type-${typeLowerCase}-${id}">${typePoint}</label>
</div>`;
  }).join('\n');

const createDestinationsListTemplate = (destinations) => destinations
  .map((destination) => `
      <option value="${destination}"></option>`).join('\n');

const getDestinationCurrentName = (id, destinations) => destinations.map((destination) => id === destination.id ? destination.destinationName : '').join('');

const createPhotoListTemplate = (pictures) => pictures
  .map((picture) => (`<img class="event__photo" src="${picture.src}" alt="${picture.description}">`
  )).join('\n');

const createDestinationTemplate = (destination) => {
  const { description, pictures } = destination;
  return `
      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${description}</p>
        <div class="event__photos-container">
          <div class="event__photos-tape">
            ${createPhotoListTemplate(pictures)}
          </div>
        </div>
      </section>`;
};

const createOffersAvailableTemplate = (offers, offersId) => offers.map((offer) => {
  const { title, price, id } = offer;
  const isChecked = offersId.includes(id) ? 'checked' : '';

  return (
    `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" data-offer-id="${id}" id="event-offer-${getOfferAtr(title)}-${id}" type="checkbox" name="event-offer-${getOfferAtr(title)}" ${isChecked}>
    <label class="event__offer-label" for="event-offer-${getOfferAtr(title)}-${id}">
      <span class="event__offer-title">${title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${price}</span>
    </label>
    </div>`
  );
}).join('\n');

const isOffers = (offers, offersId) => offers.length !== 0 ? `<section  class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
        ${createOffersAvailableTemplate(offers, offersId)}
        </div>
      </section>`
  : '';


const createFormEditTemplate = (point, offers, destinations, formType) => {
  const { id, type, dateFrom, dateTo, offersId, destinationId, basePrice } = point;

  let isEditPoint = true;

  if (formType === FormType.ADDING) {
    isEditPoint = false;
  }

  const rollupButtonTemplate = isEditPoint ? createRollupButtonTemplate() : '';

  const resetButtonText = isEditPoint ? ResetButtonText.DELETE : ResetButtonText.CANCEL;

  const icon = type.toLowerCase();

  const possibleOffers = offers.length !== 0 ? getPossibleOffers(offers, type) : [];

  const checkedOffers = isOffers(possibleOffers, offersId);

  const pointsTypeMenu = createPointsTypeMenuTemplate(type, id);

  const destination = getCurrentDestination(destinations, destinationId);

  const destinationTemplate = destination ? createDestinationTemplate(destination) : '';
  const destinationsList = destinations.map((dest) => dest.destinationName);
  const destinationCurrentName = getDestinationCurrentName(destinationId, destinations);
  const destinationsListTemplate = createDestinationsListTemplate(destinationsList);


  const { time, dateValue } = DATE_FORMAT;

  const formatDateValueTo = dateTo !== null ? `${getFormatDate(dateTo, dateValue)} ${getFormatDate(dateTo, time)}` : '';
  const formatDateValueFrom = dateFrom !== null ? `${getFormatDate(dateFrom, dateValue)} ${getFormatDate(dateFrom, time)}` : '';

  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="" method="post">
      <header class="event__header">
       <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-${icon}-toggle-${id}">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${icon}.png" alt="Event ${icon} icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-${icon}-toggle-${id}" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
            ${pointsTypeMenu}
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-${destinationId}">
        ${type}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-${destinationId}" type="text" name="event-destination" value="${he.encode(destinationCurrentName)}" list="destination-list-1">
        <datalist id="destination-list-1">
        ${destinationsListTemplate}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1}" type="text" name="event-start-time" value="${formatDateValueFrom}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-${id}">To</label>
          <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${formatDateValueTo}">
        </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-${id}">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-${id}" type="number" pattern="[1-9]+"  name="event-price" value="${basePrice}">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">${resetButtonText}</button>
      ${rollupButtonTemplate}
    </header>
    <section class="event__details">
    ${checkedOffers}
    ${destinationTemplate}
    </section>
  </form>
  </li>`
  );
};


export default class FormEditView extends AbstractStatefulView {
  #offers = null;
  #destinations = null;
  #handleEditPointSubmit = null;
  #handleEditPointClick = null;
  #handleEditPointDelete = null;
  #formType = null;
  #datepickerFrom = null;
  #datepickerTo = null;

  constructor({ point = BLANK_POINT, offers, destinations, onEditPointClick, onEditPointSubmit, onEditPointDeleteClick, formType = FormType.ADDING}) {
    super();
    this._setState(FormEditView.parsePointToState(point, this.#formType));
    this.#offers = offers;
    this.#destinations = destinations;
    this.#handleEditPointClick = onEditPointClick;
    this.#handleEditPointSubmit = onEditPointSubmit;
    this.#handleEditPointDelete = onEditPointDeleteClick;
    this.#formType = formType;
    this._restoreHandlers();
  }

  get template() {
    return createFormEditTemplate(this._state, this.#offers, this.#destinations, this.#formType);
  }

  reset(point) {
    this.updateElement(FormEditView.parsePointToState(point));
  }

  _restoreHandlers() {
    const rollupButtonElement = this.element.querySelector('.event__rollup-btn');
    if (rollupButtonElement) {
      rollupButtonElement.addEventListener('click', this.#clickEditPointkHandler);
    }
    // this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#clickEditPointkHandler);

    this.element.querySelector('form').addEventListener('submit', this.#editPointSubmitHandler);

    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#editPointDeleteHandler);

    this.element.querySelector('.event__input--destination').addEventListener('change', this.#pointDestinationInputHandler);

    this.element.querySelector('.event__input--price').addEventListener('input', this.#pointPriceInputHandler);

    this.element.querySelector('.event__type-list').addEventListener('change', this.#pointTypeChangeHandler);

    // console.log(this.#offers, this._state.type)

    if ((getPossibleOffers(this.#offers, this._state.type)).length) {
      this.element.querySelector('.event__available-offers')
        .addEventListener('change', this.#pointOfferChangeHandler);
    }

    this.#setDateFromPicker();
    this.#setDateToPicker();

  }

  #setDateFromPicker() {
    this.#datepickerFrom = flatpickr(
      this.element.querySelector('input[name=event-start-time'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateFrom,
        maxDate: this._state.dateTo,
        onChange: this.#pointDateFromChangeHandler,
        time24hr: true
      },
    );
  }

  #setDateToPicker() {
    this.#datepickerTo = flatpickr(
      this.element.querySelector('input[name=event-end-time'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateTo,
        minDate: this._state.dateFrom,
        onChange: this.#pointDateToChangeHandler,
        time24hr: true
      },
    );
  }

  static parsePointToState(point) {
    return {
      ...point,
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    };
  }

  static parseStateToPoint(state) {
    const point = { ...state };

    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;

    return point;
  }

  removeElement() {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }
    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  }

  #pointDestinationInputHandler = (evt) => {
    if(!this.#destinations.map((destination) => destination.destinationName).includes(evt.target.value)) {
      evt.target.setCustomValidity('Choose one of the available cities.');
    } else {
      evt.target.setCustomValidity('');
    }

    evt.preventDefault();
    const selectedDestination = this.#destinations.find((destination) => evt.target.value === destination.destinationName);
    if (selectedDestination) {
      this.updateElement({
        destinationId: selectedDestination.id
      });
    }
  };

  #pointPriceInputHandler = (evt) => {
    if (!new RegExp(/^[1-9]\d{0,5}$/).test(+evt.target.value) ||
      evt.target.value < 1) {
      evt.target.setCustomValidity('Enter a positive integer.');
    } else {
      evt.target.setCustomValidity('');
    }

    evt.preventDefault();
    this._setState({
      basePrice: +evt.target.value
    });
  };

  #pointTypeChangeHandler = (evt) => {
    evt.preventDefault();

    const selectedType = evt.target.value;
    this.updateElement({
      type: selectedType,
    });
  };

  #pointOfferChangeHandler = (evt) => {
    evt.preventDefault();
    const currentOfferId = +evt.target.dataset.offerId;

    const currentOfferIdIndex = this._state.offersId.indexOf(currentOfferId);

    if (currentOfferIdIndex === -1) {
      this._state.offersId.push(currentOfferId);
    } else {
      this._state.offersId.splice(currentOfferIdIndex, 1);
    }
  };

  #pointDateFromChangeHandler = ([userDate]) => {
    this.updateElement({
      dateFrom: userDate,
    });
  };

  #pointDateToChangeHandler = ([userDate]) => {
    this.updateElement({
      dateTo: userDate,
    });
  };

  #clickEditPointkHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditPointClick();
  };

  #editPointSubmitHandler = (evt) => {
    evt.preventDefault();

    this.#handleEditPointSubmit(FormEditView.parseStateToPoint(this._state));
  };

  #editPointDeleteHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditPointDelete(FormEditView.parseStateToPoint(this._state));
  };
}


