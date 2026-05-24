import { create } from 'zustand';
import { artworkApi } from '../api/artworkApi.js';

function getErrorMessage(error) {
  return error.response?.data?.message || error.message || 'Request failed';
}

export const useArtworkStore = create((set) => ({
  artworks: [],
  currentArtwork: null,
  selectedArtwork: null,
  isModalOpen: false,
  isLoading: false,
  error: null,
  activeCategory: 'All',

  async fetchArtworks(params = {}) {
    set({ isLoading: true, error: null });

    try {
      const data = await artworkApi.getAll(params);
      set({ artworks: data.artworks || [], isLoading: false });
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
    }
  },

  async fetchArtworkBySlug(slug) {
    set({ isLoading: true, error: null, currentArtwork: null });

    try {
      const data = await artworkApi.getBySlug(slug);
      set({ currentArtwork: data.artwork || null, isLoading: false });
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
    }
  },

  openArtworkModal(artwork) {
    set({ selectedArtwork: artwork, isModalOpen: true });
  },

  closeArtworkModal() {
    set({ selectedArtwork: null, isModalOpen: false });
  },

  setActiveCategory(category) {
    set({ activeCategory: category });
  },
}));
