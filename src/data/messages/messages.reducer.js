import { ADD_MESSAGE } from './messages.types';

const initialState = [
  { content: 'testeeng \n multiple rows', senderName: 'Felix', timestamp: 1546989457516 },
  { content: 'testing', senderName: 'Felix', timestamp: 1546989357516 },
];

const reducerMessages = (state = initialState, action) => {
  switch (action.type) {
    case ADD_MESSAGE.SUCCESS:
      return [...state, action.payload];
    default:
      return state;
  }
};

export default reducerMessages;
