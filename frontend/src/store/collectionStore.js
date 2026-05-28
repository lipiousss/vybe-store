import { create } from 'zustand';
import { collectionApi } from '../api/collectionApi.js';

export const useCollectionStore = create((set) => ({
  collections: [],
  currentCollection: null,
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

  async fetchCollectionBySlug(slug) {
    set({ isLoading: true, error: null, currentCollection: null });

    try {
      const data = await collectionApi.getBySlug(slug);
      set({ currentCollection: data.collection || null, isLoading: false });
      return data.collection;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to load collection',
        isLoading: false,
      });
      throw error;
    }
  },
}));
