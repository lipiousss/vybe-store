import api from './axios.js';

export const authApi = {
  async login(data) {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  async register(data) {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  async me() {
    const response = await api.get('/auth/me');
    return response.data;
  },
};
