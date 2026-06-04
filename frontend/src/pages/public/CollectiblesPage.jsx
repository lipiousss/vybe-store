import React from 'react';
import ProductCard from '../../components/product/ProductCard.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import Loader from '../../components/ui/Loader.jsx';
import { useProductStore } from '../../store/productStore.js';
import { useSiteAssetStore } from '../../store/siteAssetStore.js';
import { mediaUrl } from '../../utils/mediaUrl.js';

const filters = [
  ['All', ''],
  ['Figures', 'figures'],
  ['Prints', 'art-books'],
  ['Cards', 'cards'],
  ['Patches', 'patches'],
  ['Objects', 'limited-boxes'],
  ['Limited', 'limited'],
];

const archiveFacts = [
  ['Curated Archive', 'Every object is selected from the VYBE archive.'],
  ['Limited Releases', 'Rare drops in small quantities.'],
  ['Authentic Relics', 'Demo provenance for collectible items.'],
  ['Secure Archive', 'Protected cart and checkout flow.'],
];

export default function CollectiblesPage() {
  const [activeFilter, setActiveFilter] = React.useState('');
  const [sort, setSort] = React.useState('newest');
  const { collectibleProducts, isLoading, error, fetchCollectibles } = useProductStore();
  const { fetchAssets, getAsset } = useSiteAssetStore();
  const heroImage = mediaUrl(getAsset('collectibles_hero_image')?.url, '/images/placeholders/collectible-placeholder.png');

  React.useEffect(() => {
    fetchCollectibles();
    fetchAssets().catch(() => {});
  }, [fetchCollectibles, fetchAssets]);

  const visibleProducts = collectibleProducts
    .filter((product) => {
      if (!activeFilter) return true;
      if (activeFilter === 'limited') return product.isLimited;
      return product.category?.slug === activeFilter;
    })
    .sort((first, second) => {
      if (sort === 'price-asc') return Number(first.finalPrice || first.price) - Number(second.finalPrice || second.price);
      if (sort === 'price-desc') return Number(second.finalPrice || second.price) - Number(first.finalPrice || first.price);
      return new Date(second.createdAt || 0) - new Date(first.createdAt || 0);
    });

  return (
    <main className="page-shell collectibles-page collectibles-reference-page">
      <section
        className="page-hero cinematic collectibles-hero"
        style={{ '--collectibles-image': `url("${heroImage}")` }}
      >
        <p className="section-label">VYBE Archive</p>
        <h1>Collectibles</h1>
        <p>Rare objects from the VYBE archive.</p>
      </section>

      <section className="collectibles-toolbar" aria-label="Collectibles filters">
        <div className="filter-tabs">
          {filters.map(([label, value]) => (
            <button
              key={label}
              className={activeFilter === value ? 'is-active' : ''}
              type="button"
              onClick={() => setActiveFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>

        <label className="collectibles-sort">
          <span>Sort:</span>
          <select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </label>
      </section>

      {isLoading && <Loader text="Opening archive..." />}
      {error && <ErrorState title="Collectibles archive is unavailable" message={error} />}
      {!isLoading && !error && visibleProducts.length === 0 && (
        <EmptyState
          label="Collectibles"
          title="No relics found."
          message="The archive shelf is empty for this filter."
        />
      )}

      {!isLoading && !error && visibleProducts.length > 0 && (
        <div className="product-grid cinematic-grid collectibles-grid">
          {visibleProducts.map((product, index) => (
            <div className="collectible-slot" key={product.id}>
              <span>ARCHIVE {String(index + 1).padStart(3, '0')}</span>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}

      <section className="collectibles-info-strip">
        {archiveFacts.map(([title, text]) => (
          <article key={title}>
            <strong>{title}</strong>
            <p>{text}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
