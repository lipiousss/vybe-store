import api from './axios.js';

export const collectionApi = {
  async getAll() {
    const response = await api.get('/collections');
    return response.data;
  },

  async getBySlug(slug) {
    const response = await api.get(`/collections/${slug}`);
    return response.data;
  },
};
