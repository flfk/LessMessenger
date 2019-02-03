const functions = require('firebase-functions');
const Firestore = require('@google-cloud/firestore');
const admin = require('firebase-admin');
const sgMail = require('@sendgrid/mail');

admin.initializeApp();

const firestore = admin.firestore();
// To ensure ensure firestore timestamp objects supported in future
const settings = { timestampsInSnapshots: true };
firestore.settings(settings);

const SENDGRID_API_KEY = functions.config().sendgrid.key;
sgMail.setApiKey(SENDGRID_API_KEY);

exports.onUserStatusChanged = functions.database
  .ref('/status/{roomId}/{userId}') // Reference to the Firebase RealTime database key
  .onUpdate((change, context) => {
    const roomRef = firestore.collection('rooms').doc(context.params.roomId);

    return change.after.ref.once('value').then(statusSnapshot => {
      const status = statusSnapshot.val();
      if (status === 'offline') {
        const timestamp = Math.floor(new Date());
        roomRef.update({
          [`members.${context.params.userId}.isOnline`]: false,
          [`members.${context.params.userId}.mostRecentSignOut`]: timestamp,
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
