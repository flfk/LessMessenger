import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';
import 'firebase/storage';

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: 'lessmessenger-19425.firebaseapp.com',
  databaseURL: 'https://lessmessenger-19425.firebaseio.com',
  projectId: 'lessmessenger-19425',
  storageBucket: '',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_Id,
};

firebase.initializeApp(config);

const auth = firebase.auth();

const db = firebase.firestore();

const { firestore } = firebase;

const dbTimestamp = firebase.firestore.Timestamp;

const oldRealTimeDb = firebase.database();

const storage = firebase.storage();

// To ensure ensure firestore timestamp objects supported in future
// const settings = { timestampsInSnapshots: true };
// db.settings(settings);

export { auth, db, dbTimestamp, firestore, firebase, oldRealTimeDb, storage };
