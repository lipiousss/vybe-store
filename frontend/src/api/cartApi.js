import api from './axios.js';

export const cartApi = {
  async getCart() {
    const response = await api.get('/cart');
    return response.data;
  },

  async addItem(data) {
    const response = await api.post('/cart/items', data);
    return response.data;
  },

  async updateItem(itemId, data) {
    const response = await api.patch(`/cart/items/${itemId}`, data);
    return response.data;
  },

  async removeItem(itemId) {
    const response = await api.delete(`/cart/items/${itemId}`);
    return response.data;
  },

  async clearCart() {
    const response = await api.delete('/cart/clear');
    return response.data;
  },
};
