import { db } from '../firebase';

import { MESSAGES_PER_LOAD } from '../../utils/Constants';

const COLL_MESSAGES = 'messages';

export const addDocMessage = async msg => {
  const addedMsg = await db.collection(COLL_MESSAGES).add(msg);
  return addedMsg;
};

export const messagesRef = db
  .collection(COLL_MESSAGES)
  .orderBy('timestamp')
  .limit(MESSAGES_PER_LOAD);
