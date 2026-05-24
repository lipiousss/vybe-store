import { create } from 'zustand';
import { categoryApi } from '../api/categoryApi.js';

export const useCategoryStore = create((set) => ({
  categories: [],
  isLoading: false,
  error: null,

  async fetchCategories() {
    set({ isLoading: true, error: null });

    try {
      const data = await categoryApi.getAll();
      set({ categories: data.categories || [], isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to load categories',
        isLoading: false,
      });
    }
  },
}));
