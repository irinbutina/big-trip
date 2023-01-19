import AbstractView from '../framework/view/abstract-view';
import { SortsTitle } from '../const';

const createSortItemTemplate = (sortItem, currentSortType) => {
  const { title, type, isDisabled } = sortItem;
  const dataAtr = `data-sort-type="${type}"`;

  return (
    `<div class="trip-sort__item  trip-sort__item--${title}">
        <input id="sort-${title}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${title}" ${currentSortType === type ? 'checked' : ''} ${!isDisabled ? dataAtr : 'disabled'} >
        <label class="trip-sort__btn" for="sort-${title}">${title}</label>
      </div>`
  );
};


const createSortTemplate = (currentSortType) => {
  const sortItemsTemplate = SortsTitle.map((item) => createSortItemTemplate(item, currentSortType)).join('\n');
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${sortItemsTemplate}

    </form>`
  );
};


export default class SortView extends AbstractView {
  #currentSortType = null;
  #handleSortTypeChange = null;

  constructor({currentSort, onSortTypeChange}) {
    super();
    this.#currentSortType = currentSort;
    this.#handleSortTypeChange = onSortTypeChange;

    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  get template() {
    return createSortTemplate( this.#currentSortType);
  }

  #sortTypeChangeHandler = (evt) => {
    if (!evt.target.dataset.sortType) {
      return;
    }
    evt.preventDefault();
    this.#handleSortTypeChange(evt.target.dataset.sortType);

  };
}
