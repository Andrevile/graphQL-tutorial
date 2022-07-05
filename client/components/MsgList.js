import { useEffect, useState } from 'react';
import { userRouter } from 'next';
import MsgItem from './MsgItem';
import MsgInput from './MsgInput';
import fetcher from '../fetcher';
import { useRouter } from 'next/router';
const UserIds = ['roy', 'jay'];
const getRandomUserId = () => UserIds[Math.round(Math.random())];

// const getRandomUserId = () => UserIds[1];

// const msgs = [{ id: 1, userId: getRandomUserId(), timestamp: 1234567890123, text: '1 mock text' }];
// const originalMsgs = Array(50)
//   .fill(0)
//   .map((_, i) => ({
//     id: i + 1,
//     userId: UserIds[(i + 1) % 2], //getRandomUserId(),
//     timestamp: 1234567890123 + i * 1000 * 60,
//     text: `${i + 1} mock text`,
//   }))
//   .reverse();

const MsgList = () => {
  const {
    query: { userId = '' },
  } = useRouter();
  const [msgs, setMsgs] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const onCreate = async (text) => {
    const newMsg = await fetcher('post', '/messages', { text, userId });
    if (!newMsg) throw Error('something wrong');
    setMsgs((msgs) => [newMsg, ...msgs]);
  };

  const onUpdate = async (text, id) => {
    const newMsg = await fetcher('put', `/messages/${id}`, { text, userId });
    if (!newMsg) throw Error('something wrong');
    setMsgs((msgs) => {
      const targetIndex = msgs.findIndex((msg) => msg.id === id);
      if (targetIndex < 0) return msgs;
      const newMsgs = [...msgs];
      newMsgs.splice(targetIndex, 1, { ...msgs[targetIndex], text });
      return newMsgs;
    });
    donedit();
  };

  const startEdit = (id) => setEditingId(id);

  const donedit = () => setEditingId(null);

  const onDelete = async (id) => {
    const receivedId = await fetcher('delete', `/messages/${id}`, { params: { userId } });
    setMsgs((msgs) => {
      const targetIndex = msgs.findIndex((msg) => msg.id === receivedId + '');
      if (targetIndex < 0) return msgs;
      const newMsgs = [...msgs];
      newMsgs.splice(targetIndex, 1);
      return newMsgs;
    });
    donedit();
  };

  const getMessages = async () => {
    const msgs = await fetcher('get', '/messages');
    setMsgs(msgs);
  };

  useEffect(() => {
    getMessages();
  }, []);
  return (
    <>
      <MsgInput mutate={onCreate} />
      <ul className='messages'>
        {msgs.map((x) => (
          <MsgItem
            key={x.id}
            {...x}
            onUpdate={onUpdate}
            startEdit={() => startEdit(x.id)}
            isEditing={editingId === x.id}
            onDelete={() => onDelete(x.id)}
            myId={userId}
          />
        ))}
      </ul>
    </>
  );
};

export default MsgList;
