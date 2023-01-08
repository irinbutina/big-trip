import FormEditionView from '../view/form-editing-view.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import RoutePointView from '../view/route-point-view.js';
import { render } from '../utils/render.js';

export default class RoutePointsPresenter {
  tripEventsListComponent = new TripEventsListView();

  constructor({ tripEventsContainer, pointsModel, offersModel, destinationsModel }) {
    this.tripEventsContainer = tripEventsContainer;
    this.pointsModel = pointsModel;
    this.offersModel = offersModel;
    this.destinationsModel = destinationsModel;
  }

  init() {
    this.routePoints = [...this.pointsModel.points];
    this.offers = [...this.offersModel.offers];
    this.destinations = [...this.destinationsModel.destinations];

    const formEditionViewAdd = new FormEditionView({
      // point: this.routePoints[0],
      // destinations: this.destinations,
      // offers: this.offers,
    });

    const formEditionViewEdit = new FormEditionView({
      point: this.routePoints[0],
      destinations: this.destinations,
      offers: this.offers,
    });

    render(this.tripEventsListComponent, this.tripEventsContainer);
    render(formEditionViewAdd, this.tripEventsListComponent.element);
    render(formEditionViewEdit, this.tripEventsListComponent.element);

    for (let i = 0; i < this.routePoints.length; i++) {
      const routePointView = new RoutePointView({
        point: this.routePoints[i],
        offers: this.offers,
        destinations: this.destinations,
      });
      render(routePointView, this.tripEventsListComponent.element);
    }
  }
}
