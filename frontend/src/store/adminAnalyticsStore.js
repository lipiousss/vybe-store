import { create } from 'zustand';
import { adminApi } from '../api/adminApi.js';

function getErrorMessage(error) {
  return error.response?.data?.message || error.message || 'Analytics request failed';
}

export const useAdminAnalyticsStore = create((set) => ({
  overview: null,
  recentOrders: [],
  lowStock: [],
  topProducts: [],
  stockMovements: [],
  isLoading: false,
  error: null,

  async fetchOverview() {
    set({ isLoading: true, error: null });
    try {
      const data = await adminApi.getAnalyticsOverview();
      set({ overview: data.overview || null, isLoading: false });
      return data.overview;
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw error;
    }
  },

  async fetchRecentOrders() {
    set({ isLoading: true, error: null });
    try {
      const data = await adminApi.getRecentOrders();
      set({ recentOrders: data.orders || [], isLoading: false });
      return data.orders || [];
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw error;
    }
  },

  async fetchLowStock() {
    set({ isLoading: true, error: null });
    try {
      const data = await adminApi.getLowStock();
      set({ lowStock: data.variants || [], isLoading: false });
      return data.variants || [];
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw error;
    }
  },

  async fetchTopProducts() {
    set({ isLoading: true, error: null });
    try {
      const data = await adminApi.getTopProducts();
      set({ topProducts: data.products || [], isLoading: false });
      return data.products || [];
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw error;
    }
  },

  async fetchStockMovements() {
    set({ isLoading: true, error: null });
    try {
      const data = await adminApi.getStockMovements();
      set({ stockMovements: data.movements || [], isLoading: false });
      return data.movements || [];
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw error;
    }
  },

  async fetchDashboardData() {
    set({ isLoading: true, error: null });
    try {
      const [overview, recentOrders, lowStock, topProducts, stockMovements] = await Promise.all([
        adminApi.getAnalyticsOverview(),
        adminApi.getRecentOrders(),
        adminApi.getLowStock(),
        adminApi.getTopProducts(),
        adminApi.getStockMovements(),
      ]);

      set({
        overview: overview.overview || null,
        recentOrders: recentOrders.orders || [],
        lowStock: lowStock.variants || [],
        topProducts: topProducts.products || [],
        stockMovements: stockMovements.movements || [],
        isLoading: false,
      });
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw error;
    }
  },
}));
