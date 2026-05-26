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

export default function CollectiblesPage() {
  const [activeFilter, setActiveFilter] = React.useState('');
  const { collectibleProducts, isLoading, error, fetchCollectibles } = useProductStore();
  const { fetchAssets, getAsset } = useSiteAssetStore();
  const heroImage = mediaUrl(getAsset('collectibles_hero_image')?.url, '/images/placeholders/collectible-placeholder.png');

  React.useEffect(() => {
    fetchCollectibles();
    fetchAssets().catch(() => {});
  }, [fetchCollectibles, fetchAssets]);

  const visibleProducts = collectibleProducts.filter((product) => {
    if (!activeFilter) return true;
    if (activeFilter === 'limited') return product.isLimited;
    return product.category?.slug === activeFilter;
  });

  return (
    <main className="page-shell collectibles-page">
      <section
        className="page-hero cinematic collectibles-hero"
        style={{ '--collectibles-image': `url("${heroImage}")` }}
      >
        <p className="section-label">Collectibles</p>
        <h1>Хранилище артефактов</h1>
        <p>
          Rare objects from the VYBE archive. Designed as fragments of a darker visual world.
        </p>
        <button
          className="relic-button"
          type="button"
          onClick={() => document.querySelector('.cinematic-grid')?.scrollIntoView({ behavior: 'smooth' })}
        >
          Explore Relics
        </button>
      </section>

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
    </main>
  );
}
