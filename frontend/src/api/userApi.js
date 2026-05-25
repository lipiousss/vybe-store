import api from './axios.js';

export const userApi = {
  async getProfile() {
    const response = await api.get('/users/profile');
    return response.data;
  },

  async updateProfile(data) {
    const response = await api.patch('/users/profile', data);
    return response.data;
  },

  async changePassword(data) {
    const response = await api.patch('/users/change-password', data);
    return response.data;
  },

  async changeEmail(data) {
    const response = await api.patch('/users/change-email', data);
    return response.data;
  },

  async updatePhone(data) {
    const response = await api.patch('/users/phone', data);
    return response.data;
  },

  async uploadAvatar(file) {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await api.post('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },
};
