import { getTodayDate } from './utils/utils';

const POINTS_TYPE = {
  trip: ['Taxi', 'Bus', 'Train', 'Ship', 'Drive', 'Flight'],
  stopping: ['Check-in', 'Sightseeing', 'Restaurant'],
};

const pointsType = POINTS_TYPE.trip.concat(POINTS_TYPE.stopping);

const DATE_FORMAT = {
  dateShort: 'MMM DD',
  dateFull: 'YYYY-MM-DD',
  dateValue: 'DD/MM/YY',
  time: 'HH:mm'
};

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
};

const LIST_EMPTY_MESSAGES = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
};

const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offers',
};

const SortsTitle = [
  {
    title: 'day',
    type: SortType.DAY,
  },
  {
    title: 'event',
    isDisabled: true,
    type: SortType.EVENT,
  },
  {
    title: 'time',
    isDisabled: true,
    type: SortType.TIME,
  },
  {
    title: 'price',
    type: SortType.PRICE,
  },
  {
    title: 'offers',
    isDisabled: true,
    type: SortType.OFFERS,
  },
];

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
  ERROR: 'ERROR',
};

const FormType = {
  EDITING: 'edit',
  ADDING: 'add'
};


const DEFAULT_POINT_TYPE = pointsType[0].toLocaleLowerCase();

const BLANK_POINT = {
  type: DEFAULT_POINT_TYPE,
  dateFrom: getTodayDate(),
  dateTo: getTodayDate(),
  destinationId: null,
  offersId: [],
  basePrice: '',
};


const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export { POINTS_TYPE, pointsType, DATE_FORMAT, LIST_EMPTY_MESSAGES, FilterType, SortType, SortsTitle, UserAction, UpdateType, FormType, BLANK_POINT, Mode, TimeLimit};

