export const FACEBOOK_OPTIONS = { permissions: ['public_profile', 'email'], behaviour: 'native' };

export const REGEX_TAG = /(?:^|\s)(#[a-z0-9]\w*)/gi;

export const REGEX_TIMER = /\+timer\(\d+:\d+:\d+\)/gi;

export const MESSAGES_PER_LOAD = 50;

export const MIN_TIME_DIFF_UNTIL_HEADER_MILLIS = 60000 * 10;
