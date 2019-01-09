// import _ from 'lodash';

import { ADD_MESSAGE } from './messages.types';

const initialState = [
  // { id: 'abc', content: 'testeeng \n multiple rows', senderName: 'Felix', timestamp: 1546989457516 },
  // { id: 'xyz', content: 'testing', senderName: 'Felix', timestamp: 1546989357516 },
];

const reducerMessages = (state = initialState, action) => {
  switch (action.type) {
    case ADD_MESSAGE.SUCCESS:
      // return _.uniqBy([...state, action.payload], 'id');
      return [...state, action.payload];
    default:
      return state;
  }
};

export default reducerMessages;
