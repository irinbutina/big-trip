import { createElement } from '../utils/render.js';
import { LIST_EMPTY_MESSAGES} from '../const.js';

function createListEmptyTemplate() {
  return (
    `<p class="trip-events__msg">
    ${LIST_EMPTY_MESSAGES.future}
    </p>`
  );
}


export default class ListEmptyView {
  #element = null;

  get template() {
    return createListEmptyTemplate();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
