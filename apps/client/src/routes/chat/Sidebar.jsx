import { useMemo } from 'react';
import { useChatStore } from '../../stores/useChatStore.js';

export default function Sidebar() {
  const users = useChatStore((s) => s.users);
  const selectedUser = useChatStore((s) => s.selectedUser);
  const onlineUsers = useChatStore((s) => s.onlineUsers);
  const selectUser = useChatStore((s) => s.selectUser);

  const onlineSet = useMemo(() => new Set(onlineUsers.map(String)), [onlineUsers]);

  return (
    <div className="menu p-4 w-80 min-h-full bg-base-100">
      <div className="font-bold mb-3">Chats</div>
      <ul className="space-y-1">
        {users.map((u) => {
          const uid = String(u._id ?? u.id);
          const online = onlineSet.has(uid);
          const isSelected =
            selectedUser && String(selectedUser._id ?? selectedUser.id) === uid;

          return (
            <li key={uid}>
              <button
                className={`btn btn-ghost w-full justify-start ${isSelected ? 'active' : ''}`}
                onClick={() => selectUser(u)}
              >
                <span className="relative mr-3">
                  <span
                    className="avatar placeholder"
                    aria-hidden="true"
                  >
                    <div className="bg-neutral text-neutral-content rounded-full w-10">
                      <span className="text-sm">{u.username?.[0] ?? u.name?.[0] ?? 'U'}</span>
                    </div>
                  </span>
                  <span
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${online ? 'bg-success' : 'bg-gray-400'}`}
                  />
                </span>

                <div className="text-left">
                  <div className="font-medium">{u.username ?? u.name ?? 'User'}</div>
                  <div className="text-xs opacity-70">{online ? 'Online' : 'Offline'}</div>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}



