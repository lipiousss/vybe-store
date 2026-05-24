import api from './axios.js';

export const categoryApi = {
  async getAll() {
    const response = await api.get('/categories');
    return response.data;
  },

  async getBySlug(slug) {
    const response = await api.get(`/categories/${slug}`);
    return response.data;
  },
};
