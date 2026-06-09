import { create } from 'zustand';
import { adminApi } from '../api/adminApi.js';

function getErrorMessage(error) {
  return error.response?.data?.message || error.message || 'Не удалось выполнить запрос изображения сайта';
}

export const useSiteAssetStore = create((set, get) => ({
  assets: [],
  isLoading: false,
  error: null,
  success: null,

  async fetchAssets() {
    set({ isLoading: true, error: null });
    try {
      const data = await adminApi.getSiteAssets();
      set({ assets: data.assets || [], isLoading: false });
      return data.assets || [];
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw error;
    }
  },

  async updateAsset(key, payload) {
    set({ isLoading: true, error: null, success: null });
    try {
      const data = await adminApi.updateSiteAsset(key, payload);
      set((state) => ({
        assets: [
          data.asset,
          ...state.assets.filter((asset) => asset.key !== key),
        ].sort((a, b) => a.key.localeCompare(b.key)),
        isLoading: false,
        success: 'Изображение сайта сохранено.',
      }));
      return data.asset;
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw error;
    }
  },

  async uploadImage(file) {
    set({ isLoading: true, error: null, success: null });
    try {
      const data = await adminApi.uploadSiteAssetImage(file);
      set({ isLoading: false, success: 'Изображение загружено.' });
      return data.url;
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw error;
    }
  },

  getAsset(key) {
    return get().assets.find((asset) => asset.key === key);
  },

  clearMessages() {
    set({ error: null, success: null });
  },
}));
