import FilterView from './view/filter-view.js';
import SortingView from './view/sorting-view.js';
import PointsModel from './model/points-model.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destination-model.js';
import RoutePointsPresenter from './presenter/route-points-presenter.js';

import {render} from './render.js';

const siteHeaderElement = document.querySelector('.page-header');
const siteMainElement = document.querySelector('.page-main');

const filtersContainerElement = siteHeaderElement.querySelector('.trip-controls__filters');
const tripEventsElement = siteMainElement.querySelector('.trip-events');

render(new FilterView(), filtersContainerElement);
render(new SortingView(), tripEventsElement);

const pointsModel = new PointsModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();

const routePointsPresenter = new RoutePointsPresenter({tripEventsContainer: tripEventsElement,
  pointsModel,
  offersModel,
  destinationsModel
});

routePointsPresenter.init();

