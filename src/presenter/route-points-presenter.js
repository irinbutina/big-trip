import {render} from '../framework/render.js';
import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import ListEmtyView from '../view/list-empty.js';
import { generateFilter } from '../mock/filter.js';
import PointPresenter from './point-presenter.js';

export default class RoutePointsPresenter {
  #tripEventsContainer = null;
  #filtersContainer = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;

  #routePoints = [];
  #offers = [];
  #destinations = [];
  #pointsPresenter = new Map();

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
    const pointPresenter = new PointPresenter({
      tripEventsListContainer: this.#tripEventsListComponent.element,
    });
    pointPresenter.init(point, offers, destinations);
    this.#pointsPresenter.set(point.id, pointPresenter);
  }

  #renderPoints() {
    this.#routePoints.forEach((point) => this.#renderPoint(point, this.#offers, this.#destinations));
  }

  #clearPointList() {
    this.#pointsPresenter.forEach((presenter) => presenter.destroy());
    this.#pointsPresenter.clear();
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
