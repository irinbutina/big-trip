import AbstractView from '../framework/view/abstract-view.js';

const createFilterItemTemplate = (filter, currentFilterType) => {
  const { type, count } = filter;
  const dataAtr = `data-filter-type="${type}"`;
  return (
    `<div class="trip-filters__filter">
    <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}" ${dataAtr} ${count === 0 ? 'disabled' : ''}
    ${currentFilterType === type ? 'checked' : ''}>
    <label class="trip-filters__filter-label" for="filter-${type}">${type}</label>
  </div>`
  );
};

const createFilterTemplate = (filters, currentFilterType) => {
  const filtersTemplate = filters.map((filter) => createFilterItemTemplate(filter, currentFilterType)).join('\n');
  return (
    `<form class="trip-filters" action="#" method="get">
      ${filtersTemplate}
      </div>
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

export default class FilterView extends AbstractView {
  #filters = null;
  #currentFilterType = null;
  #handleFilterClick = null;

  constructor({filters, currentFilterType, onFilterChange} ) {
    super();
    this.#filters = filters;
    this.#currentFilterType = currentFilterType;
    this.#handleFilterClick = onFilterChange;

    this.element.addEventListener('click', this.#filterClickHandler);
  }

  get template() {
    return createFilterTemplate(this.#filters, this.#currentFilterType);
  }

  #filterClickHandler = (evt) => {
    if (!evt.target.dataset.filterType) {
      return;
    }
    evt.preventDefault();
    this.#handleFilterClick(evt.target.dataset.filterType);
  };
}
