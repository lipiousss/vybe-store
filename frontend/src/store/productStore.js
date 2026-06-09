import { create } from 'zustand';
import { productApi } from '../api/productApi.js';

function getErrorMessage(error) {
  return error.response?.data?.message || error.message || 'Не удалось выполнить запрос товаров';
}

export const useProductStore = create((set) => ({
  products: [],
  collectibleProducts: [],
  featuredProducts: [],
  currentProduct: null,
  isLoading: false,
  error: null,

  async fetchProducts(params = {}) {
    set({ isLoading: true, error: null });

    try {
      const data = await productApi.getAll(params);
      set({ products: data.products || [], isLoading: false });
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
    }
  },

  async fetchFeaturedProducts() {
    set({ isLoading: true, error: null });

    try {
      const data = await productApi.getAll({ isFeatured: true, status: 'ACTIVE' });
      set({ featuredProducts: data.products || [], isLoading: false });
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
    }
  },

  async fetchCollectibles() {
    set({ isLoading: true, error: null });

    try {
      const data = await productApi.getAll({ isCollectible: true, status: 'ACTIVE' });
      set({ collectibleProducts: data.products || [], isLoading: false });
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
    }
  },

  async fetchProductBySlug(slug) {
    set({ isLoading: true, error: null, currentProduct: null });

    try {
      const data = await productApi.getBySlug(slug);
      set({ currentProduct: data.product || null, isLoading: false });
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
    }
  },
}));
