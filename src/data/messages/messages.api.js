import { db } from '../firebase';

const COLL_MESSAGES = 'messages';

export const addDocMessage = async msg => {
  const addedMsg = await db.collection(COLL_MESSAGES).add(msg);
  return addedMsg;
};

export const fetchDocsMessages = async roomID => {
  const messages = [];
  try {
    const commentersRef = db.collection(COLL_MESSAGES);
    const snapshot = await commentersRef.get();
    snapshot.forEach(doc => {
      const msg = doc.data();
      const { id } = doc;
      msg.id = id;
      messages.push(msg);
    });
  } catch (error) {
    console.error('Error actions, fetchDocsMessages', error);
  }
  return messages;
};
