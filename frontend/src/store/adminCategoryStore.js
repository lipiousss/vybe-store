import { create } from 'zustand';
import { adminApi } from '../api/adminApi.js';

function getErrorMessage(error) {
  return error.response?.data?.message || error.message || 'Не удалось выполнить запрос категории';
}

export const useAdminCategoryStore = create((set, get) => ({
  categories: [],
  isLoading: false,
  error: null,
  success: null,

  async fetchCategories() {
    set({ isLoading: true, error: null });
    try {
      const data = await adminApi.getCategories();
      set({ categories: data.categories || [], isLoading: false });
      return data.categories || [];
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw error;
    }
  },

  async saveCategory(payload, id = null) {
    set({ isLoading: true, error: null, success: null });
    try {
      if (id) {
        await adminApi.updateCategory(id, payload);
      } else {
        await adminApi.createCategory(payload);
      }
      await get().fetchCategories();
      set({ success: id ? 'Категория обновлена.' : 'Категория создана.' });
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw error;
    }
  },

  async deleteCategory(id) {
    set({ isLoading: true, error: null, success: null });
    try {
      await adminApi.deleteCategory(id);
      await get().fetchCategories();
      set({ success: 'Категория удалена.' });
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw error;
    }
  },

  clearMessages() {
    set({ error: null, success: null });
  },
}));
