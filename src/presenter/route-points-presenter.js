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

    const formEditViewAdd = new FormEditView({
      // point: this.#routePoints[0],
      // destinations: this.#destinations,
      // offers: this.#offers,
    });

    const formEditViewEdit = new FormEditView({
      point: this.#routePoints[0],
      destinations: this.#destinations,
      offers: this.#offers,
    });

    render(this.#tripEventsListComponent, this.#tripEventsContainer);
    render(formEditViewAdd, this.#tripEventsListComponent.element);
    render(formEditViewEdit, this.#tripEventsListComponent.element);

    for (let i = 0; i < this.#routePoints.length; i++) {
      const routePointView = new RoutePointView({
        point: this.#routePoints[i],
        offers: this.#offers,
        destinations: this.#destinations,
      });
      render(routePointView, this.#tripEventsListComponent.element);
    }
  }
}
