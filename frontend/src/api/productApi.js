import api from './axios.js';

export const productApi = {
  async getAll(params = {}) {
    const response = await api.get('/products', { params });
    return response.data;
  },

  async getBySlug(slug) {
    const response = await api.get(`/products/${slug}`);
    return response.data;
  },
};
