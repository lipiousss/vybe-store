import { create } from 'zustand';
import { adminApi } from '../api/adminApi.js';

function getErrorMessage(error) {
  return error.response?.data?.message || error.message || 'Admin artwork request failed';
}

export const useAdminArtworkStore = create((set, get) => ({
  artworks: [],
  currentArtwork: null,
  isLoading: false,
  error: null,
  success: null,

  async fetchAdminArtworks() {
    set({ isLoading: true, error: null });
    try {
      const data = await adminApi.getAdminArtworks();
      set({ artworks: data.artworks || [], isLoading: false });
      return data.artworks || [];
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw error;
    }
  },

  async createArtwork(payload) {
    set({ isLoading: true, error: null, success: null });
    try {
      const data = await adminApi.createArtwork(payload);
      set({ currentArtwork: data.artwork, isLoading: false, success: 'Artwork created.' });
      await get().fetchAdminArtworks();
      return data.artwork;
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw error;
    }
  },

  async updateArtwork(id, payload) {
    set({ isLoading: true, error: null, success: null });
    try {
      const data = await adminApi.updateArtwork(id, payload);
      set({ currentArtwork: data.artwork, isLoading: false, success: 'Artwork updated.' });
      await get().fetchAdminArtworks();
      return data.artwork;
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw error;
    }
  },

  async deleteArtwork(id) {
    set({ isLoading: true, error: null, success: null });
    try {
      await adminApi.deleteArtwork(id);
      set((state) => ({
        artworks: state.artworks.filter((artwork) => artwork.id !== id),
        isLoading: false,
        success: 'Artwork deleted.',
      }));
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw error;
    }
  },

  async uploadImage(file) {
    set({ isLoading: true, error: null, success: null });
    try {
      const data = await adminApi.uploadArtworkImage(file);
      set({ isLoading: false, success: 'Image uploaded.' });
      return data.url;
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw error;
    }
  },

  clearMessages() {
    set({ error: null, success: null });
  },
}));
