import { create } from 'zustand';
import { collectionApi } from '../api/collectionApi.js';

export const useCollectionStore = create((set) => ({
  collections: [],
  isLoading: false,
  error: null,

  async fetchCollections() {
    set({ isLoading: true, error: null });

    try {
      const data = await collectionApi.getAll();
      set({ collections: data.collections || [], isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to load collections',
        isLoading: false,
      });
    }
  },
}));
