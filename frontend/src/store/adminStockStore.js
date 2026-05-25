import { create } from 'zustand';
import { adminApi } from '../api/adminApi.js';

function getErrorMessage(error) {
  return error.response?.data?.message || error.message || 'Admin stock request failed';
}

export const useAdminStockStore = create((set) => ({
  stockItems: [],
  isLoading: false,
  error: null,
  success: null,

  async fetchStock() {
    set({ isLoading: true, error: null });
    try {
      const data = await adminApi.getStock();
      set({ stockItems: data.stockItems || [], isLoading: false });
      return data.stockItems || [];
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw error;
    }
  },

  async updateStock(variantId, stock, comment) {
    set({ isLoading: true, error: null, success: null });
    try {
      await adminApi.updateVariantStock(variantId, { stock, comment });
      set({ isLoading: false, success: 'Stock updated.' });
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw error;
    }
  },

  async exportStock() {
    set({ isLoading: true, error: null, success: null });
    try {
      const blob = await adminApi.exportStock();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'vybe-stock.xlsx';
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      set({ isLoading: false, success: 'Stock export downloaded.' });
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw error;
    }
  },

  clearMessages() {
    set({ error: null, success: null });
  },
}));
