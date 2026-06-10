import { create } from 'zustand';
import { adminApi } from '../api/adminApi.js';

function getErrorMessage(error) {
  return error.response?.data?.message || error.message || 'Не удалось выполнить запрос склада';
}

export const useAdminStockStore = create((set) => ({
  stockItems: [],
  isLoading: false,
  isExporting: false,
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
      set({ isLoading: false, success: 'Остаток обновлён.' });
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw error;
    }
  },

  async exportStock() {
    set({ isExporting: true, error: null, success: null });
    try {
      const blob = await adminApi.exportStock();
      const excelBlob = blob instanceof Blob
        ? blob
        : new Blob([blob], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(excelBlob);
      const link = document.createElement('a');
      const date = new Date().toISOString().slice(0, 10);

      link.href = url;
      link.download = `vybe-stock-${date}.xlsx`;
      link.rel = 'noopener';
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();

      window.setTimeout(() => {
        link.remove();
        URL.revokeObjectURL(url);
      }, 500);

      set({ isExporting: false, success: 'Экспорт остатков скачан.' });
    } catch (error) {
      set({ error: getErrorMessage(error), isExporting: false });
      throw error;
    }
  },

  clearMessages() {
    set({ error: null, success: null });
  },
}));
