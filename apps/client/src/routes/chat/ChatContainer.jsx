import { useEffect, useMemo, useRef } from 'react';
import { useChatStore } from '../../stores/useChatStore.js';
import MessageInput from './MessageInput.jsx';

export default function ChatContainer() {
  const selectedUser = useChatStore(s => s.selectedUser);
  const messages = useChatStore(s => s.messages);
  const subscribeToMessages = useChatStore(s => s.subscribeToMessages);
  const unsubscribeFromMessages = useChatStore(s => s.unsubscribeFromMessages);

  const endRef = useRef(null);

  useEffect(() => {
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const title = selectedUser ? (selectedUser.username ?? selectedUser.name ?? 'Chat') : 'Select a chat';

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 bg-base-100 border-b">
        <div className="font-bold">{title}</div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map(m => {
          const sent = String(m.senderId) === String(useChatStore.getState().meId);
          return (
            <div key={m.id ?? m._id} className={`chat ${sent ? 'chat-end' : 'chat-start'}`}>
              <div className="chat-bubble">
                {m.messageText}
                {m.mediaUrl ? (
                  <div className="mt-2">
                    <img className="max-w-xs rounded" src={m.mediaUrl} alt="media" />
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      <MessageInput />
    </div>
  );
}

