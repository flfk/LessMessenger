import moment from 'moment-timezone';
import qs from 'qs';

export const createActionSet = actionName => ({
  PENDING: `${actionName}_PENDING`,
  SUCCESS: `${actionName}_SUCCESS`,
  ERROR: `${actionName}_ERROR`,
  actionName,
});

export const formatUsername = username =>
  username
    .toLowerCase()
    .replace('@', '')
    .trim();

export const getDate = dateStart =>
  moment.tz(dateStart, 'America/Los_Angeles').format('dddd, MMM Do, YYYY');

export const getDateAddDays = (date, days) =>
  moment(date)
    .add(days, 'days')
    .valueOf();

export const getFormattedNumber = num => {
  if (num < 1) {
    return '-';
  }
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const getParams = props => {
  return qs.parse(props.location.search, { ignoreQueryPrefix: true });
};

export const getPathname = props => {
  const { pathname } = props.location;
  const pathnameFormatted = pathname.replace('/', '').toLowerCase();
  return pathnameFormatted;
};

export const getTimeRange = (dateStart, dateEnd) => {
  const timeStart = moment.tz(dateStart, 'America/Los_Angeles').format('H:mm');
  const timeEnd = moment.tz(dateEnd, 'America/Los_Angeles').format('H:mm');
  const timeRange = `${timeStart} - ${timeEnd} California Time`;
  return timeRange;
};

export const getTimestamp = () => moment().valueOf();

export const getShortenedNumber = num => {
  if (num === 0) {
    return '-';
  }

  if (num < 999) {
    return num;
  }

  if (num < 1000000) {
    const numInK = num / 1000;
    if (numInK < 10) {
      return numInK.toFixed(1) + 'k';
    }
    return numInK.toFixed(0) + 'k';
  }

  if (num < 1000000000) {
    const numInM = num / 1000000;
    if (numInM < 10) {
      return numInM.toFixed(1) + 'm';
    }
    return numInM.toFixed(1) + 'm';
  }

  return num;
};
