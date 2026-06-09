import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ProductCard from '../../components/product/ProductCard.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import Loader from '../../components/ui/Loader.jsx';
import { useAuthStore } from '../../store/authStore.js';
import { useCartStore } from '../../store/cartStore.js';
import { useFavoriteStore } from '../../store/favoriteStore.js';
import { useProductStore } from '../../store/productStore.js';
import { formatProductStatus, money } from '../../utils/formatters.js';
import { mediaUrl } from '../../utils/mediaUrl.js';

export default function ProductPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const {
    currentProduct,
    products,
    isLoading,
    error,
    fetchProductBySlug,
    fetchProducts,
  } = useProductStore();
  const isAuth = useAuthStore((state) => state.isAuth);
  const addToCart = useCartStore((state) => state.addToCart);
  const toggleFavorite = useFavoriteStore((state) => state.toggleFavorite);
  const isFavorite = useFavoriteStore((state) => (
    currentProduct ? state.isFavorite(currentProduct.id) : false
  ));
  const [selectedVariantId, setSelectedVariantId] = React.useState('');
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);
  const [activeTab, setActiveTab] = React.useState('details');
  const [localError, setLocalError] = React.useState(null);

  React.useEffect(() => {
    fetchProductBySlug(slug);
    setSelectedVariantId('');
    setSelectedImageIndex(0);
    setLocalError(null);
  }, [slug, fetchProductBySlug]);

  React.useEffect(() => {
    fetchProducts({ status: 'ACTIVE' });
  }, [fetchProducts]);

  if (isLoading) {
    return <main className="page-shell"><Loader text="Загружаем товар..." /></main>;
  }

  if (error) {
    return <main className="page-shell"><ErrorState title="Товар недоступен" message={error} /></main>;
  }

  if (!currentProduct) {
    return (
      <main className="page-shell">
        <EmptyState
          label="Товар"
          title="Товар не найден"
          message="Эта реликвия отсутствует в видимом каталоге."
          action={<Link className="ghost-button" to="/catalog">Вернуться в каталог</Link>}
        />
      </main>
    );
  }

  const images = currentProduct.images?.length
    ? currentProduct.images
    : [{ url: '/images/placeholders/product-placeholder.png', alt: currentProduct.name }];
  const image = mediaUrl(images[selectedImageIndex]?.url, '/images/placeholders/product-placeholder.png');
  const variants = currentProduct.variants || [];
  const selectedVariant = variants.find((variant) => variant.id === selectedVariantId);
  const hasVariants = variants.length > 0;
  const isOutOfStock = hasVariants
    ? !variants.some((variant) => variant.stock > 0)
    : currentProduct.status === 'OUT_OF_STOCK';
  const discountPercent = currentProduct.oldPrice && Number(currentProduct.oldPrice) > Number(currentProduct.finalPrice || currentProduct.price)
    ? Math.round(((Number(currentProduct.oldPrice) - Number(currentProduct.finalPrice || currentProduct.price)) / Number(currentProduct.oldPrice)) * 100)
    : 0;
  const relatedProducts = products
    .filter((product) => product.id !== currentProduct.id && product.isCollectible === currentProduct.isCollectible)
    .slice(0, 5);

  function requireAuth() {
    if (!isAuth) {
      navigate('/login');
      return false;
    }

    return true;
  }

  async function handleAddToCart() {
    if (!requireAuth()) {
      return;
    }

    if (hasVariants && !selectedVariantId) {
      setLocalError('Выберите вариант');
      return;
    }

    if (selectedVariant && selectedVariant.stock < 1) {
      setLocalError('Нет в наличии');
      return;
    }

    await addToCart(currentProduct, selectedVariantId || undefined, 1);
    setLocalError(null);
  }

  async function handleFavorite() {
    if (!requireAuth()) {
      return;
    }

    await toggleFavorite(currentProduct.id);
  }

  return (
    <main className="page-shell product-detail product-reference-page">
      <section className="product-reference-layout">
        <aside className="product-thumbnails" aria-label="Изображения товара">
          {images.map((item, index) => (
            <button
              className={selectedImageIndex === index ? 'is-active' : ''}
              key={`${item.url}-${index}`}
              type="button"
              onClick={() => setSelectedImageIndex(index)}
            >
              <img src={mediaUrl(item.url)} alt={item.alt || currentProduct.name} />
            </button>
          ))}
        </aside>

        <div className="product-detail-media">
          <img src={image} alt={currentProduct.name} />
        </div>

        <section className="product-detail-info">
          <nav className="product-breadcrumbs" aria-label="Навигационная цепочка">
            <Link to="/">Главная</Link>
            <span>/</span>
            <Link to="/catalog">Каталог</Link>
            <span>/</span>
            <span>{currentProduct.category?.name || 'Реликвия'}</span>
          </nav>

          <p className="eyebrow">{currentProduct.collection?.name || 'Архив VYBE'}</p>
          <h1>{currentProduct.name}</h1>

          <div className="detail-price">
            <span>{money(currentProduct.finalPrice || currentProduct.price)}</span>
            {currentProduct.oldPrice && <span className="old-price">{money(currentProduct.oldPrice)}</span>}
            {discountPercent > 0 && <strong className="discount-badge">-{discountPercent}%</strong>}
          </div>

          <p>{currentProduct.description}</p>

          <dl className="detail-list">
            <div><dt>Категория</dt><dd>{currentProduct.category?.name || 'Каталог'}</dd></div>
            <div><dt>Коллекция</dt><dd>{currentProduct.collection?.name || 'Архив'}</dd></div>
            <div><dt>Материал</dt><dd>{currentProduct.material || 'Смешанные материалы'}</dd></div>
            <div><dt>Цвет</dt><dd>{currentProduct.color || 'Чёрный'}</dd></div>
          </dl>

          {hasVariants && (
            <div className="variant-section">
              <div className="variant-section__head">
                <span>Размер / вариант</span>
                <small>Выберите доступный вариант</small>
              </div>
              <div className="variant-picker">
                {variants.map((variant) => {
                  const label = [variant.size, variant.color].filter(Boolean).join(' / ') || 'Стандарт';
                  return (
                    <button
                      type="button"
                      className={selectedVariantId === variant.id ? 'is-selected' : ''}
                      disabled={variant.stock < 1}
                      onClick={() => {
                        setSelectedVariantId(variant.id);
                        setLocalError(null);
                      }}
                      key={variant.id}
                    >
                      {label}
                      <small>остаток: {variant.stock}</small>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <p className={`availability-line${isOutOfStock ? ' danger' : ''}`}>
            Наличие <span>{isOutOfStock ? 'Нет в наличии' : 'В наличии'}</span>
          </p>
          {localError && <p className="state-text danger">{localError}</p>}

          <div className="product-detail-actions">
            <button className="gold-button" type="button" onClick={handleAddToCart} disabled={isOutOfStock}>
              В корзину
            </button>
            <button className={`ghost-button${isFavorite ? ' is-active' : ''}`} type="button" onClick={handleFavorite}>
              {isFavorite ? 'В избранном' : 'В избранное'}
            </button>
          </div>
        </section>
      </section>

      <section className="product-details-tabs">
        <div className="product-tabs">
          {[
            ['details', 'Описание'],
            ['care', 'Материалы и уход'],
            ['shipping', 'Доставка и возврат'],
          ].map(([value, label]) => (
            <button
              className={activeTab === value ? 'is-active' : ''}
              key={value}
              type="button"
              onClick={() => setActiveTab(value)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="product-tab-panel">
          {activeTab === 'details' && (
            <>
              <p>{currentProduct.description}</p>
              <ul>
                <li>Дизайнер: {currentProduct.designer || 'VYBE Studio'}</li>
                <li>Бренд: {currentProduct.brand || 'VYBE'}</li>
                <li>Статус: {formatProductStatus(currentProduct.status)}</li>
              </ul>
            </>
          )}
          {activeTab === 'care' && (
            <p>{currentProduct.material || 'Смешанные материалы'} рекомендуется хранить вдали от прямого света и очищать мягко.</p>
          )}
          {activeTab === 'shipping' && (
            <p>Demo-mode создаёт заказ без платёжной системы. Доставка и возврат показаны как часть дипломного сценария.</p>
          )}
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="you-may-like">
          <div className="home-section-head">
            <h2>Вам может понравиться</h2>
            <Link to="/catalog">Смотреть все</Link>
          </div>
          <div className="product-grid product-related-grid">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} variant="compact" />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
