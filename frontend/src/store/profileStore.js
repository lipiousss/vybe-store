import { create } from 'zustand';
import { userApi } from '../api/userApi.js';
import { useAuthStore } from './authStore.js';

function getErrorMessage(error) {
  return error.response?.data?.message || error.message || 'Не удалось выполнить запрос профиля';
}

function syncAuthUser(user) {
  if (!user) {
    return;
  }

  useAuthStore.setState((state) => ({
    user: {
      ...(state.user || {}),
      ...user,
    },
  }));
}

export const useProfileStore = create((set) => ({
  profile: null,
  isLoading: false,
  error: null,
  success: null,

  async fetchProfile() {
    set({ isLoading: true, error: null });

    try {
      const data = await userApi.getProfile();
      syncAuthUser(data.user);
      set({ profile: data, isLoading: false });
      return data;
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw error;
    }
  },

  async updateProfile(payload) {
    set({ isLoading: true, error: null, success: null });

    try {
      const data = await userApi.updateProfile(payload);
      syncAuthUser(data.user);
      set({ profile: data, isLoading: false, success: 'Профиль обновлён.' });
      return data;
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw error;
    }
  },

  async changePassword(payload) {
    set({ isLoading: true, error: null, success: null });

    try {
      const data = await userApi.changePassword(payload);
      set({ isLoading: false, success: data.message || 'Пароль изменён.' });
      return data;
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw error;
    }
  },

  async changeEmail(payload) {
    set({ isLoading: true, error: null, success: null });

    try {
      const data = await userApi.changeEmail(payload);
      syncAuthUser(data.user);
      set((state) => ({
        profile: state.profile ? { ...state.profile, user: data.user } : state.profile,
        isLoading: false,
        success: 'Почта изменена.',
      }));
      return data;
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw error;
    }
  },

  async updatePhone(payload) {
    set({ isLoading: true, error: null, success: null });

    try {
      const data = await userApi.updatePhone(payload);
      syncAuthUser(data.user);
      set((state) => ({
        profile: state.profile ? { ...state.profile, user: data.user } : state.profile,
        isLoading: false,
        success: 'Телефон обновлён.',
      }));
      return data;
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw error;
    }
  },

  async uploadAvatar(file) {
    set({ isLoading: true, error: null, success: null });

    try {
      const data = await userApi.uploadAvatar(file);
      syncAuthUser(data.user);
      set((state) => ({
        profile: state.profile ? { ...state.profile, user: data.user } : state.profile,
        isLoading: false,
        success: 'Аватар загружен.',
      }));
      return data;
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw error;
    }
  },

  clearMessages() {
    set({ error: null, success: null });
  },
}));
