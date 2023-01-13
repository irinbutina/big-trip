import {render} from '../framework/render.js';
import FormEditView from '../view/form-edit-view.js';
import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import RoutePointView from '../view/route-point-view.js';
import ListEmtyView from '../view/list-empty.js';
import { isEscKey } from '../utils/utils.js';

export default class RoutePointsPresenter {
  #tripEventsContainer = null;
  #filtersContainer = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;

  #routePoints = [];
  #offers = [];
  #destinations = [];

  #tripEventsListComponent = new TripEventsListView();

  #renderEmptyList() {
    render(new ListEmtyView(), this.#tripEventsContainer);
  }

  constructor({ tripEventsContainer, filtersContainer, pointsModel, offersModel, destinationsModel }) {
    this.#tripEventsContainer = tripEventsContainer;
    this.#filtersContainer = filtersContainer;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
  }

  #renderPoint(point, offers, destinations) {
    const onEscKeyDown = (evt) => {
      if (isEscKey(evt)) {
        evt.preventDefault();
        replaceFormToCard.apply(this);
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    const pointComponent = new RoutePointView({
      point,
      offers,
      destinations,
      onPointClick:  () => {
        replaceCardToForm.call(this);
        document.addEventListener('keydown', onEscKeyDown);
      }
    });

    const editPointComponent = new FormEditView({
      point,
      offers,
      destinations,
      onEditPointClick: () => {
        replaceFormToCard.apply(this);
        document.removeEventListener('keydown', onEscKeyDown);
        console.log('onEditPointClick');
      }
    });

    function replaceCardToForm() {
      this.#tripEventsListComponent.element.replaceChild(editPointComponent.element, pointComponent.element);
    }

    function replaceFormToCard() {
      this.#tripEventsListComponent.element.replaceChild(pointComponent.element, editPointComponent.element);
    }

    editPointComponent.element.addEventListener('submit', (evt) => {
      evt.preventDefault();
      replaceFormToCard.apply(this);
      document.removeEventListener('keydown', onEscKeyDown);
    });

    render(pointComponent, this.#tripEventsListComponent.element);
  }

  init() {
    this.#routePoints = [...this.#pointsModel.points];
    this.#offers = [...this.#offersModel.offers];
    this.#destinations = [...this.#destinationsModel.destinations];

    render(new FilterView(), this.#filtersContainer);

    if (!this.#routePoints.length) {
      this.#renderEmptyList();
      return;
    }

    render(new SortView(), this.#tripEventsContainer);
    render(this.#tripEventsListComponent, this.#tripEventsContainer);

    this.#routePoints.forEach((point) => this.#renderPoint(point, this.#offers, this.#destinations));
  }
}
