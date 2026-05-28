import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/product/ProductCard.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import Loader from '../../components/ui/Loader.jsx';
import { useCollectionStore } from '../../store/collectionStore.js';
import { mediaUrl } from '../../utils/mediaUrl.js';

export default function CollectionsPage() {
  const { collections, fetchCollections, isLoading, error } = useCollectionStore();
  const activeCollections = collections.filter((collection) => collection.isActive !== false);

  React.useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  return (
    <main className="page-shell collections-page">
      <section className="page-hero cinematic collections-hero">
        <p className="section-label">Collections</p>
        <h1>Archive Drops</h1>
        <p>Curated VYBE drops grouped by material language, mood and dark visual ritual.</p>
      </section>

      {isLoading && <Loader text="Loading collections..." />}
      {error && <ErrorState title="Collections are unavailable" message={error} />}
      {!isLoading && !error && activeCollections.length === 0 && (
        <EmptyState
          label="Collections"
          title="No collections found."
          message="Create collections from the admin panel to show archive drops here."
        />
      )}

      {!isLoading && !error && activeCollections.length > 0 && (
        <section className="collections-list">
          {activeCollections.map((collection) => {
            const products = (collection.products || []).filter((product) => !product.isCollectible).slice(0, 4);
            const image = mediaUrl(collection.image || products[0]?.images?.[0]?.url, '/images/placeholders/product-placeholder.png');

            return (
              <article className="collection-showcase fantasy-card" key={collection.id}>
                <div className="collection-showcase__media">
                  <img src={image} alt={collection.name} />
                </div>
                <div className="collection-showcase__body">
                  <p className="section-label">{collection.slug}</p>
                  <h2>{collection.name}</h2>
                  <p>{collection.description || 'A curated archive of designer relics.'}</p>
                  <Link className="ghost-button" to={`/catalog?collection=${collection.slug}`}>
                    View Products
                  </Link>
                </div>
                {products.length > 0 && (
                  <div className="collection-showcase__products">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}
