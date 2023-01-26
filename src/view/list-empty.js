import AbstractView from '../framework/view/abstract-view.js';
import { LIST_EMPTY_MESSAGES} from '../const.js';

function createListEmptyTemplate(filterType) {
  const listEmptyTextValue = LIST_EMPTY_MESSAGES[filterType];

  return (
    `<p class="trip-events__msg">
    ${listEmptyTextValue}
    </p>`
  );
}


export default class ListEmptyView extends AbstractView {
  #filterType = null;

  constructor ({filterType}) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createListEmptyTemplate(this.#filterType);
  }
}
