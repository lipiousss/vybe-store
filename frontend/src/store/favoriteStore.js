import { create } from 'zustand';
import { favoriteApi } from '../api/favoriteApi.js';

function getErrorMessage(error) {
  return error.response?.data?.message || error.message || 'Не удалось выполнить запрос избранного';
}

function favoriteIdsFrom(favorites) {
  return favorites.map((favorite) => favorite.productId || favorite.product?.id).filter(Boolean);
}

export const useFavoriteStore = create((set, get) => ({
  favorites: [],
  favoriteIds: [],
  isLoading: false,
  error: null,

  async fetchFavorites() {
    set({ isLoading: true, error: null });

    try {
      const data = await favoriteApi.getAll();
      const favorites = data.favorites || [];
      set({ favorites, favoriteIds: favoriteIdsFrom(favorites), isLoading: false });
      return favorites;
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw error;
    }
  },

  async toggleFavorite(productId) {
    set({ isLoading: true, error: null });

    try {
      if (get().favoriteIds.includes(productId)) {
        await favoriteApi.remove(productId);
      } else {
        await favoriteApi.toggle(productId);
      }

      return await get().fetchFavorites();
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw error;
    }
  },

  async removeFavorite(productId) {
    set({ isLoading: true, error: null });

    try {
      await favoriteApi.remove(productId);
      return await get().fetchFavorites();
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw error;
    }
  },

  isFavorite(productId) {
    return get().favoriteIds.includes(productId);
  },
}));
