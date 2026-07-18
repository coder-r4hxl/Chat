import { create } from 'zustand';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isCheckingAuth: true,

  async signup({ username, email, password }) {
    set({ isSigningUp: true });
    try {
      const res = await api.post('/api/auth/signup', { username, email, password });
      // Expect: { token, user }
      const { token, user } = res.data;
      if (token) localStorage.setItem('token', token);
      set({ authUser: user ?? null, isSigningUp: false });
      return res.data;
    } catch (e) {
      set({ isSigningUp: false });
      throw e;
    }
  },

  async login({ email, password }) {
    set({ isLoggingIn: true });
    try {
      const res = await api.post('/api/auth/login', { email, password });
      const { token, user } = res.data;
      if (token) localStorage.setItem('token', token);
      set({ authUser: user ?? null, isLoggingIn: false });
      return res.data;
    } catch (e) {
      set({ isLoggingIn: false });
      throw e;
    }
  },

  logout() {
    localStorage.removeItem('token');
    set({ authUser: null });
  },

  async checkAuth() {
    set({ isCheckingAuth: true });
    const token = localStorage.getItem('token');
    if (!token) {
      set({ authUser: null, isCheckingAuth: false });
      return;
    }

    try {
      const res = await api.get('/api/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Expect: { user } or direct user
      const user = res.data?.user ?? res.data;
      set({ authUser: user, isCheckingAuth: false });
    } catch {
      localStorage.removeItem('token');
      set({ authUser: null, isCheckingAuth: false });
    }
  }
}));

