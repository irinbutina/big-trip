import {render, replace, remove} from '../framework/render.js';
import FormEditView from '../view/form-edit-view.js';
import RoutePointView from '../view/route-point-view.js';
import { isEscKey } from '../utils/utils.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #tripEventsListContainer = null;
  #handleDataChange = null;
  #handleModeChange = null;

  #pointComponent = null;
  #editPointComponent = null;

  #point = null;
  #offers = null;
  #destinations = null;

  #mode = Mode.DEFAULT;


  constructor ({tripEventsListContainer, onDataChange,onModeChange}) {
    this.#tripEventsListContainer = tripEventsListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(point, offers, destinations) {
    this.#point = point;
    this.#offers = offers;
    this.#destinations = destinations;

    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#editPointComponent;

    this.#pointComponent = new RoutePointView({
      point: this.#point,
      offers: this.#offers,
      destinations: this.#destinations,
      onPointClick: this.#handlePointClick,
    });

    this.#editPointComponent = new FormEditView({
      point: this.#point,
      offers: this.#offers,
      destinations: this.#destinations,
      onEditPointClick: this.#handleEditPointClick
    });

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#pointComponent, this.#tripEventsListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace (this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace (this.#editPointComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToCard();
    }
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#editPointComponent);
  }


  #onEscKeyDown = (evt) => {
    if (isEscKey(evt)) {
      evt.preventDefault();
      this.#replaceFormToCard();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  };

  #replaceCardToForm() {
    replace(this.#editPointComponent, this.#pointComponent);document.addEventListener('keydown', this.#onEscKeyDown);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToCard() {
    replace(this.#pointComponent, this.#editPointComponent);
    document.removeEventListener('keydown', this.#onEscKeyDown);
    this.#mode = Mode.DEFAULT;
  }

  #handlePointClick = () => {
    this.#replaceCardToForm();
  };

  #handleEditPointClick = () => {
    this.#replaceFormToCard();
  };

  // #handleDataChange = () => {

  // }

}

