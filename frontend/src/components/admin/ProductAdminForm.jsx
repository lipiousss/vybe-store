import React, { useEffect, useMemo, useState } from 'react';
import { useCategoryStore } from '../../store/categoryStore.js';
import { useCollectionStore } from '../../store/collectionStore.js';
import { useAdminProductStore } from '../../store/adminProductStore.js';

const API_URL = 'http://localhost:4000';

const defaultForm = {
  name: '',
  description: '',
  price: '',
  oldPrice: '',
  discountType: 'NONE',
  discountValue: 0,
  status: 'ACTIVE',
  brand: 'VYBE',
  designer: 'VYBE Studio',
  material: '',
  color: '',
  categoryId: '',
  collectionId: '',
  isNew: false,
  isLimited: false,
  isFeatured: false,
  isCollectible: false,
  characteristics: '{\n  "origin": "VYBE archive"\n}',
  images: [],
  variants: [],
};

function normalizeImageUrl(url) {
  if (!url) return '/images/placeholders/product-placeholder.png';
  if (url.startsWith('/uploads')) return `${API_URL}${url}`;
  return url;
}

function flattenCategories(categories = []) {
  const flattened = categories.flatMap((category) => [
    category,
    ...(category.children ? flattenCategories(category.children) : []),
  ]);

  return Array.from(new Map(flattened.map((category) => [category.id, category])).values());
}

function toForm(product) {
  if (!product) return defaultForm;

  return {
    name: product.name || '',
    description: product.description || '',
    price: product.price ?? '',
    oldPrice: product.oldPrice ?? '',
    discountType: product.discountType || 'NONE',
    discountValue: product.discountValue ?? 0,
    status: product.status || 'ACTIVE',
    brand: product.brand || 'VYBE',
    designer: product.designer || 'VYBE Studio',
    material: product.material || '',
    color: product.color || '',
    categoryId: product.categoryId || '',
    collectionId: product.collectionId || '',
    isNew: Boolean(product.isNew),
    isLimited: Boolean(product.isLimited),
    isFeatured: Boolean(product.isFeatured),
    isCollectible: Boolean(product.isCollectible),
    characteristics: JSON.stringify(product.characteristics || {}, null, 2),
    images: (product.images || []).map((image, index) => ({
      url: image.url,
      alt: image.alt || product.name || '',
      order: image.order ?? index,
    })),
    variants: (product.variants || []).map((variant) => ({
      id: variant.id,
      size: variant.size || '',
      color: variant.color || '',
      sku: variant.sku || '',
      stock: variant.stock ?? 0,
    })),
  };
}

function calculateFinalPrice(form) {
  const price = Number(form.price) || 0;
  const discountValue = Number(form.discountValue) || 0;

  if (form.discountType === 'PERCENT') return Math.max(price - price * (discountValue / 100), 0);
  if (form.discountType === 'FIXED') return Math.max(price - discountValue, 0);
  return price;
}

export default function ProductAdminForm({ initialProduct = null, onSubmit, submitLabel = 'Save product' }) {
  const { categories, fetchCategories } = useCategoryStore();
  const { collections, fetchCollections } = useCollectionStore();
  const { uploadImage, isLoading, error, success, clearMessages } = useAdminProductStore();
  const [form, setForm] = useState(() => toForm(initialProduct));
  const [validationError, setValidationError] = useState('');

  const flatCategories = useMemo(() => flattenCategories(categories), [categories]);
  const selectedCategory = flatCategories.find((category) => category.id === form.categoryId);
  const previewImage = form.images[0]?.url;
  const finalPrice = calculateFinalPrice(form);

  useEffect(() => {
    fetchCategories();
    fetchCollections();
  }, [fetchCategories, fetchCollections]);

  useEffect(() => {
    setForm(toForm(initialProduct));
    clearMessages();
  }, [initialProduct, clearMessages]);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function updateImage(index, field, value) {
    setForm((current) => ({
      ...current,
      images: current.images.map((image, imageIndex) =>
        imageIndex === index ? { ...image, [field]: value } : image,
      ),
    }));
  }

  function removeImage(index) {
    setForm((current) => ({
      ...current,
      images: current.images.filter((_, imageIndex) => imageIndex !== index),
    }));
  }

  async function handleUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const url = await uploadImage(file);
    setForm((current) => ({
      ...current,
      images: [
        ...current.images,
        { url, alt: current.name || 'VYBE product image', order: current.images.length },
      ],
    }));
    event.target.value = '';
  }

  function addVariant() {
    const suffix = Date.now().toString().slice(-6);
    setForm((current) => ({
      ...current,
      variants: [
        ...current.variants,
        { size: 'One Size', color: current.color || 'Black', sku: `VYBE-${suffix}`, stock: 0 },
      ],
    }));
  }

  function updateVariant(index, field, value) {
    setForm((current) => ({
      ...current,
      variants: current.variants.map((variant, variantIndex) =>
        variantIndex === index ? { ...variant, [field]: value } : variant,
      ),
    }));
  }

  function removeVariant(index) {
    setForm((current) => ({
      ...current,
      variants: current.variants.filter((_, variantIndex) => variantIndex !== index),
    }));
  }

  function buildPayload() {
    const price = Number(form.price);
    const oldPrice = form.oldPrice === '' || form.oldPrice === null ? null : Number(form.oldPrice);
    const discountValue = Number(form.discountValue) || 0;
    let characteristics;

    try {
      characteristics = JSON.parse(form.characteristics || '{}');
    } catch {
      throw new Error('Characteristics must be valid JSON.');
    }

    if (!form.name.trim()) throw new Error('Name is required.');
    if (!form.description.trim()) throw new Error('Description is required.');
    if (!Number.isFinite(price) || price <= 0) throw new Error('Price must be greater than 0.');
    if (!form.categoryId) throw new Error('Category is required.');
    if (form.discountType === 'PERCENT' && (discountValue < 0 || discountValue > 100)) {
      throw new Error('Percent discount must be from 0 to 100.');
    }
    if (form.discountType === 'FIXED' && discountValue > price) {
      throw new Error('Fixed discount cannot be greater than price.');
    }

    return {
      ...form,
      name: form.name.trim(),
      description: form.description.trim(),
      price,
      oldPrice,
      discountValue,
      collectionId: form.collectionId || null,
      characteristics,
      images: form.images.map((image, index) => ({
        url: image.url,
        alt: image.alt || form.name,
        order: Number(image.order ?? index),
      })),
      variants: form.variants.map((variant) => ({
        id: variant.id,
        size: variant.size || 'One Size',
        color: variant.color || form.color || 'Default',
        sku: variant.sku,
        stock: Math.max(Number(variant.stock) || 0, 0),
      })),
    };
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setValidationError('');

    try {
      await onSubmit(buildPayload());
    } catch (submitError) {
      setValidationError(submitError.response?.data?.message || submitError.message);
    }
  }

  return (
    <form className="admin-form-shell" onSubmit={handleSubmit}>
      <section className="admin-form-main">
        <header className="admin-form-hero">
          <p className="section-label">FORGE THE CATALOGUE</p>
          <h1>Create a new artifact for your realm</h1>
        </header>

        <nav className="admin-form-tabs" aria-label="Product form sections">
          <a href="#product-details">Product Details</a>
          <a href="#pricing-inventory">Pricing & Inventory</a>
          <a href="#media-settings">Media & Settings</a>
        </nav>

        <section className="admin-form-section" id="product-details">
          <div className="admin-panel__head">
            <div>
              <p className="section-label">Product Details</p>
              <h2>Core artifact data</h2>
            </div>
          </div>

          <div className="admin-form-grid">
            <label>
              Product Name
              <input value={form.name} onChange={(event) => updateField('name', event.target.value)} />
            </label>
            <label>
              Category
              <select value={form.categoryId} onChange={(event) => updateField('categoryId', event.target.value)}>
                <option value="">Select category</option>
                {flatCategories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </label>
            <label>
              Collection
              <select value={form.collectionId || ''} onChange={(event) => updateField('collectionId', event.target.value)}>
                <option value="">No collection</option>
                {collections.map((collection) => (
                  <option key={collection.id} value={collection.id}>{collection.name}</option>
                ))}
              </select>
            </label>
            <label>
              Brand
              <input value={form.brand} onChange={(event) => updateField('brand', event.target.value)} />
            </label>
            <label>
              Designer
              <input value={form.designer} onChange={(event) => updateField('designer', event.target.value)} />
            </label>
            <label>
              Material
              <input value={form.material} onChange={(event) => updateField('material', event.target.value)} />
            </label>
            <label>
              Color
              <input value={form.color} onChange={(event) => updateField('color', event.target.value)} />
            </label>
            <label className="admin-wide">
              Description
              <textarea rows="5" value={form.description} onChange={(event) => updateField('description', event.target.value)} />
            </label>
          </div>
        </section>

        <section className="admin-form-section" id="pricing-inventory">
          <div className="admin-panel__head">
            <div>
              <p className="section-label">Pricing & Inventory</p>
              <h2>Price, discount and variants</h2>
            </div>
            <button className="ghost-button small" type="button" onClick={addVariant}>Add variant</button>
          </div>

          <div className="admin-form-grid">
            <label>
              Price
              <input min="0" type="number" value={form.price} onChange={(event) => updateField('price', event.target.value)} />
            </label>
            <label>
              Old Price
              <input min="0" type="number" value={form.oldPrice} onChange={(event) => updateField('oldPrice', event.target.value)} />
            </label>
            <label>
              Discount Type
              <select value={form.discountType} onChange={(event) => updateField('discountType', event.target.value)}>
                <option value="NONE">NONE</option>
                <option value="PERCENT">PERCENT</option>
                <option value="FIXED">FIXED</option>
              </select>
            </label>
            <label>
              Discount Value
              <input min="0" type="number" value={form.discountValue} onChange={(event) => updateField('discountValue', event.target.value)} />
            </label>
          </div>

          <div className="admin-variant-list">
            {form.variants.map((variant, index) => (
              <article key={variant.id || index}>
                <input value={variant.size} onChange={(event) => updateVariant(index, 'size', event.target.value)} placeholder="Size" />
                <input value={variant.color} onChange={(event) => updateVariant(index, 'color', event.target.value)} placeholder="Color" />
                <input value={variant.sku} onChange={(event) => updateVariant(index, 'sku', event.target.value)} placeholder="SKU" />
                <input min="0" type="number" value={variant.stock} onChange={(event) => updateVariant(index, 'stock', event.target.value)} placeholder="Stock" />
                <button className="admin-icon-action danger" type="button" onClick={() => removeVariant(index)}>Remove</button>
              </article>
            ))}
          </div>
        </section>

        <section className="admin-form-section" id="media-settings">
          <div className="admin-panel__head">
            <div>
              <p className="section-label">Media & Settings</p>
              <h2>Images, flags and status</h2>
            </div>
          </div>

          <label className="admin-upload-zone">
            <span>Drag & drop images here</span>
            <strong>Choose Files</strong>
            <input accept="image/jpeg,image/png,image/webp" type="file" onChange={handleUpload} />
          </label>

          <div className="admin-image-list">
            {form.images.map((image, index) => (
              <article key={`${image.url}-${index}`}>
                <img src={normalizeImageUrl(image.url)} alt={image.alt || form.name} />
                <input value={image.alt} onChange={(event) => updateImage(index, 'alt', event.target.value)} placeholder="Alt" />
                <input min="0" type="number" value={image.order} onChange={(event) => updateImage(index, 'order', event.target.value)} placeholder="Order" />
                <button className="admin-icon-action danger" type="button" onClick={() => removeImage(index)}>Remove</button>
              </article>
            ))}
          </div>

          <div className="admin-form-grid">
            <label>
              Status
              <select value={form.status} onChange={(event) => updateField('status', event.target.value)}>
                <option value="ACTIVE">ACTIVE</option>
                <option value="DRAFT">DRAFT</option>
                <option value="ARCHIVED">ARCHIVED</option>
                <option value="OUT_OF_STOCK">OUT_OF_STOCK</option>
              </select>
            </label>
            <label className="admin-wide">
              Characteristics JSON
              <textarea className="admin-json" value={form.characteristics} onChange={(event) => updateField('characteristics', event.target.value)} />
            </label>
          </div>

          <div className="admin-checks">
            {['isNew', 'isLimited', 'isFeatured', 'isCollectible'].map((field) => (
              <label className="check-row" key={field}>
                <input type="checkbox" checked={form[field]} onChange={(event) => updateField(field, event.target.checked)} />
                {field}
              </label>
            ))}
          </div>
        </section>

        {(validationError || error || success) && (
          <p className={`state-text ${validationError || error ? 'danger' : 'success'}`}>
            {validationError || error || success}
          </p>
        )}

        <div className="admin-form-actions">
          <button className="gold-button" type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : submitLabel}
          </button>
        </div>
      </section>

      <aside className="admin-live-preview admin-product-preview">
        <p className="section-label">LIVE PREVIEW</p>
        <span>This is how your product will appear on the store.</span>
        <div className="admin-preview-card">
          <div className="admin-preview-image">
            <img src={normalizeImageUrl(previewImage)} alt={form.name || 'Product preview'} />
          </div>
          <div className="admin-preview-body">
            <div className="badge-row">
              {form.isNew && <span className="badge blue">NEW</span>}
              {form.isLimited && <span className="badge gold">LIMITED</span>}
              {form.isFeatured && <span className="badge">FEATURED</span>}
            </div>
            <span className="product-category">{selectedCategory?.name || 'No category'}</span>
            <h3>{form.name || 'Unnamed VYBE item'}</h3>
            <p>{form.description || 'Description preview will appear here.'}</p>
            <div className="price-row">
              {form.oldPrice && <span className="old-price">{Number(form.oldPrice).toLocaleString('ru-RU')} ₽</span>}
              <span className="final-price">{finalPrice.toLocaleString('ru-RU')} ₽</span>
            </div>
          </div>
        </div>
      </aside>
    </form>
  );
}
