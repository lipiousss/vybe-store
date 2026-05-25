import React from 'react';
import ProductCard from '../../components/product/ProductCard.jsx';
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
    if (!activeFilter) {
      return true;
    }

    if (activeFilter === 'limited') {
      return product.isLimited;
    }

    return product.category?.slug === activeFilter;
  });

  return (
    <main className="page-shell collectibles-page">
      <section
        className="page-hero cinematic collectibles-hero"
        style={{ '--collectibles-image': `url("${heroImage}")` }}
      >
        <p className="eyebrow">Collectibles</p>
        <h1>Хранилище артефактов</h1>
        <p>
          Rare objects from the VYBE archive. Designed as fragments of a darker visual world.
        </p>
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

      {isLoading && <p className="state-text">Opening archive...</p>}
      {error && <p className="state-text danger">{error}</p>}
      <div className="product-grid cinematic-grid">
        {visibleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}
