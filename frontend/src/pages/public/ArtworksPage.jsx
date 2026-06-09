import React, { useEffect, useMemo } from 'react';
import ArtworkCard from '../../components/artwork/ArtworkCard.jsx';
import ArtworkModal from '../../components/artwork/ArtworkModal.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import Loader from '../../components/ui/Loader.jsx';
import { useArtworkStore } from '../../store/artworkStore.js';
import { mediaUrl } from '../../utils/mediaUrl.js';

const filters = [
  { label: 'Все', value: null },
  { label: 'Ночная коллекция', value: 'Night Collection' },
  { label: 'Концепты брони', value: 'Armor' },
  { label: 'Визуалы товаров', value: 'Product' },
  { label: 'Постеры', value: 'Poster' },
  { label: 'Персонажи', value: 'Character' },
  { label: 'Окружение', value: 'Environment' },
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
          <p className="eyebrow">Визуальный архив VYBE</p>
          <h1>Визуальный архив</h1>
          <p>
            Коллекция визуальных фрагментов, концептов и dark fantasy-референсов
            из вселенной VYBE.
          </p>
        </div>
      </section>

      <section className="artwork-filters" aria-label="Фильтры артворков">
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
              <span className="eyebrow">Главный артворк</span>
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
        <div className="artwork-side-mark">АРХИВ VYBE</div>

        <header className="artwork-banner" aria-label="Баннер артворков">
          <div className="artwork-banner-log">
            <span>archive.boot 24:05:26 - загрузка визуальных фрагментов | статус: активен</span>
            <span>vybe.index 24:05:26 - золотая рамка проверена | холодное свечение стабильно</span>
            <span>visual.node 24:05:26 - концепты, постеры, персонажи, окружение</span>
          </div>
          <h2>АРТВОРКИ</h2>
        </header>

        {isLoading && <Loader text="Загружаем визуальный архив..." />}
        {error && <ErrorState title="Визуальный архив недоступен" message={error} />}

        {!isLoading && !error && artworks.length === 0 && (
          <EmptyState
            label="Визуальный архив"
            title="Артворки не найдены"
            message="Попробуйте другой фильтр или добавьте артворки в админ-панели."
          />
        )}

        {!isLoading && !error && artworks.length > 0 && (
          <section className="artwork-grid artwork-layout" aria-label="Галерея артворков">
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
