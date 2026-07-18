import { useEffect } from 'react';
import { useAuthStore } from '../../stores/useAuthStore.js';
import { useChatStore } from '../../stores/useChatStore.js';
import Sidebar from './Sidebar.jsx';
import ChatContainer from './ChatContainer.jsx';

export default function DashboardPage() {
  const authUser = useAuthStore(s => s.authUser);
  const init = useChatStore(s => s.init);

  useEffect(() => {
    if (authUser?._id) init();
  }, [authUser?._id, init]);

  return (
    <div className="min-h-screen bg-base-200">
      <div className="drawer lg:drawer-open">
        <input id="sidebar-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          <div className="navbar bg-base-100 border-b">
            <div className="flex-none lg:hidden">
              <label htmlFor="sidebar-drawer" className="btn btn-square btn-ghost">
                ☰
              </label>
            </div>
            <div className="flex-1" />
          </div>
          <ChatContainer />
        </div>
        <div className="drawer-side">
          <Sidebar />
        </div>
      </div>
    </div>
  );
}

