import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProductAdminForm from '../../components/admin/ProductAdminForm.jsx';
import { useAdminProductStore } from '../../store/adminProductStore.js';

export default function AdminProductCreatePage() {
  const navigate = useNavigate();
  const { createProduct } = useAdminProductStore();

  async function handleSubmit(payload) {
    const product = await createProduct(payload);
    navigate(`/admin/products/${product.id}/edit`);
  }

  return (
    <div className="admin-product-editor">
      <section className="admin-page-head">
        <p className="section-label">Create Product</p>
        <h1>NEW ARTIFACT</h1>
        <p>Add a product card, images, variants and starting stock.</p>
      </section>
      <ProductAdminForm onSubmit={handleSubmit} submitLabel="Create product" />
    </div>
  );
}
