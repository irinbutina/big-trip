const POINTS_TYPE = {
  trip: ['Taxi', 'Bus', 'Train', 'Ship', 'Transport', 'Drive', 'Flight'],
  stopping: ['Check-in', 'Sightseeing', 'Restaurant'],
};

const pointsType = POINTS_TYPE.trip.concat(POINTS_TYPE.stopping);

const DATE_FORMAT = {
  dateShort: 'MMM DD',
  dateFull: 'YYYY-MM-DD',
  time: 'HH:mm'
};

export { POINTS_TYPE, pointsType, DATE_FORMAT};

