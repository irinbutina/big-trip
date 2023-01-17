import {render} from '../framework/render.js';
import FormEditView from '../view/form-edit-view.js';
import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import RoutePointView from '../view/route-point-view.js';
import ListEmtyView from '../view/list-empty.js';
import { isEscKey } from '../utils/utils.js';
import { generateFilter } from '../mock/filter.js';

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
  #sortComponent = new SortView();
  #listEmptyComponent = new ListEmtyView();

  constructor({ tripEventsContainer, filtersContainer, pointsModel, offersModel, destinationsModel }) {
    this.#tripEventsContainer = tripEventsContainer;
    this.#filtersContainer = filtersContainer;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
  }

  init() {
    this.#routePoints = [...this.#pointsModel.points];
    this.#offers = [...this.#offersModel.offers];
    this.#destinations = [...this.#destinationsModel.destinations];

    this.#renderBoard();
  }

  #renderFilters () {
    const filters = generateFilter(this.#routePoints);
    render(new FilterView({filters}), this.#filtersContainer);
  }

  #renderEmptyList() {
    render(this.#listEmptyComponent, this.#tripEventsContainer);
  }

  #renderSort() {
    render(this.#sortComponent, this.#tripEventsContainer);
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
        replaceCardToForm.apply(this);
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
      }
    });

    function replaceCardToForm() {
      this.#tripEventsListComponent.element.replaceChild(editPointComponent.element, pointComponent.element);
    }

    function replaceFormToCard() {
      this.#tripEventsListComponent.element.replaceChild(pointComponent.element, editPointComponent.element);
    }

    render(pointComponent, this.#tripEventsListComponent.element);
  }

  #renderPoints() {
    this.#routePoints.forEach((point) => this.#renderPoint(point, this.#offers, this.#destinations));
  }

  #renderPointsList() {
    render(this.#tripEventsListComponent, this.#tripEventsContainer);
    this. #renderPoints();
  }

  #renderBoard() {
    this.#renderFilters();

    if (!this.#routePoints.length) {
      this.#renderEmptyList();
      return;
    }

    this.#renderSort();
    this.#renderPointsList();
  }
}
