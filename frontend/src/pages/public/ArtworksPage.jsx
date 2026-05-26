import React, { useEffect, useMemo } from 'react';
import ArtworkCard from '../../components/artwork/ArtworkCard.jsx';
import ArtworkModal from '../../components/artwork/ArtworkModal.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import Loader from '../../components/ui/Loader.jsx';
import { useArtworkStore } from '../../store/artworkStore.js';
import { mediaUrl } from '../../utils/mediaUrl.js';

const filters = [
  { label: 'All', value: null },
  { label: 'Night Collection', value: 'Night Collection' },
  { label: 'Armor Concepts', value: 'Armor' },
  { label: 'Product Visuals', value: 'Product' },
  { label: 'Posters', value: 'Poster' },
  { label: 'Characters', value: 'Character' },
  { label: 'Environment', value: 'Environment' },
];

const layoutClasses = [
  'left-tall',
  'left-close',
  'center-wide',
  'center-large',
  'right-tall',
  'right-small',
];

function splitArtworkColumns(artworks) {
  const decorated = artworks.map((artwork, index) => ({
    artwork,
    index,
    className: layoutClasses[index % layoutClasses.length],
  }));

  return {
    left: decorated.filter((_, index) => index % 6 === 0 || index % 6 === 1),
    center: decorated.filter((_, index) => index % 6 === 2 || index % 6 === 3),
    right: decorated.filter((_, index) => index % 6 === 4 || index % 6 === 5),
  };
}

export default function ArtworksPage() {
  const {
    artworks,
    isLoading,
    error,
    activeCategory,
    fetchArtworks,
    openArtworkModal,
    setActiveCategory,
  } = useArtworkStore();

  const activeFilter = filters.find((filter) => filter.label === activeCategory) || filters[0];
  const featuredArtwork = artworks[0] || null;
  const columns = useMemo(() => splitArtworkColumns(artworks), [artworks]);

  useEffect(() => {
    fetchArtworks({
      category: activeFilter.value || undefined,
      isActive: true,
    });
  }, [activeFilter.value, fetchArtworks]);

  return (
    <main className="artworks-page">
      <section className="artworks-hero">
        <div>
          <p className="eyebrow">VYBE Visual Archive</p>
          <h1>Visual Archive</h1>
          <p>
            A collection of visual fragments, concept pieces and dark fantasy references from
            the VYBE universe.
          </p>
        </div>
      </section>

      <section className="artwork-filters" aria-label="Artwork filters">
        {filters.map((filter) => (
          <button
            type="button"
            className={activeCategory === filter.label ? 'is-active' : ''}
            onClick={() => setActiveCategory(filter.label)}
            key={filter.label}
          >
            {filter.label}
          </button>
        ))}
      </section>

      {featuredArtwork && (
        <section className="featured-artwork">
          <button type="button" onClick={() => openArtworkModal(featuredArtwork)}>
            <span className="featured-artwork__image">
              <img src={mediaUrl(featuredArtwork.image, '/images/placeholders/artwork-placeholder.png')} alt={featuredArtwork.title} />
            </span>
            <span className="featured-artwork__content">
              <span className="eyebrow">Featured Artwork</span>
              <strong>{featuredArtwork.title}</strong>
              {featuredArtwork.description && <span>{featuredArtwork.description}</span>}
              {Array.isArray(featuredArtwork.tags) && featuredArtwork.tags.length > 0 && (
                <span className="featured-artwork__tags">
                  {featuredArtwork.tags.map((tag) => (
                    <small key={tag}>{tag}</small>
                  ))}
                </span>
              )}
            </span>
          </button>
        </section>
      )}

      <section className="artwork-page-shell">
        <div className="artwork-side-mark">VYBE ARCHIVE</div>

        <header className="artwork-banner" aria-label="Artworks banner">
          <div className="artwork-banner-log">
            <span>archive.boot 24:05:26 - loading visual fragments | status: active</span>
            <span>vybe.index 24:05:26 - golden frame verified | cold glow stable</span>
            <span>visual.node 24:05:26 - concepts, posters, characters, environments</span>
          </div>
          <h2>ARTWORKS</h2>
        </header>

        {isLoading && <Loader text="Loading visual archive..." />}
        {error && <ErrorState title="Visual archive is unavailable" message={error} />}

        {!isLoading && !error && artworks.length === 0 && (
          <EmptyState
            label="Visual archive"
            title="No artworks found in the archive."
            message="Try another archive filter or add artworks from the admin panel."
          />
        )}

        {!isLoading && !error && artworks.length > 0 && (
          <section className="artwork-grid artwork-layout" aria-label="Artwork gallery">
            <div className="artwork-column artwork-column-left">
              {columns.left.map((item) => (
                <ArtworkCard
                  artwork={item.artwork}
                  index={item.index}
                  className={item.className}
                  key={item.artwork.id}
                />
              ))}
            </div>

            <div className="artwork-column artwork-column-center">
              {columns.center.map((item) => (
                <ArtworkCard
                  artwork={item.artwork}
                  index={item.index}
                  className={item.className}
                  key={item.artwork.id}
                />
              ))}
            </div>

            <div className="artwork-column artwork-column-right">
              {columns.right.map((item) => (
                <ArtworkCard
                  artwork={item.artwork}
                  index={item.index}
                  className={item.className}
                  key={item.artwork.id}
                />
              ))}
            </div>
          </section>
        )}
      </section>

      <ArtworkModal />
    </main>
  );
}
