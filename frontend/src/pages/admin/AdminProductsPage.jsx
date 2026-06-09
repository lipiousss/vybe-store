import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdminProductStore } from '../../store/adminProductStore.js';
import { useCategoryStore } from '../../store/categoryStore.js';
import { formatProductStatus, money } from '../../utils/formatters.js';
import { mediaUrl } from '../../utils/mediaUrl.js';

function imageUrl(product) {
  const url = product.images?.[0]?.url || '/images/placeholders/product-placeholder.png';
  return mediaUrl(url);
}

function flattenCategories(categories = []) {
  const flattened = categories.flatMap((category) => [
    category,
    ...(category.children ? flattenCategories(category.children) : []),
  ]);

  return Array.from(new Map(flattened.map((category) => [category.id, category])).values());
}

function stockTotal(product) {
  return (product.variants || []).reduce((total, variant) => total + Number(variant.stock || 0), 0);
}

export default function AdminProductsPage() {
  const { products, fetchProducts, deleteProduct, isLoading, error, success, clearMessages } = useAdminProductStore();
  const { categories, fetchCategories } = useCategoryStore();
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    isCollectible: '',
    category: '',
  });

  const flatCategories = useMemo(() => flattenCategories(categories), [categories]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    const params = {
      search: filters.search || undefined,
      status: filters.status || undefined,
      isCollectible: filters.isCollectible || undefined,
      category: filters.category || undefined,
    };
    fetchProducts(params);
  }, [fetchProducts, filters]);

  async function handleDelete(product) {
    if (!window.confirm(`Удалить товар "${product.name}"?`)) return;
    await deleteProduct(product.id);
  }

  function updateFilter(field, value) {
    clearMessages();
    setFilters((current) => ({ ...current, [field]: value }));
  }

  return (
    <div className="admin-products-page">
      <section className="admin-page-head">
        <div>
          <p className="section-label">Товары</p>
          <h1>ТОВАРЫ</h1>
          <p>Управление каталогом, статусами, остатками и витриной.</p>
        </div>
        <Link className="gold-button" to="/admin/products/create">Добавить товар</Link>
      </section>

      <section className="admin-filters admin-filters--products">
        <select value={filters.category} onChange={(event) => updateFilter('category', event.target.value)}>
          <option value="">Все категории</option>
          {flatCategories.map((category) => (
            <option key={category.id} value={category.slug}>{category.name}</option>
          ))}
        </select>
        <select value={filters.status} onChange={(event) => updateFilter('status', event.target.value)}>
          <option value="">Все статусы</option>
          <option value="ACTIVE">Активен</option>
          <option value="DRAFT">Черновик</option>
          <option value="ARCHIVED">Архив</option>
          <option value="OUT_OF_STOCK">Нет в наличии</option>
        </select>
        <select value={filters.isCollectible} onChange={(event) => updateFilter('isCollectible', event.target.value)}>
          <option value="">Все типы</option>
          <option value="false">Обычные товары</option>
          <option value="true">Коллекционные</option>
        </select>
        <input
          value={filters.search}
          onChange={(event) => updateFilter('search', event.target.value)}
          placeholder="Поиск товаров..."
        />
      </section>

      {(error || success) && <p className={`state-text ${error ? 'danger' : 'success'}`}>{error || success}</p>}

      <div className="admin-table-wrap">
        <table className="admin-table admin-table--products">
          <thead>
            <tr>
              <th>Фото</th>
              <th>Товар</th>
              <th>Категория</th>
              <th>Коллекция</th>
              <th>Цена</th>
              <th>Остаток</th>
              <th>Статус</th>
              <th>Метки</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td><img className="admin-product-thumb" src={imageUrl(product)} alt={product.name} /></td>
                <td>
                  <strong>{product.name}</strong>
                  <span>{product.slug}</span>
                </td>
                <td>{product.category?.name || '-'}</td>
                <td>{product.collection?.name || '-'}</td>
                <td>
                  <strong>{money(product.finalPrice || product.price)}</strong>
                  {product.oldPrice && <span>{money(product.oldPrice)}</span>}
                </td>
                <td>{stockTotal(product)}</td>
                <td><span className={`admin-status ${product.status.toLowerCase()}`}>{formatProductStatus(product.status)}</span></td>
                <td>
                  <div className="admin-badges">
                    {product.isNew && <span>Новинка</span>}
                    {product.isLimited && <span>Лимит</span>}
                    {product.isFeatured && <span>Рекомендуем</span>}
                    {product.isCollectible && <span>Коллекционный</span>}
                  </div>
                </td>
                <td>
                  <div className="admin-row-actions">
                    <Link className="admin-icon-action" to={`/admin/products/${product.id}/edit`}>Изменить</Link>
                    <button className="admin-icon-action danger" type="button" onClick={() => handleDelete(product)}>
                      Удалить
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!isLoading && products.length === 0 && (
              <tr><td colSpan="9">Товары не найдены.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
