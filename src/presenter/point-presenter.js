import {render, replace, remove} from '../framework/render.js';
import FormEditView from '../view/form-edit-view.js';
import RoutePointView from '../view/route-point-view.js';
import { isEscKey } from '../utils/utils.js';


export default class PointPresenter {
  #tripEventsListContainer = null;

  #pointComponent = null;
  #editPointComponent = null;

  #point = null;
  #offers = null;
  #destinations = null;

  constructor ({tripEventsListContainer}) {
    this.#tripEventsListContainer = tripEventsListContainer;
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

    if (this.#tripEventsListContainer.contains(prevPointComponent.element)) {
      replace (this.#pointComponent, prevPointComponent);
    }

    if (this.#tripEventsListContainer.contains(prevPointEditComponent.element)) {
      replace (this.#editPointComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
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
  }

  #replaceFormToCard() {
    replace(this.#pointComponent, this.#editPointComponent);
    document.removeEventListener('keydown', this.#onEscKeyDown);
  }

  #handlePointClick = () => {
    this.#replaceCardToForm();
  };

  #handleEditPointClick = () => {
    this.#replaceFormToCard();
  };

}

