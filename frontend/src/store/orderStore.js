import { create } from 'zustand';
import { orderApi } from '../api/orderApi.js';
import { useCartStore } from './cartStore.js';

function getErrorMessage(error) {
  return error.response?.data?.message || error.message || 'Order request failed';
}

export const useOrderStore = create((set) => ({
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,
  success: null,

  async createOrder(data) {
    set({ isLoading: true, error: null, success: null });

    try {
      const response = await orderApi.create(data);
      await useCartStore.getState().fetchCart();
      set({ currentOrder: response.order, isLoading: false, success: 'Order created.' });
      return response.order;
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw error;
    }
  },

  async fetchMyOrders() {
    set({ isLoading: true, error: null });

    try {
      const response = await orderApi.getMyOrders();
      set({ orders: response.orders || [], isLoading: false });
      return response.orders || [];
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw error;
    }
  },

  async fetchOrderById(id) {
    set({ isLoading: true, error: null, currentOrder: null });

    try {
      const response = await orderApi.getById(id);
      set({ currentOrder: response.order || null, isLoading: false });
      return response.order;
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw error;
    }
  },

  clearMessages() {
    set({ error: null, success: null });
  },
}));
