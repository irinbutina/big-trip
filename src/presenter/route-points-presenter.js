import FormEditionView from '../view/form-editing-view.js';
import FormCreationView from '../view/form-creation-view.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import RoutePointView from '../view/route-point-view.js';
import {render} from '../render.js';
const POINTS_AMOUNT = 3;

export default class RoutePointsPresenter {
  tripEventsListComponent = new TripEventsListView();

  constructor({tripEventsContainer}) {
    this.tripEventsContainer = tripEventsContainer;
  }

  init() {
    render(this.tripEventsListComponent, this.tripEventsContainer);
    render(new FormCreationView(), this.tripEventsListComponent.getElement());
    render(new FormEditionView(), this.tripEventsListComponent.getElement());

    for (let i = 0; i < POINTS_AMOUNT; i++) {
      render(new RoutePointView(), this.tripEventsListComponent.getElement());
    }
  }
}
