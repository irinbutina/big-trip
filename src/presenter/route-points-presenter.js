import FormEditionView from '../view/form-editing-view.js';
// import FormAddNewPointView from '../view/form-add-new-point-view.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import RoutePointView from '../view/route-point-view.js';
import {render} from '../render.js';

export default class RoutePointsPresenter {
  tripEventsListComponent = new TripEventsListView();

  constructor({tripEventsContainer, pointsModel, offersModel, destinationsModel}) {
    this.tripEventsContainer = tripEventsContainer;
    this.pointsModel = pointsModel;
    this.offersModel = offersModel;
    this.destinationsModel = destinationsModel;
  }

  init() {
    this.routePoints = [...this.pointsModel.getPoints()];
    this.offers = [...this.offersModel.getOffers()];
    this.destinations = [...this.destinationsModel.getDestinations()];

    // console.log(this.routePoints);
    // console.log(this.offers);
    // console.log(this.destinations);

    // const formAddNewPointView = new FormAddNewPointView({
    //   point: this.routePoints[0],
    //   destinations: this.destinations,
    //   offers: this.offers,
    // });

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
    // render(formAddNewPointView, this.tripEventsListComponent.getElement());
    render(formEditionViewAdd, this.tripEventsListComponent.getElement());
    render(formEditionViewEdit, this.tripEventsListComponent.getElement());

    for (let i = 0; i < this.routePoints.length; i++) {
      const routePointView = new RoutePointView({
        point: this.routePoints[i],
        offers: this.offers,
        destinations: this.destinations,
      });
      render(routePointView, this.tripEventsListComponent.getElement());
    }
  }
}
