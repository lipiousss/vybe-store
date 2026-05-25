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
        <p className="eyebrow">Create Product</p>
        <h1>Новый товар</h1>
        <p>Добавьте карточку товара, изображения, варианты и стартовые остатки.</p>
      </section>
      <ProductAdminForm onSubmit={handleSubmit} submitLabel="Create product" />
    </div>
  );
}
