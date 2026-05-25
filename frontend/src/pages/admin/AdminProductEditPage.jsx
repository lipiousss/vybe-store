import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductAdminForm from '../../components/admin/ProductAdminForm.jsx';
import { useAdminProductStore } from '../../store/adminProductStore.js';

export default function AdminProductEditPage() {
  const { id } = useParams();
  const { currentProduct, fetchProductById, updateProduct, isLoading, error } = useAdminProductStore();

  useEffect(() => {
    fetchProductById(id);
  }, [fetchProductById, id]);

  async function handleSubmit(payload) {
    await updateProduct(id, payload);
  }

  if (isLoading && !currentProduct) {
    return <p className="state-text">Loading product...</p>;
  }

  if (error && !currentProduct) {
    return <p className="state-text danger">{error}</p>;
  }

  return (
    <div className="admin-product-editor">
      <section className="admin-page-head">
        <p className="eyebrow">Edit Product</p>
        <h1>{currentProduct?.name || 'Product editor'}</h1>
        <p>Измените карточку товара, фотографии, варианты и складские остатки.</p>
      </section>
      {currentProduct && (
        <ProductAdminForm initialProduct={currentProduct} onSubmit={handleSubmit} submitLabel="Save changes" />
      )}
    </div>
  );
}
