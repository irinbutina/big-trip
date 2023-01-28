import {render, replace, remove} from '../framework/render.js';
import FormEditView from '../view/form-edit-view.js';
import RoutePointView from '../view/route-point-view.js';
import { isEscKey, isDatesEqual, isPriceEqual } from '../utils/utils.js';
import {UserAction, UpdateType, FormType } from '../const.js' ;

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


  constructor ({offers, destinations, tripEventsListContainer, onDataChange,onModeChange}) {
    this.#offers = offers;
    this.#destinations = destinations;
    this.#tripEventsListContainer = tripEventsListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }


  init(point) {
    this.#point = point;

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
      onEditPointClick: this.#handleEditPointClick,
      onEditPointSubmit: this.#handleEditPointSubmit,
      onEditPointDeleteClick: this.#handleDeleteClick,
      formType: FormType.EDITING
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
      this.#editPointComponent.reset(this.#point);
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
      this.#editPointComponent.reset(this.#point);
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
    this.#editPointComponent.reset(this.#point);
    this.#replaceFormToCard();
  };

  #handleEditPointSubmit = (update) => {
    // Проверяем, поменялись ли в задаче данные, которые попадают под фильтрацию,
    // а значит требуют перерисовки списка - если таких нет, это PATCH-обновление.
    //к ним относятстя изменение дат и цены
    const isMinorUpdate =
      !isDatesEqual(this.#point.dateFrom, update.dateFrom) ||
      !isDatesEqual(this.#point.dateTo, update.dateTo) ||
      !isPriceEqual(this.#point.basePrice, update.basePrice);

    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      update,
    );
    this.#replaceFormToCard();
  };

  #handleDeleteClick = (point) => {
    this.#handleDataChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point
    );
  };
}
