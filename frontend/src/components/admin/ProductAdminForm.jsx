import React, { useEffect, useMemo, useState } from 'react';
import { useCategoryStore } from '../../store/categoryStore.js';
import { useCollectionStore } from '../../store/collectionStore.js';
import { useAdminProductStore } from '../../store/adminProductStore.js';
import { formatProductStatus, money } from '../../utils/formatters.js';
import { mediaUrl } from '../../utils/mediaUrl.js';

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
  characteristics: '{\n  "origin": "Архив VYBE"\n}',
  images: [],
  variants: [],
};

const flagLabels = {
  isNew: 'Новинка',
  isLimited: 'Лимитированный',
  isFeatured: 'Рекомендуемый',
  isCollectible: 'Коллекционный',
};

function normalizeImageUrl(url) {
  if (!url) return '/images/placeholders/product-placeholder.png';
  return mediaUrl(url);
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

export default function ProductAdminForm({ initialProduct = null, onSubmit, submitLabel = 'Сохранить товар' }) {
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
        { url, alt: current.name || 'Изображение товара VYBE', order: current.images.length },
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
        { size: 'One Size', color: current.color || 'Чёрный', sku: `VYBE-${suffix}`, stock: 0 },
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
      throw new Error('Характеристики должны быть валидным JSON.');
    }

    if (!form.name.trim()) throw new Error('Название обязательно.');
    if (!form.description.trim()) throw new Error('Описание обязательно.');
    if (!Number.isFinite(price) || price <= 0) throw new Error('Цена должна быть больше 0.');
    if (!form.categoryId) throw new Error('Категория обязательна.');
    if (form.discountType === 'PERCENT' && (discountValue < 0 || discountValue > 100)) {
      throw new Error('Скидка в процентах должна быть от 0 до 100.');
    }
    if (form.discountType === 'FIXED' && discountValue > price) {
      throw new Error('Фиксированная скидка не может быть больше цены.');
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
        color: variant.color || form.color || 'По умолчанию',
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
          <p className="section-label">КУЗНИЦА КАТАЛОГА</p>
          <h1>Создайте новый артефакт для витрины</h1>
        </header>

        <nav className="admin-form-tabs" aria-label="Разделы формы товара">
          <a href="#product-details">Данные товара</a>
          <a href="#pricing-inventory">Цена и остатки</a>
          <a href="#media-settings">Медиа и настройки</a>
        </nav>

        <section className="admin-form-section" id="product-details">
          <div className="admin-panel__head">
            <div>
              <p className="section-label">Данные товара</p>
              <h2>Основная информация</h2>
            </div>
          </div>

          <div className="admin-form-grid">
            <label>
              Название товара
              <input value={form.name} onChange={(event) => updateField('name', event.target.value)} />
            </label>
            <label>
              Категория
              <select value={form.categoryId} onChange={(event) => updateField('categoryId', event.target.value)}>
                <option value="">Выберите категорию</option>
                {flatCategories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </label>
            <label>
              Коллекция
              <select value={form.collectionId || ''} onChange={(event) => updateField('collectionId', event.target.value)}>
                <option value="">Без коллекции</option>
                {collections.map((collection) => (
                  <option key={collection.id} value={collection.id}>{collection.name}</option>
                ))}
              </select>
            </label>
            <label>
              Бренд
              <input value={form.brand} onChange={(event) => updateField('brand', event.target.value)} />
            </label>
            <label>
              Дизайнер
              <input value={form.designer} onChange={(event) => updateField('designer', event.target.value)} />
            </label>
            <label>
              Материал
              <input value={form.material} onChange={(event) => updateField('material', event.target.value)} />
            </label>
            <label>
              Цвет
              <input value={form.color} onChange={(event) => updateField('color', event.target.value)} />
            </label>
            <label className="admin-wide">
              Описание
              <textarea rows="5" value={form.description} onChange={(event) => updateField('description', event.target.value)} />
            </label>
          </div>
        </section>

        <section className="admin-form-section" id="pricing-inventory">
          <div className="admin-panel__head">
            <div>
              <p className="section-label">Цена и остатки</p>
              <h2>Цена, скидка и варианты</h2>
            </div>
            <button className="ghost-button small" type="button" onClick={addVariant}>Добавить вариант</button>
          </div>

          <div className="admin-form-grid">
            <label>
              Цена
              <input min="0" type="number" value={form.price} onChange={(event) => updateField('price', event.target.value)} />
            </label>
            <label>
              Старая цена
              <input min="0" type="number" value={form.oldPrice} onChange={(event) => updateField('oldPrice', event.target.value)} />
            </label>
            <label>
              Тип скидки
              <select value={form.discountType} onChange={(event) => updateField('discountType', event.target.value)}>
                <option value="NONE">Без скидки</option>
                <option value="PERCENT">Процент</option>
                <option value="FIXED">Фиксированная</option>
              </select>
            </label>
            <label>
              Значение скидки
              <input min="0" type="number" value={form.discountValue} onChange={(event) => updateField('discountValue', event.target.value)} />
            </label>
          </div>

          <div className="admin-variant-list">
            {form.variants.map((variant, index) => (
              <article key={variant.id || index}>
                <input value={variant.size} onChange={(event) => updateVariant(index, 'size', event.target.value)} placeholder="Размер" />
                <input value={variant.color} onChange={(event) => updateVariant(index, 'color', event.target.value)} placeholder="Цвет" />
                <input value={variant.sku} onChange={(event) => updateVariant(index, 'sku', event.target.value)} placeholder="SKU" />
                <input min="0" type="number" value={variant.stock} onChange={(event) => updateVariant(index, 'stock', event.target.value)} placeholder="Остаток" />
                <button className="admin-icon-action danger" type="button" onClick={() => removeVariant(index)}>Удалить</button>
              </article>
            ))}
          </div>
        </section>

        <section className="admin-form-section" id="media-settings">
          <div className="admin-panel__head">
            <div>
              <p className="section-label">Медиа и настройки</p>
              <h2>Изображения, метки и статус</h2>
            </div>
          </div>

          <label className="admin-upload-zone">
            <span>Перетащите изображения сюда</span>
            <strong>Выбрать файл</strong>
            <input accept="image/jpeg,image/png,image/webp" type="file" onChange={handleUpload} />
          </label>

          <div className="admin-image-list">
            {form.images.map((image, index) => (
              <article key={`${image.url}-${index}`}>
                <img src={normalizeImageUrl(image.url)} alt={image.alt || form.name} />
                <input value={image.alt} onChange={(event) => updateImage(index, 'alt', event.target.value)} placeholder="Alt-текст" />
                <input min="0" type="number" value={image.order} onChange={(event) => updateImage(index, 'order', event.target.value)} placeholder="Порядок" />
                <button className="admin-icon-action danger" type="button" onClick={() => removeImage(index)}>Удалить</button>
              </article>
            ))}
          </div>

          <div className="admin-form-grid">
            <label>
              Статус
              <select value={form.status} onChange={(event) => updateField('status', event.target.value)}>
                <option value="ACTIVE">Активен</option>
                <option value="DRAFT">Черновик</option>
                <option value="ARCHIVED">Архив</option>
                <option value="OUT_OF_STOCK">Нет в наличии</option>
              </select>
            </label>
            <label className="admin-wide">
              Характеристики JSON
              <textarea className="admin-json" value={form.characteristics} onChange={(event) => updateField('characteristics', event.target.value)} />
            </label>
          </div>

          <div className="admin-checks">
            {Object.entries(flagLabels).map(([field, label]) => (
              <label className="check-row" key={field}>
                <input type="checkbox" checked={form[field]} onChange={(event) => updateField(field, event.target.checked)} />
                {label}
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
            {isLoading ? 'Сохраняем...' : submitLabel}
          </button>
        </div>
      </section>

      <aside className="admin-live-preview admin-product-preview">
        <p className="section-label">ПРЕДПРОСМОТР</p>
        <span>Так товар будет выглядеть на витрине.</span>
        <div className="admin-preview-card">
          <div className="admin-preview-image">
            <img src={normalizeImageUrl(previewImage)} alt={form.name || 'Предпросмотр товара'} />
          </div>
          <div className="admin-preview-body">
            <div className="badge-row">
              {form.isNew && <span className="badge blue">Новинка</span>}
              {form.isLimited && <span className="badge gold">Лимит</span>}
              {form.isFeatured && <span className="badge">Рекомендуем</span>}
            </div>
            <span className="product-category">{selectedCategory?.name || 'Без категории'}</span>
            <h3>{form.name || 'Новый товар VYBE'}</h3>
            <p>{form.description || 'Здесь появится описание товара.'}</p>
            <div className="price-row">
              {form.oldPrice && <span className="old-price">{money(form.oldPrice)}</span>}
              <span className="final-price">{money(finalPrice)}</span>
            </div>
            <span className="admin-status active">{formatProductStatus(form.status)}</span>
          </div>
        </div>
      </aside>
    </form>
  );
}
