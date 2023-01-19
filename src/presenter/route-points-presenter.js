import {remove, render} from '../framework/render.js';
import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import ListEmtyView from '../view/list-empty.js';
import { generateFilter } from '../mock/filter.js';
import PointPresenter from './point-presenter.js';
import { getPossibleOffers, getCurrentDestination, updateItem } from '../utils/utils.js';
import { SortType } from '../const.js';
import { sortPointsByPrice, sortPointsByDate } from '../utils/point.js';

export default class RoutePointsPresenter {
  #tripEventsContainer = null;
  #filtersContainer = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #sortComponent = null;

  #routePoints = [];
  #offers = [];
  #destinations = [];
  #pointsPresenter = new Map();
  #currentSortType = SortType.DAY;

  #tripEventsListComponent = new TripEventsListView();
  #listEmptyComponent = new ListEmtyView();

  #sourcedRoutePoints = [];

  constructor({ tripEventsContainer, filtersContainer, pointsModel, offersModel, destinationsModel }) {
    this.#tripEventsContainer = tripEventsContainer;
    this.#filtersContainer = filtersContainer;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
  }

  init() {
    this.#routePoints = [...this.#pointsModel.points].sort(sortPointsByDate);
    this.#offers = [...this.#offersModel.offers];
    this.#destinations = [...this.#destinationsModel.destinations];

    this.#sourcedRoutePoints = [...this.#pointsModel.points];

    this.#renderBoard();
  }

  #handleModeChange = () => {
    this.#pointsPresenter.forEach((presenter) => presenter.resetView());
  };

  #handlePointChange = (updatedPoint) => {
    this.#routePoints = updateItem(this.#routePoints, updatedPoint);
    this.#sourcedRoutePoints = updateItem(this.#sourcedRoutePoints, updatedPoint);
    this.#pointsPresenter.get(updatedPoint.id).init(updatedPoint, this.#offers, this.#destinations);
  };

  #sortPoints(sortType) {
    switch (sortType) {
      case SortType.DAY:
        this.#routePoints.sort(sortPointsByDate);
        break;
      case SortType.PRICE:
        this.#routePoints.sort(sortPointsByPrice);
        break;
    }
    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#clearPointList();
    remove(this.#sortComponent);
    this.#sortPoints(sortType);
    this.#renderSort();
    this.#renderPointsList();
  };


  #renderFilters () {
    const filters = generateFilter(this.#routePoints);
    render(new FilterView({filters}), this.#filtersContainer);
  }

  #renderEmptyList() {
    render(this.#listEmptyComponent, this.#tripEventsContainer);
  }

  #renderSort() {
    this.#sortComponent = new SortView({
      currentSort: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });
    render(this.#sortComponent, this.#tripEventsContainer);
  }

  #renderPoint(point, offers, destinations) {
    const pointPresenter = new PointPresenter({
      tripEventsListContainer: this.#tripEventsListComponent.element,
      onDataChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange
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
