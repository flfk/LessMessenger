import React, { Component } from 'react';

import { connect, Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

// Firebase

// import firebase from "firebase/app";
// import "firebase/firestore";

import { firebase, db } from './data/firebase';
import { createActionSet } from './utils/Helpers';
import {
  addMessage,
  sendMessage,
  updateMsgInState,
  updateLastMsgDoc,
  handleMsgSnapshot,
  getMsgSubscription,
} from './data/messages/messages.actions';

// const config = {
//   apiKey: "AIzaSyAMV0EahuLI3aGXCfxEnt_9Y0zSQS122L4",
//   authDomain: "firestore-test-44b8d.firebaseapp.com",
//   databaseURL: "https://firestore-test-44b8d.firebaseio.com",
//   projectId: "firestore-test-44b8d",
//   storageBucket: "firestore-test-44b8d.appspot.com",
//   messagingSenderId: "1070928017828"
// };

// firebase.initializeApp(config);

// const db = firebase.firestore();

// Redux Thunk

const ADD_MESSAGE = createActionSet('ADD_MESSAGE');
const UPDATE_MESSAGE = createActionSet('UPDATE_MESSAGE');
const SET_LAST_MSG_DOC = createActionSet('SET_LAST_MSG_DOC');
const MESSAGES_PER_LOAD = 30;
const ROOM_ID = '';

const initialState = {
  allIds: [],
  byId: {},
  lastMsgDoc: null,
};

const reducerMessages = (state = initialState, action) => {
  switch (action.type) {
    case ADD_MESSAGE.SUCCESS:
      if (state.byId && state.byId[action.payload.id]) return state;
      return {
        ...state,
        allIds: [...state.allIds, action.payload.id],
        byId: { ...state.byId, [action.payload.id]: action.payload },
      };
    case SET_LAST_MSG_DOC.SUCCESS:
      return { ...state, lastMsgDoc: action.payload };
    case UPDATE_MESSAGE.SUCCESS:
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.payload.id]: {
            ...state.byId[action.payload.id],
            ...action.payload,
          },
        },
      };

    default:
      return state;
  }
};

// const addMessage = msg => dispatch => {
//   dispatch({
//     type: ADD_MESSAGE,
//     payload: msg,
//   });
// };

// const sendMessage = msg => async dispatch => {
//   try {
//     await db.collection('messages').add({
//       ...msg,
//       timestamp: firebase.firestore.FieldValue.serverTimestamp(),
//     });
//     console.log('doc added');
//   } catch (error) {
//     console.log('Error Actions, messages, sendMessage', error);
//   }
// };

// const updateMsgInState = msg => dispatch => {
//   dispatch({
//     type: UPDATE_MESSAGE,
//     payload: msg,
//   });
// };

// const updateLastMsgDoc = doc => dispatch => {
//   dispatch({
//     type: SET_LAST_MSG_DOC,
//     payload: doc,
//   });
// };

const store = createStore(reducerMessages, applyMiddleware(thunkMiddleware));

// SUBSCRIPTIONS

// const handleMsgSnapshot = dispatch => async snapshot => {
//   const messagesAdded = [];
//   const messagesUpdated = [];
//   snapshot.docChanges().forEach(change => {
//     if (change.type === 'added') {
//       const { doc } = change;
//       const msg = doc.data();
//       const { id } = doc;
//       msg.id = id;
//       // convert firestore timestamp to unix
//       // console.log('snapshot event change add', msg);
//       msg.timestamp =
//         msg.timestamp && msg.timestamp.toMillis
//           ? msg.timestamp.toMillis()
//           : firebase.firestore.Timestamp.now().toMillis();
//       messagesAdded.push(msg);
//       // dispatch(addMessage(msg));
//       // update last Msg Doc to be used as reference for following load
//       dispatch(updateLastMsgDoc(doc));
//     }
//     if (change.type === 'modified') {
//       // will be modified when the timestamp updates
//       const { doc } = change;
//       const msg = doc.data();
//       const { id } = doc;
//       msg.id = id;
//       // console.log('snapshot event change modified', msg);
//       msg.timestamp =
//         msg.timestamp && msg.timestamp.toMillis
//           ? msg.timestamp.toMillis()
//           : firebase.firestore.Timestamp.now().toMillis();

//       // Don't update any changes in who has seen message so it isn't filtered out in selector
//       const msgUpdated = { ...msg };
//       if (msgUpdated.seenByUserId) delete msgUpdated.seenByUserId;
//       messagesUpdated.push(msgUpdated);
//     }
//   });
//   messagesAdded.map(msg => dispatch(addMessage(msg)));
//   messagesUpdated.map(msg => dispatch(updateMsgInState(msg)));
// };

// const getMsgSubscription = (roomId, lastMsgDoc) => async dispatch => {
//   let subscription = null;
//   try {
//     const msgRef = db
//       .collection('messages')
//       .where('roomId', '==', roomId)
//       .orderBy('timestamp', 'desc');
//     const msgRefLimited = lastMsgDoc
//       ? msgRef.startAfter(lastMsgDoc).limit(MESSAGES_PER_LOAD)
//       : msgRef.limit(MESSAGES_PER_LOAD);
//     subscription = msgRefLimited.onSnapshot(handleMsgSnapshot(dispatch));
//   } catch (error) {
//     console.log('messages.actions, getMsgSubscription', error);
//   }
//   return subscription;
// };

// Components

const mapStateToProps = state => ({
  messages: state.messages.allIds,
});

const mapDispatchToProps = dispatch => ({
  actionSendMessage: msg => dispatch(sendMessage(msg)),
  actionGetMsgSubscription: (roomId, lastMsgDoc) =>
    dispatch(getMsgSubscription(roomId, lastMsgDoc)),
});

class Test extends Component {
  state = {
    subscriptions: [],
  };

  componentDidMount() {
    const { messages } = this.props;
    if (messages.length < 50) {
      this.testSubscribeMessages();
    }
  }

  componentWillUnmount() {
    const { subscriptions } = this.state;
    subscriptions.map(sub => sub());
  }

  testGetNewMsg = () => ({
    content: 'hello world',
    hasAttachment: false,
    roomId: ROOM_ID,
    savesByUserId: [],
    seenByUserId: ['xyz'],
    senderUserId: 'xyz',
  });

  testHandleSend = () => {
    const { actionSendMessage } = this.props;
    const msg = this.testGetNewMsg();
    actionSendMessage(msg);
  };

  testSubscribeMessages = async (lastMsgDoc = null) => {
    const { subscriptions } = this.state;
    const { actionGetMsgSubscription } = this.props;
    const newSub = await actionGetMsgSubscription(ROOM_ID, lastMsgDoc);
    const subscriptionsUpdated = [...subscriptions, newSub];
    this.setState({ subscriptions: subscriptionsUpdated });
  };

  render() {
    console.log('messages', this.props.messages);
    return (
      <div>
        <button onClick={this.testHandleSend}>Click To Test</button>
      </div>
    );
  }
}

const TestConnected = connect(
  mapStateToProps,
  mapDispatchToProps
)(Test);

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <TestConnected />
      </Provider>
    );
  }
}

export default TestConnected;
