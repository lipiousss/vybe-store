import api from './axios.js';

export const favoriteApi = {
  async getAll() {
    const response = await api.get('/favorites');
    return response.data;
  },

  async toggle(productId) {
    const response = await api.post(`/favorites/${productId}`);
    return response.data;
  },

  async remove(productId) {
    const response = await api.delete(`/favorites/${productId}`);
    return response.data;
  },
};
