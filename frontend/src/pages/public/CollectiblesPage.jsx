import React from 'react';
import ProductCard from '../../components/product/ProductCard.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import Loader from '../../components/ui/Loader.jsx';
import { useProductStore } from '../../store/productStore.js';
import { useSiteAssetStore } from '../../store/siteAssetStore.js';
import { mediaUrl } from '../../utils/mediaUrl.js';

const filters = [
  ['Все', ''],
  ['Фигурки', 'figures'],
  ['Постеры', 'art-books'],
  ['Карты', 'cards'],
  ['Патчи', 'patches'],
  ['Объекты', 'limited-boxes'],
  ['Лимитированные', 'limited'],
];

const archiveFacts = [
  ['Кураторский архив', 'Каждый объект отобран из визуального архива VYBE.'],
  ['Лимитированные релизы', 'Редкие дропы в малых тиражах.'],
  ['Визуальная ценность', 'Предметы работают как часть dark fantasy-сцены.'],
  ['Demo-доставка', 'Корзина и оформление заказа работают в демонстрационном режиме.'],
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
        className="page-hero cinematic collectibles-hero reference-hero"
        style={{ '--collectibles-image': `url("${heroImage}")` }}
      >
        <p className="section-label">КОЛЛЕКЦИОННЫЕ ПРЕДМЕТЫ</p>
        <h1>Архив редких вещей</h1>
        <p>Лимитированные предметы, артбуки, стикер-паки и коллекционные фигурки.</p>
      </section>

      <section className="collectibles-toolbar" aria-label="Фильтры коллекционных предметов">
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
          <span>Сортировка</span>
          <select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="newest">Сначала новые</option>
            <option value="price-asc">Цена: по возрастанию</option>
            <option value="price-desc">Цена: по убыванию</option>
          </select>
        </label>
      </section>

      {isLoading && <Loader text="Открываем архив..." />}
      {error && <ErrorState title="Архив коллекционных предметов недоступен" message={error} />}
      {!isLoading && !error && visibleProducts.length === 0 && (
        <EmptyState
          label="Коллекционные предметы"
          title="Редкие вещи не найдены"
          message="На этой полке архива пока пусто для выбранного фильтра."
        />
      )}

      {!isLoading && !error && visibleProducts.length > 0 && (
        <div className="cinematic-grid collectibles-grid vybe-product-grid vybe-product-grid--collectibles">
          {visibleProducts.map((product, index) => (
            <div className="collectible-slot" key={product.id}>
              <span>АРХИВ {String(index + 1).padStart(3, '0')}</span>
              <ProductCard product={product} variant="collectible" />
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
