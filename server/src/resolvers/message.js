import { writeDB } from '../dbController.js';
import { v4 } from 'uuid';
const setMsgs = (data) => writeDB('messages', data);
/**
 * obj: parent 객체, 거의 사용x
 * args: Query에 필요한 필드에 제공되는 인수(parameter)
 * context: 로그인한 사용자, DB Access 등의 중요한 정보들
 */
const messageResolver = {
  Query: {
    messages: (parent, args, { db }) => {
      return db.messages;
    },
    message: (parent, { id = '' }, { db }) => {
      return db.messages.find((msg) => msg.id === id);
    },
  },
  Mutation: {
    createMessage: (parent, { text, userId }, { db }) => {
      const newMsg = {
        id: v4(),
        text,
        userId,
        timestamp: Date.now(),
      };
      db.messages.unshift(newMsg);
      setMsgs(db.messages);
      return newMsg;
    },
    updateMessage: (parent, { id, text, userId }, { db }) => {
      const targetIndex = db.messages.findIndex((msg) => msg.id === id);
      if (targetIndex < 0) throw Error('메시지가 없습니다');
      if (db.messages[targetIndex].userId !== userId) throw '사용자가 다릅니다.';
      const newMsg = { ...db.messages[targetIndex], text: text };
      db.messages.splice(targetIndex, 1, newMsg);
      setMsgs(db.messages);
      return newMsg;
    },
    deleteMessage: (parent, { id, userId }, { db }) => {
      const targetIndex = db.messages.findIndex((msg) => msg.id === id);
      if (targetIndex < 0) throw Error('메시지가 없습니다');
      if (db.messages[targetIndex].userId !== userId) throw '사용자가 다릅니다.';

      db.messages.splice(targetIndex, 1);
      setMsgs(db.messages);
      return id;
    },
  },
};

export default messageResolver;
// const getMsgs = () => readDB('messages');

// const messagesRoute = [
//   {
//     method: 'get',
//     route: '/messages',
//     handler: ({ query: { cursor = '' } }, res) => {
//       const msgs = getMsgs();
//       const fromIndex = msgs.findIndex((msg) => msg.id === cursor) + 1;
//       res.send(msgs.slice(fromIndex, fromIndex + 15));
//     },
//   },
//   {
//     method: 'get',
//     route: '/messages/:id',
//     handler: ({ params: { id } }, res) => {
//       try {
//         const msgs = getMsgs();
//         const msg = msgs.find((m) => m.id === id);
//         if (!msg) throw Error('not found');
//         res.send(msg);
//       } catch (err) {
//         res.status(404).send({ error: err });
//       }
//     },
//   },
//   {
//     method: 'post',
//     route: '/messages',
//     handler: ({ body }, res) => {
//       try {
//         if (!body.userId) throw Error('no userId');
//         const msgs = getMsgs();
//         const newMsg = {
//           id: v4(),
//           text: body.text,
//           userId: body.userId,
//           timestamp: Date.now(),
//         };
//         msgs.unshift(newMsg);
//         setMsgs(msgs);
//         res.send(newMsg);
//       } catch (err) {
//         res.status(500).send({ error: err });
//       }
//     },
//   },
//   {
//     method: 'put',
//     route: '/messages/:id',
//     handler: ({ body, params: { id } }, res) => {
//       try {
//         const msgs = getMsgs();
//         const targetIndex = msgs.findIndex((msg) => msg.id === id);
//         if (targetIndex < 0) throw '메시지가 없습니다';
//         if (msgs[targetIndex].userId !== body.userId) throw '사용자가 다릅니다.';
//         const newMsg = { ...msgs[targetIndex], text: body.text };
//         msgs.splice(targetIndex, 1, newMsg);
//         setMsgs(msgs);
//         res.send(newMsg);
//       } catch (err) {}
//       res.status(500).send({ error: err });
//     },
//   },
//   {
//     method: 'delete',
//     route: '/messages/:id',
//     handler: ({ body, params: { id } }, res) => {
//       try {
//         const msgs = getMsgs();
//         const targetIndex = msgs.findIndex((msg) => msg.id === id);
//         if (targetIndex < 0) throw '메시지가 없습니다';
//         if (msgs[targetIndex].userId !== body.userId) throw '사용자가 다릅니다.';

//         msgs.splice(targetIndex, 1);
//         setMsgs(msgs);
//         res.send(id);
//       } catch (err) {}
//       res.status(500).send({ error: err });
//     },
//   },
// ];

// export default messagesRoute;
