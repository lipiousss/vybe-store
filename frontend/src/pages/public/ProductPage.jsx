import React from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate, useParams } from 'react-router-dom';
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

const tabs = [
  ['details', 'Описание'],
  ['characteristics', 'Характеристики'],
  ['shipping', 'Доставка и возврат'],
];

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
  const [isLightboxOpen, setIsLightboxOpen] = React.useState(false);
  const [isZoomed, setIsZoomed] = React.useState(false);

  React.useEffect(() => {
    fetchProductBySlug(slug);
    setSelectedVariantId('');
    setSelectedImageIndex(0);
    setActiveTab('details');
    setLocalError(null);
    setIsLightboxOpen(false);
    setIsZoomed(false);
  }, [slug, fetchProductBySlug]);

  React.useEffect(() => {
    fetchProducts({ status: 'ACTIVE' });
  }, [fetchProducts]);

  const images = currentProduct?.images?.length
    ? currentProduct.images
    : [{ url: '/images/placeholders/product-placeholder.png', alt: currentProduct?.name || 'Товар VYBE' }];
  const currentImage = mediaUrl(images[selectedImageIndex]?.url, '/images/placeholders/product-placeholder.png');

  function showPreviousImage() {
    setSelectedImageIndex((current) => (current === 0 ? images.length - 1 : current - 1));
    setIsZoomed(false);
  }

  function showNextImage() {
    setSelectedImageIndex((current) => (current === images.length - 1 ? 0 : current + 1));
    setIsZoomed(false);
  }

  React.useEffect(() => {
    if (!isLightboxOpen) return undefined;

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsLightboxOpen(false);
        setIsZoomed(false);
      }
      if (event.key === 'ArrowLeft') showPreviousImage();
      if (event.key === 'ArrowRight') showNextImage();
    }

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLightboxOpen, images.length]);

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
          message="Этот предмет отсутствует в видимом каталоге."
          action={<Link className="ghost-button" to="/catalog">Вернуться в каталог</Link>}
        />
      </main>
    );
  }

  const variants = currentProduct.variants || [];
  const selectedVariant = variants.find((variant) => variant.id === selectedVariantId);
  const hasVariants = variants.length > 0;
  const isOutOfStock = hasVariants
    ? !variants.some((variant) => Number(variant.stock || 0) > 0)
    : currentProduct.status === 'OUT_OF_STOCK';
  const finalPrice = currentProduct.finalPrice || currentProduct.price;
  const hasDiscount = currentProduct.oldPrice && Number(currentProduct.oldPrice) > Number(finalPrice);
  const discountPercent = hasDiscount
    ? Math.round(((Number(currentProduct.oldPrice) - Number(finalPrice)) / Number(currentProduct.oldPrice)) * 100)
    : 0;
  const relatedProducts = products
    .filter((product) => product.id !== currentProduct.id && product.isCollectible === currentProduct.isCollectible)
    .slice(0, 5);
  const characteristics = currentProduct.characteristics && typeof currentProduct.characteristics === 'object'
    ? Object.entries(currentProduct.characteristics)
    : [];

  function requireAuth() {
    if (!isAuth) {
      navigate('/login');
      return false;
    }

    return true;
  }

  async function handleAddToCart() {
    if (!requireAuth()) return;

    if (hasVariants && !selectedVariantId) {
      setLocalError('Выберите вариант товара.');
      return;
    }

    if (selectedVariant && Number(selectedVariant.stock || 0) < 1) {
      setLocalError('Нет в наличии.');
      return;
    }

    await addToCart(currentProduct, selectedVariantId || undefined, 1);
    setLocalError(null);
  }

  async function handleFavorite() {
    if (!requireAuth()) return;
    await toggleFavorite(currentProduct.id);
  }

  return (
    <main className="vybe-product-page">
      <div className="vybe-product-page__container">
        <nav className="vybe-breadcrumbs" aria-label="Навигационная цепочка">
          <Link to="/">Главная</Link>
          <span>/</span>
          <Link to="/catalog">Каталог</Link>
          <span>/</span>
          <span>{currentProduct.category?.name || 'Предмет VYBE'}</span>
        </nav>

        <section className="vybe-product-detail">
          <div className="vybe-product-gallery">
            <aside className="vybe-product-gallery__thumbs" aria-label="Изображения товара">
              {images.map((item, index) => (
                <button
                  className={selectedImageIndex === index ? 'is-active' : ''}
                  key={`${item.url}-${index}`}
                  type="button"
                  onClick={() => {
                    setSelectedImageIndex(index);
                    setIsZoomed(false);
                  }}
                  aria-label={`Показать изображение ${index + 1}`}
                >
                  <img src={mediaUrl(item.url, '/images/placeholders/product-placeholder.png')} alt={item.alt || currentProduct.name} />
                </button>
              ))}
            </aside>

            <div className="vybe-product-gallery__main">
              {images.length > 1 && (
                <>
                  <button className="vybe-product-gallery__arrow vybe-product-gallery__arrow--prev" type="button" onClick={showPreviousImage} aria-label="Предыдущее изображение">
                    ‹
                  </button>
                  <button className="vybe-product-gallery__arrow vybe-product-gallery__arrow--next" type="button" onClick={showNextImage} aria-label="Следующее изображение">
                    ›
                  </button>
                </>
              )}

              <button className="vybe-product-gallery__image-button" type="button" onClick={() => setIsLightboxOpen(true)} aria-label="Увеличить изображение товара">
                <img src={currentImage} alt={currentProduct.name} />
                <span>Увеличить</span>
              </button>
            </div>
          </div>

          <aside className="vybe-product-info">
            <div className="vybe-product-info__kicker">
              <span>{currentProduct.category?.name || 'Каталог'}</span>
              {currentProduct.collection?.name && <span>{currentProduct.collection.name}</span>}
            </div>

          <h1>{currentProduct.name}</h1>

          <div className="vybe-product-info__badges" aria-label="Метки товара">
            {currentProduct.isNew && <span className="vybe-product-card__badge vybe-product-card__badge--new">Новинка</span>}
            {currentProduct.isLimited && <span className="vybe-product-card__badge vybe-product-card__badge--limited">Лимитировано</span>}
            {currentProduct.isFeatured && <span className="vybe-product-card__badge vybe-product-card__badge--featured">Рекомендуем</span>}
            {discountPercent > 0 && <span className="vybe-product-card__badge vybe-product-card__badge--discount">Скидка {discountPercent}%</span>}
            {isOutOfStock && <span className="vybe-product-card__badge vybe-product-card__badge--empty">Нет в наличии</span>}
          </div>

          <div className="vybe-product-info__price">
            <strong>{money(finalPrice)}</strong>
            {hasDiscount && <del>{money(currentProduct.oldPrice)}</del>}
          </div>

          <p className="vybe-product-info__description">{currentProduct.description}</p>

          <dl className="vybe-product-info__meta">
            <div><dt>Категория</dt><dd>{currentProduct.category?.name || 'Каталог'}</dd></div>
            <div><dt>Коллекция</dt><dd>{currentProduct.collection?.name || 'Без коллекции'}</dd></div>
            <div><dt>Материал</dt><dd>{currentProduct.material || 'Смешанные материалы'}</dd></div>
            <div><dt>Цвет</dt><dd>{currentProduct.color || 'По умолчанию'}</dd></div>
          </dl>

          {hasVariants && (
            <div className="vybe-product-info__variants">
              <div className="vybe-product-info__variants-head">
                <span>Размер / вариант</span>
                <small>Выберите доступный вариант перед добавлением в корзину.</small>
              </div>
              <div className="vybe-product-info__variant-grid">
                {variants.map((variant) => {
                  const label = [variant.size, variant.color].filter(Boolean).join(' / ') || 'Стандарт';
                  return (
                    <button
                      type="button"
                      className={selectedVariantId === variant.id ? 'is-selected active' : ''}
                      disabled={Number(variant.stock || 0) < 1}
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

          <div className="vybe-product-info__action-panel">
            <p className={`vybe-product-info__stock${isOutOfStock ? ' danger' : ''}`}>
              Наличие <strong className={isOutOfStock ? 'out' : ''}>{isOutOfStock ? 'Нет в наличии' : 'В наличии'}</strong>
            </p>
            {localError && <p className="state-text danger">{localError}</p>}
            <div className="vybe-product-info__actions">
              <button className="gold-button" type="button" onClick={handleAddToCart} disabled={isOutOfStock}>
                {isOutOfStock ? 'Нет в наличии' : 'В корзину'}
              </button>
              <button className={`ghost-button${isFavorite ? ' is-active' : ''}`} type="button" onClick={handleFavorite}>
                {isFavorite ? 'В избранном' : 'В избранное'}
              </button>
            </div>
          </div>
          </aside>
        </section>

        <section className="vybe-product-tabs-panel">
          <div className="vybe-product-tabs" role="tablist" aria-label="Информация о товаре">
          {tabs.map(([value, label]) => (
            <button
              className={activeTab === value ? 'is-active active' : ''}
              key={value}
              type="button"
              onClick={() => setActiveTab(value)}
              role="tab"
              aria-selected={activeTab === value}
            >
              {label}
            </button>
          ))}
          </div>

          <div className="vybe-product-tab-content">
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
          {activeTab === 'characteristics' && (
            characteristics.length > 0 ? (
              <dl className="product-characteristics">
                {characteristics.map(([key, value]) => (
                  <div key={key}>
                    <dt>{key}</dt>
                    <dd>{String(value)}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p>Дополнительные характеристики пока не заполнены.</p>
            )
          )}
          {activeTab === 'shipping' && (
            <p>Доставка рассчитывается при оформлении заказа. Возврат возможен в соответствии с условиями магазина, если товар не был использован и сохранён товарный вид.</p>
          )}
          </div>
        </section>

        <section className="vybe-product-related">
          <div className="vybe-product-related__head">
          <div>
            <p className="section-label">Рекомендации</p>
            <h2>Вам может понравиться</h2>
            <p>Похожие предметы из каталога магазина.</p>
          </div>
          <Link to="/catalog">Смотреть все</Link>
          </div>

        {relatedProducts.length > 0 ? (
          <div className="vybe-product-grid vybe-product-grid--recommendations">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} variant="compact" />
            ))}
          </div>
        ) : (
          <EmptyState
            label="Рекомендации"
            title="Похожие товары не найдены"
            message="Загляните в каталог, чтобы выбрать другие предметы VYBE."
            action={<Link className="ghost-button" to="/catalog">Открыть каталог</Link>}
          />
        )}
        </section>
      </div>

      {isLightboxOpen && createPortal((
        <div className="vybe-product-lightbox" role="dialog" aria-modal="true" aria-label="Просмотр изображения товара">
          <button className="vybe-product-lightbox__overlay" type="button" onClick={() => setIsLightboxOpen(false)} aria-label="Закрыть просмотр" />
          <div className="vybe-product-lightbox__content">
            <button className="vybe-product-lightbox__close" type="button" onClick={() => setIsLightboxOpen(false)} aria-label="Закрыть">
              ×
            </button>

            {images.length > 1 && (
              <button className="vybe-product-lightbox__arrow vybe-product-lightbox__arrow--prev" type="button" onClick={showPreviousImage} aria-label="Предыдущее изображение">
                ‹
              </button>
            )}

            <button
              className={`vybe-product-lightbox__image-button${isZoomed ? ' is-zoomed' : ''}`}
              type="button"
              onClick={() => setIsZoomed((value) => !value)}
              aria-label={isZoomed ? 'Уменьшить изображение' : 'Увеличить изображение'}
            >
              <img src={currentImage} alt={currentProduct.name} />
            </button>

            {images.length > 1 && (
              <button className="vybe-product-lightbox__arrow vybe-product-lightbox__arrow--next" type="button" onClick={showNextImage} aria-label="Следующее изображение">
                ›
              </button>
            )}

            <div className="vybe-product-lightbox__caption">
              <strong>{currentProduct.name}</strong>
              <span>{selectedImageIndex + 1} / {images.length}</span>
              <button type="button" onClick={() => setIsZoomed((value) => !value)}>
                {isZoomed ? 'Уменьшить' : 'Приблизить'}
              </button>
            </div>
          </div>
        </div>
      ), document.body)}
    </main>
  );
}
