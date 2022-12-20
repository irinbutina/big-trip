import FormEditionView from '../view/form-editing-view.js';
import FormAddNewPointView from '../view/form-add-new-point-view.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import RoutePointView from '../view/route-point-view.js';
import {render} from '../render.js';

export default class RoutePointsPresenter {
  tripEventsListComponent = new TripEventsListView();

  constructor({tripEventsContainer, pointsModel}) {
    this.tripEventsContainer = tripEventsContainer;
    this.pointsModel = pointsModel;
  }

  init() {
    this.routePoints = [...this.pointsModel.getPoints()];

    render(this.tripEventsListComponent, this.tripEventsContainer);
    render(new FormAddNewPointView({point: this.routePoints[0]}), this.tripEventsListComponent.getElement());
    render(new FormEditionView(), this.tripEventsListComponent.getElement());

    for (let i = 0; i < this.routePoints.length; i++) {
      render(new RoutePointView({point: this.routePoints[i]}), this.tripEventsListComponent.getElement());
    }
  }
}
