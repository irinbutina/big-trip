import {render} from '../framework/render.js';
import FormEditView from '../view/form-edit-view.js';
import RoutePointView from '../view/route-point-view.js';


export default class PointPresenter {
  #tripEventsContainer = null;

  constructor ({tripEventsContainer}) {
    this.#tripEventsContainer = tripEventsContainer;
  }
}

