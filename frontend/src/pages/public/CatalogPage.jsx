import React from 'react';
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
  const [filters, setFilters] = React.useState(initialFilters);
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

    fetchProducts(params);
  }, [filters, fetchProducts]);

  function updateFilter(name, value) {
    setFilters((current) => ({ ...current, [name]: value }));
  }

  return (
    <main className="page-shell catalog-page">
      <section className="catalog-hero fantasy-card">
        <p className="section-label">Catalog</p>
        <h1>Catalog of Relics</h1>
        <p>Wearable relics and functional artifacts shaped for the night side of style.</p>
      </section>

      <section className="catalog-layout">
        <aside className="filter-panel">
          <label>
            Search
            <input
              value={filters.search}
              onChange={(event) => updateFilter('search', event.target.value)}
              placeholder="Nocturne, relic, eclipse..."
            />
          </label>

          <label>
            Category
            <select value={filters.category} onChange={(event) => updateFilter('category', event.target.value)}>
              <option value="">All categories</option>
              {childCategories.map((category) => (
                <option key={category.id} value={category.slug}>{category.name}</option>
              ))}
            </select>
          </label>

          <label>
            Collection
            <select value={filters.collection} onChange={(event) => updateFilter('collection', event.target.value)}>
              <option value="">All collections</option>
              {collections.map((collection) => (
                <option key={collection.id} value={collection.slug}>{collection.name}</option>
              ))}
            </select>
          </label>

          <div className="price-filter">
            <label>
              Min
              <input
                type="number"
                min="0"
                value={filters.minPrice}
                onChange={(event) => updateFilter('minPrice', event.target.value)}
              />
            </label>
            <label>
              Max
              <input
                type="number"
                min="0"
                value={filters.maxPrice}
                onChange={(event) => updateFilter('maxPrice', event.target.value)}
              />
            </label>
          </div>

          <div className="check-stack">
            {['isNew', 'isLimited', 'isFeatured'].map((name) => (
              <label key={name} className="check-row">
                <input
                  type="checkbox"
                  checked={filters[name]}
                  onChange={(event) => updateFilter(name, event.target.checked)}
                />
                {name.replace('is', '').toUpperCase()}
              </label>
            ))}
          </div>

          <button className="ghost-button" type="button" onClick={() => setFilters(initialFilters)}>
            Reset
          </button>
        </aside>

        <div className="catalog-results">
          {isLoading && <Loader text="Loading catalog..." />}
          {error && <ErrorState title="Catalog is unavailable" message={error} />}
          {!isLoading && products.length === 0 && (
            <EmptyState
              label="Catalog"
              title="No artifacts found."
              message="Try another name, collection, category, or price range."
            />
          )}
          {!isLoading && !error && products.length > 0 && (
            <div className="product-grid">
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
