import { remove, render } from '../framework/render.js';
import SortView from '../view/sort-view.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import ListEmtyView from '../view/list-empty.js';
import PointPresenter from './point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import { SortType, UpdateType, UserAction, FilterType } from '../const.js';
import { sortPointsByPrice, sortPointsByDate } from '../utils/point.js';
import { filtersByType } from '../utils/filter.js';
import { BLANK_POINT } from '../const.js';

export default class RoutePointsPresenter {
  #tripEventsContainer = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #filterModel = null;
  #sortComponent = null;

  #offers = null;
  #destinations = [];
  #pointsPresenters = new Map();
  #newPointPresenter = null;
  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;

  #listEmptyComponent = null;


  #tripEventsListComponent = new TripEventsListView();

  constructor({ tripEventsContainer, pointsModel, offersModel, destinationsModel, filterModel, onNewPointDestroy }) {
    this.#tripEventsContainer = tripEventsContainer;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#filterModel = filterModel;
    this.#destinationsModel = destinationsModel;

    this.#offers = this.#offersModel.offers;
    this.#destinations = this.#destinationsModel.destinations;

    this.#newPointPresenter = new NewPointPresenter({
      offers: this.#offers,
      destinations: this.#destinations,
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
    console.log(points)

    switch (this.#currentSortType) {
      case SortType.DAY:
        // console.log(filteredPoints)
        return filteredPoints.sort(sortPointsByDate);
      case SortType.PRICE:
        // console.log(filteredPoints)
        return filteredPoints.sort(sortPointsByPrice);
    }
    return filteredPoints;
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
        this.#pointsPresenters.get(data.id).init(data, this.#offers, this.#destinations);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetSortType: true});
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

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      offers: this.#offers,
      destinations: this.#destinations,
      tripEventsListContainer: this.#tripEventsListComponent.element,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange
    });
    pointPresenter.init(point);
    this.#pointsPresenters.set(point.id, pointPresenter);
  }

  #renderPoints(points) {
    points.forEach((point) => this.#renderPoint(point, this.#offers, this.#destinations));
  }

  #clearBoard({resetSortType = false} = {}) {
    this.#newPointPresenter.destroy();
    this.#pointsPresenters.forEach((presenter) => presenter.destroy());
    this.#pointsPresenters.clear();
    remove(this.#sortComponent);


    if (this.#listEmptyComponent) {
      remove(this.#listEmptyComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  #renderBoard() {
    const points = this.points;
    console.log(points)

    if (points.length === 0) {
      this.#renderEmptyList();
      return;
    }

    this.#renderSort();
    render(this.#tripEventsListComponent, this.#tripEventsContainer);
    this.#renderPoints(points);
  }

  createPoint() {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init();
  }
}
