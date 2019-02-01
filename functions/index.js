const functions = require('firebase-functions');
const Firestore = require('@google-cloud/firestore');
const admin = require('firebase-admin');
const sgMail = require('@sendgrid/mail');

admin.initializeApp();

const firestore = admin.firestore();

const SENDGRID_API_KEY = functions.config().sendgrid.key;
sgMail.setApiKey(SENDGRID_API_KEY);

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

exports.emailRequests = functions.firestore.document('emailRequests/{email}').onCreate(snap => {
  const emailRequest = snap.data();
  let msg = {};
  let type = 'NO_TYPE';

  if (emailRequest.type === 'signUp') {
    type = 'signUp';
    msg = {
      to: emailRequest.email,
      from: 'TheLessMessenger@gmail.com',
      templateId: 'd-af3c425d79864ad581c317d523b74de1',
      dynamic_template_data: {
        roomName: emailRequest.roomName,
        roomURL: emailRequest.roomURL,
      },
    };
  }

  if (emailRequest.type === 'invite') {
    type = 'invite';
    msg = {
      to: emailRequest.email,
      from: 'TheLessMessenger@gmail.com',
      templateId: 'd-35152d996b7a43d1889fff72a9ddf14d',
      dynamic_template_data: {
        inviterName: emailRequest.inviterName,
        roomName: emailRequest.roomName,
        roomURL: emailRequest.roomURL,
      },
    };
  }

  return sgMail
    .send(msg)
    .then(() => console.log(type, ' email sent'))
    .catch(error => {
      console.error(error.toString());
    });
});
