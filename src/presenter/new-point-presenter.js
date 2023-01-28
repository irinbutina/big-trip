import {remove, render, RenderPosition} from '../framework/render.js';
import FormEditView from '../view/form-edit-view.js';
import {nanoid} from 'nanoid';
import {UserAction, UpdateType} from '../const.js';
import { isEscKey } from '../utils/utils.js';


export default class NewPointPresenter {
  #tripEventsListContainer = null;
  #handleDataChange = null;
  #handleDestroy = null;

  #editPointComponent = null;
  #destinations = null;
  #offers = null;

  constructor({offers, destinations, tripEventsListContainer, onDataChange, onDestroy}) {
    this.#offers = offers;
    this.#destinations = destinations;
    this.#tripEventsListContainer = tripEventsListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init() {
    if (this.#editPointComponent !== null) {
      return;
    }

    this.#editPointComponent = new FormEditView({
      offers: this.#offers,
      destinations: this.#destinations,
      onEditPointSubmit: this.#handleEditPointSubmit,
      onEditPointDeleteClick: this.#handleDeleteClick,
    });

    render(this.#editPointComponent, this.#tripEventsListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#onEscKeyDown);
  }

  destroy() {
    if (this.#editPointComponent === null) {
      return;
    }

    this.#handleDestroy();

    remove(this.#editPointComponent);
    this.#editPointComponent = null;

    document.removeEventListener('keydown', this.#onEscKeyDown);
  }

  #handleEditPointSubmit = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      {id: nanoid(), ...point},
    );
    this.destroy();
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #onEscKeyDown = (evt) => {
    if (isEscKey(evt)) {
      evt.preventDefault();
      this.destroy();
    }
  };


}
