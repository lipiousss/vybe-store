import { create } from 'zustand';
import { adminApi } from '../api/adminApi.js';

function getErrorMessage(error) {
  return error.response?.data?.message || error.message || 'Admin product request failed';
}

export const useAdminProductStore = create((set) => ({
  products: [],
  currentProduct: null,
  isLoading: false,
  error: null,
  success: null,

  async fetchProducts(params = {}) {
    set({ isLoading: true, error: null });
    try {
      const data = await adminApi.getProducts(params);
      set({ products: data.products || [], isLoading: false });
      return data.products || [];
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw error;
    }
  },

  async fetchProductById(id) {
    set({ isLoading: true, error: null, currentProduct: null });
    try {
      const data = await adminApi.getProductById(id);
      set({ currentProduct: data.product || null, isLoading: false });
      return data.product;
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw error;
    }
  },

  async createProduct(payload) {
    set({ isLoading: true, error: null, success: null });
    try {
      const data = await adminApi.createProduct(payload);
      set({ currentProduct: data.product, isLoading: false, success: 'Product created.' });
      return data.product;
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw error;
    }
  },

  async updateProduct(id, payload) {
    set({ isLoading: true, error: null, success: null });
    try {
      const data = await adminApi.updateProduct(id, payload);
      set({ currentProduct: data.product, isLoading: false, success: 'Product updated.' });
      return data.product;
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw error;
    }
  },

  async deleteProduct(id) {
    set({ isLoading: true, error: null, success: null });
    try {
      await adminApi.deleteProduct(id);
      set((state) => ({
        products: state.products.filter((product) => product.id !== id),
        isLoading: false,
        success: 'Product deleted.',
      }));
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw error;
    }
  },

  async uploadImage(file) {
    set({ isLoading: true, error: null, success: null });
    try {
      const data = await adminApi.uploadProductImage(file);
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
