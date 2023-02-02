import {remove, render, RenderPosition} from '../framework/render.js';
import FormEditView from '../view/form-edit-view.js';
import {UserAction, UpdateType} from '../const.js';
import { isEscKey } from '../utils/utils.js';

export default class NewPointPresenter {
  #tripEventsListContainer = null;
  #handleDataChange = null;
  #handleDestroy = null;

  #editPointComponent = null;
  #point = null;
  #destinations = [];
  #offers = [];

  constructor({tripEventsListContainer, onDataChange, onDestroy}) {
    this.#tripEventsListContainer = tripEventsListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init(point, offers, destinations) {
    this.#point = point;
    this.#offers = offers;
    this.#destinations = destinations;

    if (this.#editPointComponent !== null) {
      return;
    }

    this.#editPointComponent = new FormEditView({
      point: this.#point,
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

  setSaving() {
    this.#editPointComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#editPointComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#editPointComponent.shake(resetFormState);
  }

  #handleEditPointSubmit = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point,
    );
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
