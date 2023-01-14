import AbstractView from '../framework/view/abstract-view.js';

const createFilterItemTemplate = (filter, isChecked) => {
  const { name, count } = filter;
  return (
    `<div class="trip-filters__filter">
    <input id="filter-${name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${name}"  ${count === 0 ? 'disabled' : ''}
    ${isChecked ? 'checked' : ''}>
    <label class="trip-filters__filter-label" for="filter-${name}">${name}</label>
  </div>`
  );
};

const createFilterTemplate = (filters) => {
  const filtersTemplate = filters.map((filter, index) => createFilterItemTemplate(filter, index === 0)).join('\n');
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

  constructor({filters} ) {
    super();
    this.#filters = filters;
  }


  get template() {
    return createFilterTemplate(this.#filters);
  }
}
