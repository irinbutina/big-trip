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
  // PAST: 'past',
};

const LIST_EMPTY_MESSAGES = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  // [FilterType.PAST]: 'There are no past events now',
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
};


export { POINTS_TYPE, pointsType, DATE_FORMAT, LIST_EMPTY_MESSAGES, FilterType, SortType, SortsTitle, UserAction, UpdateType};

