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

exports.emailRequests = functions.firestore.document('emails/{email}').onCreate(snap => {
  const emailRequest = snap.data();
  let msg = {};
  let type = 'NO_TYPE';

  if (emailRequest.type === 'signUp') {
    type = 'signUp';
    msg = {
      to: emailRequest.email,
      from: 'The.Lessmessenger@gmail.com',
      templateId: 'd-9151449bb4e4476eb06436f9574a0a01',
      dynamic_template_data: {
        nameFirst: emailRequest.nameFirst,
        influencerName: emailRequest.influencerName,
        eventURL: emailRequest.eventURL,
      },
    };
  }

  if (emailRequest.type === 'invite') {
    type = 'invite';
    msg = {
      to: emailRequest.email,
      from: 'The.Lessmessenger@gmail.com',
      templateId: 'd-c94784d256ee4157bb28b62a937c2ec5',
      dynamic_template_data: {
        inviteeName: emailRequest.inviteeName,
        refereeName: emailRequest.refereeName,
        influencerName: emailRequest.influencerName,
        eventURL: emailRequest.eventURL,
        daysLeft: emailRequest.daysLeft,
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
