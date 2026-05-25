import api from './axios.js';

export const orderApi = {
  async create(data) {
    const response = await api.post('/orders', data);
    return response.data;
  },

  async getMyOrders() {
    const response = await api.get('/orders/my');
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },
};
