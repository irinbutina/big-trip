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
    // const currentPoint = {
    //   point,
    //   offers: this.#offers,
    //   destinations: this.#destinations,
    // };
    // console.log(currentPoint.point)
    // console.log(point)
    // const pointComponent = new RoutePointView({currentPoint});

    // const editPointComponent = new FormEditView({currentPoint});
    const pointComponent = new RoutePointView({
      point,
      offers: this.#offers,
      destinations: this.#destinations,
    });

    const editPointComponent = new FormEditView({
      point,
      destinations: this.#destinations,
      offers: this.#offers,
    });

    const replaceCardToForm = () => {
      this.#tripEventsListComponent.element.replaceChild(editPointComponent.element, pointComponent.element);
    };

    const replaceFormToCard = () => {
      this.#tripEventsListComponent.element.replaceChild(pointComponent.element, editPointComponent.element);
    };

    pointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replaceCardToForm();
    });

    editPointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replaceFormToCard();
    });

    render(pointComponent, this.#tripEventsListComponent.element);
  }
}
