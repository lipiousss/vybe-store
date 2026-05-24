import api from './axios.js';

export const artworkApi = {
  async getAll(params = {}) {
    const response = await api.get('/artworks', { params });
    return response.data;
  },

  async getBySlug(slug) {
    const response = await api.get(`/artworks/${slug}`);
    return response.data;
  },
};
