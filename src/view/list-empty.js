import AbstractView from '../framework/view/abstract-view.js';
import { LIST_EMPTY_MESSAGES} from '../const.js';

function createListEmptyTemplate() {
  return (
    `<p class="trip-events__msg">
    ${LIST_EMPTY_MESSAGES.past}
    </p>`
  );
}


export default class ListEmptyView extends AbstractView {

  get template() {
    return createListEmptyTemplate();
  }
}
