import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

import reducerRoot from './RootReducer';

const store = createStore(reducerRoot, applyMiddleware(thunkMiddleware));

export default store;
