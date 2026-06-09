import { create } from 'zustand';
import { adminApi } from '../api/adminApi.js';

function getErrorMessage(error) {
  return error.response?.data?.message || error.message || 'Не удалось выполнить запрос пользователя';
}

export const useAdminUserStore = create((set, get) => ({
  users: [],
  currentUser: null,
  isLoading: false,
  error: null,
  success: null,

  async fetchUsers(params = {}) {
    set({ isLoading: true, error: null });
    try {
      const data = await adminApi.getUsers(params);
      set({ users: data.users || [], isLoading: false });
      return data.users || [];
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw error;
    }
  },

  async fetchUserById(id) {
    set({ isLoading: true, error: null });
    try {
      const data = await adminApi.getUserById(id);
      set({ currentUser: data.user || null, isLoading: false });
      return data.user;
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw error;
    }
  },

  async updateRole(id, role) {
    set({ isLoading: true, error: null, success: null });
    try {
      await adminApi.updateUserRole(id, role);
      await get().fetchUsers();
      set({ success: 'Роль пользователя обновлена.' });
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw error;
    }
  },

  async updateBlock(id, isBlocked) {
    set({ isLoading: true, error: null, success: null });
    try {
      await adminApi.updateUserBlock(id, isBlocked);
      await get().fetchUsers();
      set({ success: isBlocked ? 'Пользователь заблокирован.' : 'Пользователь разблокирован.' });
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw error;
    }
  },

  clearMessages() {
    set({ error: null, success: null });
  },
}));
