import api from './axios.js';

export const adminApi = {
  async getProducts(params = {}) {
    const response = await api.get('/products', { params });
    return response.data;
  },

  async getProductById(id) {
    const response = await api.get(`/products/admin/${id}`);
    return response.data;
  },

  async createProduct(data) {
    const response = await api.post('/products', data);
    return response.data;
  },

  async updateProduct(id, data) {
    const response = await api.patch(`/products/${id}`, data);
    return response.data;
  },

  async deleteProduct(id) {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  async uploadProductImage(file) {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post('/products/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async getStock() {
    const response = await api.get('/stock');
    return response.data;
  },

  async updateVariantStock(variantId, data) {
    const response = await api.patch(`/stock/variants/${variantId}`, data);
    return response.data;
  },

  async exportStock() {
    const response = await api.get('/stock/export', { responseType: 'blob' });
    return response.data;
  },

  async getOrders(params = {}) {
    const response = await api.get('/admin/orders', { params });
    return response.data;
  },

  async updateOrderStatus(id, status) {
    const response = await api.patch(`/admin/orders/${id}/status`, { status });
    return response.data;
  },

  async getUsers(params = {}) {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  async getUserById(id) {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },

  async updateUserRole(id, role) {
    const response = await api.patch(`/admin/users/${id}/role`, { role });
    return response.data;
  },

  async updateUserBlock(id, isBlocked) {
    const response = await api.patch(`/admin/users/${id}/block`, { isBlocked });
    return response.data;
  },

  async getAdminArtworks() {
    const response = await api.get('/artworks/admin/all');
    return response.data;
  },

  async createArtwork(data) {
    const response = await api.post('/artworks', data);
    return response.data;
  },

  async updateArtwork(id, data) {
    const response = await api.patch(`/artworks/${id}`, data);
    return response.data;
  },

  async deleteArtwork(id) {
    const response = await api.delete(`/artworks/${id}`);
    return response.data;
  },

  async uploadArtworkImage(file) {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post('/artworks/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async getSiteAssets() {
    const response = await api.get('/site-assets');
    return response.data;
  },

  async getSiteAsset(key) {
    const response = await api.get(`/site-assets/${key}`);
    return response.data;
  },

  async updateSiteAsset(key, data) {
    const response = await api.patch(`/site-assets/${key}`, data);
    return response.data;
  },

  async uploadSiteAssetImage(file) {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post('/site-assets/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};
