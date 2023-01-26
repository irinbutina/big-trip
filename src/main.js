import PointsModel from './model/points-model.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destination-model.js';
import FilterModel from './model/filter-model.js';
import RoutePointsPresenter from './presenter/route-points-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';

const siteHeaderElement = document.querySelector('.page-header');
const siteMainElement = document.querySelector('.page-main');

const filtersContainerElement = siteHeaderElement.querySelector('.trip-controls__filters');
const tripEventsContainerElement = siteMainElement.querySelector('.trip-events');


const pointsModel = new PointsModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();
const filterModel = new FilterModel();

const routePointsPresenter = new RoutePointsPresenter({
  tripEventsContainer: tripEventsContainerElement,
  pointsModel,
  offersModel,
  destinationsModel,
  filterModel,
});

const filterPresenter = new FilterPresenter({
  filterContainer: filtersContainerElement,
  filterModel,
  pointsModel
});

filterPresenter.init();
routePointsPresenter.init();

