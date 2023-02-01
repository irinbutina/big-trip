import AbstractView from '../framework/view/abstract-view';

function createErrorTemplate() {
  return '<p class="trip-events__msg">Data connection error. Please try again later.</p>';
}

export default class ErrorView extends AbstractView {

  get template() {
    return createErrorTemplate();
  }
}
