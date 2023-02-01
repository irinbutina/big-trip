import { remove, render } from '../framework/render.js';
import SortView from '../view/sort-view.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import ListEmtyView from '../view/list-empty.js';
import LoadingView from '../view/loading-view.js';
import PointPresenter from './point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import { SortType, UpdateType, UserAction, FilterType, BLANK_POINT } from '../const.js';
import { sortPointsByPrice, sortPointsByDate } from '../utils/point.js';
import { filtersByType } from '../utils/filter.js';

export default class RoutePointsPresenter {
  #tripEventsContainer = null;
  #pointsModel = null;
  #filterModel = null;
  #sortComponent = null;

  #pointsPresenters = new Map();
  #newPointPresenter = null;
  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;

  #listEmptyComponent = null;

  #tripEventsListComponent = new TripEventsListView();
  #loadingComponent = new LoadingView();
  #isLoading = true;
  #isError = false;

  constructor({ tripEventsContainer, pointsModel, filterModel, onNewPointDestroy }) {
    this.#tripEventsContainer = tripEventsContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#newPointPresenter = new NewPointPresenter({
      tripEventsListContainer: this.#tripEventsListComponent.element,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewPointDestroy,
    });

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filtersByType[this.#filterType](points);
    switch (this.#currentSortType) {
      case SortType.DAY:
        return filteredPoints.sort(sortPointsByDate);
      case SortType.PRICE:
        return filteredPoints.sort(sortPointsByPrice);
    }
    return filteredPoints;
  }

  get offers() {
    return this.#pointsModel.offers;
  }

  get destinations() {
    return this.#pointsModel.destinations;
  }

  init() {
    this.#renderBoard();
  }

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointsPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = (actionType, updateType, update) => {

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
    // Здесь будем вызывать обновление модели.
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // update - обновленные данные
  };

  #handleModelEvent = (updateType, data) => {
    // В зависимости от типа изменений решаем, что делать:
    // - обновить часть списка (например, когда поменялось описание)
    // - обновить список (например, когда задача ушла в архив)
    // - обновить всю доску (например, при переключении фильтра)
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointsPresenters.get(data.id).init(data, this.offers, this.destinations);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetSortType: true});
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
      case UpdateType.ERROR:
        this.#isError = true;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#renderBoard();
  };

  #renderEmptyList() {
    this.#listEmptyComponent = new ListEmtyView({
      filterType: this.#filterType,
    });
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
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange
    });
    pointPresenter.init(point, offers, destinations);
    this.#pointsPresenters.set(point.id, pointPresenter);
  }

  #renderPoints(points) {
    points.forEach((point) => this.#renderPoint(point, this.offers, this.destinations));
  }

  #clearBoard({resetSortType = false} = {}) {
    this.#newPointPresenter.destroy();
    this.#pointsPresenters.forEach((presenter) => presenter.destroy());
    this.#pointsPresenters.clear();
    remove(this.#sortComponent);
    console.log(this.#loadingComponent)
    remove(this.#loadingComponent);


    if (this.#listEmptyComponent) {
      remove(this.#listEmptyComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  #renderBoard() {

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    const points = this.points;

    if (points.length === 0) {
      this.#renderEmptyList();
      return;
    }

    this.#renderSort();
    render(this.#tripEventsListComponent, this.#tripEventsContainer);
    this.#renderPoints(points);
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#tripEventsContainer);
  }

  createPoint() {
    const point = BLANK_POINT;
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init(point, this.offers, this.destinations);
  }

}
