import { create } from 'zustand';
import { authApi } from '../api/authApi.js';

const tokenKey = 'vybe_token';

function getErrorMessage(error) {
  return error.response?.data?.message || error.message || 'Authentication failed';
}

export const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem(tokenKey),
  isAuth: Boolean(localStorage.getItem(tokenKey)),
  isLoading: false,
  error: null,

  async login(credentials) {
    set({ isLoading: true, error: null });

    try {
      const data = await authApi.login(credentials);
      localStorage.setItem(tokenKey, data.token);
      set({
        user: data.user,
        token: data.token,
        isAuth: true,
        isLoading: false,
      });
      return data;
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw error;
    }
  },

  async register(credentials) {
    set({ isLoading: true, error: null });

    try {
      const data = await authApi.register(credentials);
      localStorage.setItem(tokenKey, data.token);
      set({
        user: data.user,
        token: data.token,
        isAuth: true,
        isLoading: false,
      });
      return data;
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw error;
    }
  },

  async checkAuth() {
    const token = get().token || localStorage.getItem(tokenKey);

    if (!token) {
      set({ user: null, token: null, isAuth: false });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const data = await authApi.me();
      set({
        user: data.user,
        token,
        isAuth: true,
        isLoading: false,
      });
    } catch (error) {
      localStorage.removeItem(tokenKey);
      set({
        user: null,
        token: null,
        isAuth: false,
        isLoading: false,
        error: getErrorMessage(error),
      });
    }
  },

  logout() {
    localStorage.removeItem(tokenKey);
    set({ user: null, token: null, isAuth: false, error: null });
  },
}));
