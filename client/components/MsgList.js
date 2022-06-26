import { useState } from 'react';
import MsgItem from './MsgItem';
import MsgInput from './MsgInput';
const UserIds = ['roy', 'jay'];
const getRandomUserId = () => UserIds[Math.round(Math.random())];
// const getRandomUserId = () => UserIds[1];

// const msgs = [{ id: 1, userId: getRandomUserId(), timestamp: 1234567890123, text: '1 mock text' }];
const originalMsgs = Array(50)
  .fill(0)
  .map((_, i) => ({
    id: i + 1,
    userId: UserIds[(i + 1) % 2], //getRandomUserId(),
    timestamp: 1234567890123 + i * 1000 * 60,
    text: `${i + 1} mock text`,
  }))
  .reverse();

const MsgList = () => {
  const [msgs, setMsgs] = useState(originalMsgs);
  const [editingId, setEditingId] = useState(null);
  const onCreate = (text) => {
    const newMsg = {
      id: msgs.length + 1,
      userId: getRandomUserId(),
      timestamp: Date.now(),
      text: `${msgs.length + 1} ${text}`,
    };
    setMsgs((msgs) => [newMsg, ...msgs]);
  };

  const onUpdate = (text, id) => {
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

  const onDelete = (id) => {
    setMsgs((msgs) => {
      const targetIndex = msgs.findIndex((msg) => msg.id === id);
      if (targetIndex < 0) return msgs;
      const newMsgs = [...msgs];
      newMsgs.splice(targetIndex, 1);
      return newMsgs;
    });
    donedit();
  };
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
          />
        ))}
      </ul>
    </>
  );
};

export default MsgList;
