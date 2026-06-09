import { create } from 'zustand';
import { adminApi } from '../api/adminApi.js';

function getErrorMessage(error) {
  return error.response?.data?.message || error.message || 'Не удалось выполнить запрос админки';
}

export const useAdminOrderStore = create((set, get) => ({
  orders: [],
  isLoading: false,
  error: null,

  async fetchAdminOrders(params = {}) {
    set({ isLoading: true, error: null });

    try {
      const response = await adminApi.getOrders(params);
      set({ orders: response.orders || [], isLoading: false });
      return response.orders || [];
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw error;
    }
  },

  async updateOrderStatus(id, status) {
    set({ isLoading: true, error: null });

    try {
      await adminApi.updateOrderStatus(id, status);
      await get().fetchAdminOrders();
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw error;
    }
  },
}));
