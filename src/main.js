import { render } from './framework/render.js';
import NewPointButtonView from './view/new-point-button-view.js';

import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import RoutePointsPresenter from './presenter/route-points-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import PointsApiService from './points-api-service.js';
const AUTHORIZATION = 'Basic uwegfeufg;yr76t2';
const END_POINT = 'https://19.ecmascript.pages.academy/big-trip-simple';

const siteHeaderElement = document.querySelector('.page-header');
const siteMainElement = document.querySelector('.page-main');

const tripMainElement = siteHeaderElement.querySelector('.trip-main');

const filtersContainerElement = siteHeaderElement.querySelector('.trip-controls__filters');
const tripEventsContainerElement = siteMainElement.querySelector('.trip-events');


const pointsModel = new PointsModel({
  pointsApiService: new PointsApiService(END_POINT, AUTHORIZATION)
});

const filterModel = new FilterModel();

const routePointsPresenter = new RoutePointsPresenter({
  tripEventsContainer: tripEventsContainerElement,
  pointsModel,
  filterModel,
  onNewPointDestroy: handleNewPointFormClose,
});

const filterPresenter = new FilterPresenter({
  filterContainer: filtersContainerElement,
  filterModel,
  pointsModel
});

const newPointButtonComponent = new NewPointButtonView({
  onClick: handleNewPointButtonClick
});

function handleNewPointFormClose() {
  newPointButtonComponent.element.disabled = false;
}

function handleNewPointButtonClick() {
  routePointsPresenter.createPoint();
  newPointButtonComponent.element.disabled = true;
}

render(newPointButtonComponent, tripMainElement);

filterPresenter.init();
routePointsPresenter.init();
pointsModel.init()
  .finally(() => {
    render(newPointButtonComponent, tripMainElement);
  });
