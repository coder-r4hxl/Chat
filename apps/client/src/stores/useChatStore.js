import { create } from 'zustand';
import { io } from 'socket.io-client';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

function getToken() {
  return localStorage.getItem('token');
}

export const useChatStore = create((set, get) => ({

  meId: null,
  authToken: null,

  users: [],
  messages: [],
  selectedUser: null,

  onlineUsers: [],

  socket: null,
  _socketHandlers: null,

  async init() {
    const token = getToken();
    const state = get();
    if (!token) return;

    // meId from authUser is stored indirectly via App/route; set when selecting.
    set({ authToken: token });

    // One-time socket init
    if (!get().socket) {
      const socket = io(import.meta.env.VITE_API_URL, {
        auth: { token }
      });

      set({ socket });
    }

    await Promise.all([get().getUsers(), get().getMessages()]);
  },

  selectUser(u) {
    set({ selectedUser: u });
    const meId = get().meId;
    set({ meId: meId ?? u?.meId ?? null });
    get().getMessages(u);
  },

  async getUsers() {
    const token = get().authToken ?? getToken();
    const res = await api.get('/api/users/contacts', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const users = res.data?.users ?? res.data?.contacts ?? res.data;
    set({ users: users ?? [] });

    // Derive meId if backend includes it; otherwise set when selecting.
    if (res.data?.meId) set({ meId: res.data.meId });
  },

  async getMessages(u = get().selectedUser) {
    if (!u) return;
    const token = get().authToken ?? getToken();
    const otherId = u._id ?? u.id;

    const res = await api.get(`/api/messages/${''}?with=${otherId}`.replace('/undefined', ''), {
      headers: { Authorization: `Bearer ${token}` }
    });

    const messages = res.data?.messages ?? [];
    set({ messages });
  },

  subscribeToMessages() {
    const socket = get().socket;
    if (!socket) return;
    if (get()._socketHandlers) return;

    const handlers = {
      newMessage: ({ messageData }) => {
        set({ messages: [...get().messages, messageData] });
      },
      getOnlineUsers: (users) => {
        set({ onlineUsers: users ?? [] });
      }
    };

    socket.on('newMessage', handlers.newMessage);
    socket.on('getOnlineUsers', handlers.getOnlineUsers);

    set({ _socketHandlers: handlers });
  },

  unsubscribeFromMessages() {
    const socket = get().socket;
    const handlers = get()._socketHandlers;
    if (!socket || !handlers) return;

    socket.off('newMessage', handlers.newMessage);
    socket.off('getOnlineUsers', handlers.getOnlineUsers);
    set({ _socketHandlers: null });
  },

  async sendMessage(messageText) {
    const selectedUser = get().selectedUser;
    if (!selectedUser) return;

    const token = get().authToken ?? getToken();
    const otherId = selectedUser._id ?? selectedUser.id;

    const res = await api.post(
      `/api/messages/${''}/send?with=${otherId}`.replace('/undefined', ''),
      { messageText },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const message = res.data?.message ?? res.data;
    set({ messages: [...get().messages, message] });
  }
}));

