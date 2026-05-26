import { create } from 'zustand';
import { adminApi } from '../api/adminApi.js';

function getErrorMessage(error) {
  return error.response?.data?.message || error.message || 'Collection request failed';
}

export const useAdminCollectionStore = create((set, get) => ({
  collections: [],
  isLoading: false,
  error: null,
  success: null,

  async fetchCollections() {
    set({ isLoading: true, error: null });
    try {
      const data = await adminApi.getCollections();
      set({ collections: data.collections || [], isLoading: false });
      return data.collections || [];
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw error;
    }
  },

  async saveCollection(payload, id = null) {
    set({ isLoading: true, error: null, success: null });
    try {
      if (id) {
        await adminApi.updateCollection(id, payload);
      } else {
        await adminApi.createCollection(payload);
      }
      await get().fetchCollections();
      set({ success: id ? 'Collection updated.' : 'Collection created.' });
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw error;
    }
  },

  async deleteCollection(id) {
    set({ isLoading: true, error: null, success: null });
    try {
      await adminApi.deleteCollection(id);
      await get().fetchCollections();
      set({ success: 'Collection deleted.' });
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw error;
    }
  },

  clearMessages() {
    set({ error: null, success: null });
  },
}));
