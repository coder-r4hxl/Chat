import { useEffect, useRef, useState } from 'react';
import { useChatStore } from '../../stores/useChatStore.js';

export default function MessageInput() {
  const selectedUser = useChatStore(s => s.selectedUser);
  const sendMessage = useChatStore(s => s.sendMessage);
  const socket = useChatStore(s => s.socket);

  const [text, setText] = useState('');

  function onTypingStart() {
    if (!socket || !selectedUser) return;
    socket.emit('typing-start', { toUserId: selectedUser._id ?? selectedUser.id });
  }

  function onTypingStop() {
    if (!socket || !selectedUser) return;
    socket.emit('typing-stop', { toUserId: selectedUser._id ?? selectedUser.id });
  }

  const stopTimer = useRef(null);

  function onChange(e) {
    setText(e.target.value);
    onTypingStart();
    if (stopTimer.current) clearTimeout(stopTimer.current);
    stopTimer.current = setTimeout(() => onTypingStop(), 800);
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!selectedUser) return;
    const trimmed = text.trim();
    if (!trimmed) return;
    await sendMessage(trimmed);
    setText('');
    onTypingStop();
  }

  return (
    <form onSubmit={onSubmit} className="p-4 bg-base-100 border-t">
      <div className="join w-full">
        <input
          className="input input-bordered join-item flex-1"
          value={text}
          onChange={onChange}
          placeholder="Type a message..."
        />
        <button className="btn btn-primary join-item" type="submit">Send</button>
      </div>
    </form>
  );
}

