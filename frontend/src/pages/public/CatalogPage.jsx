import React from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../../components/product/ProductCard.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import Loader from '../../components/ui/Loader.jsx';
import { useCategoryStore } from '../../store/categoryStore.js';
import { useCollectionStore } from '../../store/collectionStore.js';
import { useProductStore } from '../../store/productStore.js';

const initialFilters = {
  search: '',
  category: '',
  collection: '',
  minPrice: '',
  maxPrice: '',
  isNew: false,
  isLimited: false,
  isFeatured: false,
};

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = React.useState(() => ({
    ...initialFilters,
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    collection: searchParams.get('collection') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    isNew: searchParams.get('isNew') === 'true',
    isLimited: searchParams.get('isLimited') === 'true',
    isFeatured: searchParams.get('isFeatured') === 'true',
  }));
  const { products, isLoading, error, fetchProducts } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { collections, fetchCollections } = useCollectionStore();

  const childCategories = categories.filter(
    (category) => category.parentId && category.parent?.slug !== 'collectibles',
  );

  React.useEffect(() => {
    fetchCategories();
    fetchCollections();
  }, [fetchCategories, fetchCollections]);

  React.useEffect(() => {
    const params = {
      isCollectible: false,
      status: 'ACTIVE',
    };

    for (const [key, value] of Object.entries(filters)) {
      if (value !== '' && value !== false) {
        params[key] = value;
      }
    }

    const urlParams = {};
    for (const [key, value] of Object.entries(filters)) {
      if (value !== '' && value !== false) {
        urlParams[key] = String(value);
      }
    }

    setSearchParams(urlParams, { replace: true });
    fetchProducts(params);
  }, [filters, fetchProducts, setSearchParams]);

  function updateFilter(name, value) {
    setFilters((current) => ({ ...current, [name]: value }));
  }

  return (
    <main className="page-shell catalog-page catalog-reference-page">
      <section className="catalog-hero reference-hero">
        <p className="section-label">КАТАЛОГ</p>
        <h1>Найди предмет своего стиля</h1>
        <p>Одежда, аксессуары, декор, периферия и коллекционные предметы в единой визуальной системе.</p>
      </section>

      <section className="catalog-layout">
        <aside className="filter-panel catalog-filter-panel">
          <div className="catalog-filter-panel__head">
            <span>Фильтры</span>
            <button className="ghost-button small" type="button" onClick={() => setFilters(initialFilters)}>
              Сбросить
            </button>
          </div>

          <label>
            Поиск
            <input
              value={filters.search}
              onChange={(event) => updateFilter('search', event.target.value)}
              placeholder="Название, коллекция, материал..."
            />
          </label>

          <label>
            Категория
            <select value={filters.category} onChange={(event) => updateFilter('category', event.target.value)}>
              <option value="">Все категории</option>
              {childCategories.map((category) => (
                <option key={category.id} value={category.slug}>{category.name}</option>
              ))}
            </select>
          </label>

          <label>
            Коллекция
            <select value={filters.collection} onChange={(event) => updateFilter('collection', event.target.value)}>
              <option value="">Все коллекции</option>
              {collections.map((collection) => (
                <option key={collection.id} value={collection.slug}>{collection.name}</option>
              ))}
            </select>
          </label>

          <div className="price-filter">
            <label>
              Цена от
              <input
                type="number"
                min="0"
                value={filters.minPrice}
                onChange={(event) => updateFilter('minPrice', event.target.value)}
              />
            </label>
            <label>
              Цена до
              <input
                type="number"
                min="0"
                value={filters.maxPrice}
                onChange={(event) => updateFilter('maxPrice', event.target.value)}
              />
            </label>
          </div>

          <div className="check-stack">
            {[
              ['isNew', 'Новинки'],
              ['isLimited', 'Лимитированные'],
              ['isFeatured', 'Рекомендуемые'],
            ].map(([name, label]) => (
              <label key={name} className="check-row">
                <input
                  type="checkbox"
                  checked={filters[name]}
                  onChange={(event) => updateFilter(name, event.target.checked)}
                />
                {label}
              </label>
            ))}
          </div>
        </aside>

        <div className="catalog-results">
          <div className="catalog-results__bar">
            <span>{products.length} предметов</span>
            <small>Витрина VYBE</small>
          </div>

          {isLoading && <Loader text="Загружаем каталог..." />}
          {error && <ErrorState title="Каталог недоступен" message={error} />}
          {!isLoading && products.length === 0 && (
            <EmptyState
              label="Каталог"
              title="Товары не найдены"
              message="Попробуйте изменить поиск, категорию, коллекцию или диапазон цены."
            />
          )}
          {!isLoading && !error && products.length > 0 && (
            <div className="vybe-product-grid vybe-product-grid--catalog">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
