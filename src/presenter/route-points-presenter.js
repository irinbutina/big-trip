import FormEditView from '../view/form-edit-view.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import RoutePointView from '../view/route-point-view.js';
import { render } from '../utils/render.js';

export default class RoutePointsPresenter {
  #tripEventsContainer = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;

  #routePoints = [];
  #offers = [];
  #destinations = [];

  #tripEventsListComponent = new TripEventsListView();

  constructor({ tripEventsContainer, pointsModel, offersModel, destinationsModel }) {
    this.#tripEventsContainer = tripEventsContainer;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
  }

  init() {
    this.#routePoints = [...this.#pointsModel.points];
    this.#offers = [...this.#offersModel.offers];
    this.#destinations = [...this.#destinationsModel.destinations];

    render(this.#tripEventsListComponent, this.#tripEventsContainer);
    for (let i = 0; i < this.#routePoints.length; i++) {
      this.#renderPoint(this.#routePoints[i]);
    }
  }

  #renderPoint(point) {
    const pointComponent = new RoutePointView({
      point,
      offers: this.#offers,
      destinations: this.#destinations,
    });

    render(pointComponent, this.#tripEventsListComponent.element);
  }
}
