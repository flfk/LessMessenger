import moment from 'moment-timezone';
import qs from 'qs';

import { REGEX_TAG } from './Constants';

export const createActionSet = actionName => ({
  PENDING: `${actionName}_PENDING`,
  SUCCESS: `${actionName}_SUCCESS`,
  ERROR: `${actionName}_ERROR`,
  actionName,
});

export const getSelectorAll = (field, state) => {
  console.log('getSelectorAll', field);
  const { allIds, byId } = state[field];
  return allIds.map(id => byId[id]);
};

export const getDate = dateStart =>
  moment.tz(dateStart, 'America/Los_Angeles').format('dddd, MMM Do, YYYY');

export const getParams = props => {
  return qs.parse(props.location.search, { ignoreQueryPrefix: true });
};

export const getPathname = props => {
  const { pathname } = props.location;
  const pathnameFormatted = pathname.replace('/', '').toLowerCase();
  return pathnameFormatted;
};

export const getTags = text => {
  const tags = text.match(REGEX_TAG);
  if (tags) return tags.map(x => x.trim().toLowerCase());
  return [];
};

export const getTimestamp = () => moment().valueOf();

export const getTimestampFirestoreToUnix = timestamp => moment(timestamp).valueOf();

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
