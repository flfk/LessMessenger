const functions = require('firebase-functions');
const Firestore = require('@google-cloud/firestore');
const admin = require('firebase-admin');

admin.initializeApp();

const firestore = admin.firestore();

exports.onUserStatusChanged = functions.database
  .ref('/status/{uid}') // Reference to the Firebase RealTime database key
  .onUpdate((change, context) => {
    const userRef = firestore.collection('users').doc(context.params.uid);

    return change.after.ref.once('value').then(statusSnapshot => {
      const status = statusSnapshot.val();
      if (status === 'offline') {
        userRef.update({
          isOnline: false,
        });
      }
    });
  });
