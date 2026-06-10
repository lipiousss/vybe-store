import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore.js';
import { useCartStore } from '../../store/cartStore.js';
import { useFavoriteStore } from '../../store/favoriteStore.js';
import { money } from '../../utils/formatters.js';
import { mediaUrl } from '../../utils/mediaUrl.js';

const badgePriority = {
  outOfStock: 1,
  discount: 2,
  limited: 3,
  new: 4,
  featured: 5,
  archive: 6,
};

export default function ProductCard({ product, variant = 'default' }) {
  const navigate = useNavigate();
  const isAuth = useAuthStore((state) => state.isAuth);
  const addToCart = useCartStore((state) => state.addToCart);
  const toggleFavorite = useFavoriteStore((state) => state.toggleFavorite);
  const isFavorite = useFavoriteStore((state) => state.isFavorite(product.id));
  const [message, setMessage] = React.useState(null);
  const [lightPosition, setLightPosition] = React.useState({ x: '50%', y: '50%' });

  const rawImage = product.images?.[0]?.url;
  const image = rawImage ? mediaUrl(rawImage) : null;
  const categoryName = product.category?.name || product.categoryName || '';
  const collectionName = product.collection?.name || '';
  const eyebrow = [categoryName, collectionName].filter(Boolean).join(' / ') || 'VYBE';
  const finalPrice = product.finalPrice || product.price;
  const hasDiscount = product.oldPrice && Number(product.oldPrice) > Number(finalPrice);
  const discountPercent = hasDiscount
    ? Math.round(((Number(product.oldPrice) - Number(finalPrice)) / Number(product.oldPrice)) * 100)
    : 0;
  const variants = product.variants || [];
  const stockTotal = variants.reduce((sum, item) => sum + Number(item.stock || 0), 0);
  const hasVariantStock = variants.length ? variants.some((item) => Number(item.stock || 0) > 0) : true;
  const isArchived = product.status === 'ARCHIVED';
  const isOutOfStock = product.status === 'OUT_OF_STOCK' || !hasVariantStock;
  const hasStock = !isOutOfStock && !isArchived;

  const badges = [
    isOutOfStock && { key: 'outOfStock', label: 'Нет в наличии', className: 'vybe-product-card__badge--empty' },
    hasDiscount && { key: 'discount', label: `Скидка ${discountPercent}%`, className: 'vybe-product-card__badge--discount' },
    product.isLimited && { key: 'limited', label: 'Лимитировано', className: 'vybe-product-card__badge--limited' },
    product.isNew && { key: 'new', label: 'Новинка', className: 'vybe-product-card__badge--new' },
    product.isFeatured && { key: 'featured', label: 'Рекомендуем', className: 'vybe-product-card__badge--featured' },
    isArchived && { key: 'archive', label: 'Архив', className: 'vybe-product-card__badge--archive' },
  ]
    .filter(Boolean)
    .sort((first, second) => badgePriority[first.key] - badgePriority[second.key])
    .slice(0, 3);

  React.useEffect(() => {
    if (!message) return undefined;

    const timer = window.setTimeout(() => setMessage(null), 2200);
    return () => window.clearTimeout(timer);
  }, [message]);

  function requireAuth() {
    if (!isAuth) {
      navigate('/login');
      return false;
    }

    return true;
  }

  async function handleFavorite(event) {
    event.preventDefault();
    event.stopPropagation();

    if (!requireAuth()) return;
    await toggleFavorite(product.id);
  }

  async function handleAddToCart(event) {
    event.preventDefault();
    event.stopPropagation();

    if (!requireAuth()) return;

    if (!hasStock) {
      setMessage('Нет в наличии');
      return;
    }

    await addToCart(product, undefined, 1);
  }

  function handleMouseMove(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    setLightPosition({
      x: `${((event.clientX - rect.left) / rect.width) * 100}%`,
      y: `${((event.clientY - rect.top) / rect.height) * 100}%`,
    });
  }

  return (
    <motion.article
      className={`vybe-product-card vybe-product-card--${variant}`}
      style={{ '--card-light-x': lightPosition.x, '--card-light-y': lightPosition.y }}
      onMouseMove={handleMouseMove}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
    >
      <div className="vybe-product-card__media">
        <Link className="vybe-product-card__media-link" to={`/product/${product.slug}`} aria-label={`Открыть товар ${product.name}`}>
          {image ? (
            <img className="vybe-product-card__image" src={image} alt={product.images?.[0]?.alt || product.name} />
          ) : (
            <span className="vybe-product-card__image-placeholder">Нет изображения</span>
          )}
        </Link>

        {badges.length > 0 && (
          <div className="vybe-product-card__badges" aria-label="Метки товара">
            {badges.map((badge) => (
              <span className={`vybe-product-card__badge ${badge.className}`} key={badge.key}>
                {badge.label}
              </span>
            ))}
          </div>
        )}

        <button
          className={`vybe-product-card__favorite${isFavorite ? ' is-active' : ''}`}
          type="button"
          onClick={handleFavorite}
          aria-label={isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
        >
          <span aria-hidden="true">♥</span>
        </button>
      </div>

      <div className="vybe-product-card__body">
        <div className="vybe-product-card__eyebrow">{eyebrow}</div>

        <h3 className="vybe-product-card__title">
          <Link to={`/product/${product.slug}`}>{product.name}</Link>
        </h3>

        <div className="vybe-product-card__meta">
          {product.material && <span>{product.material}</span>}
          {product.color && <span>{product.color}</span>}
        </div>

        <div className="vybe-product-card__purchase">
          <div className="vybe-product-card__price-row">
            <span className="vybe-product-card__price">{money(finalPrice)}</span>
            {hasDiscount && <span className="vybe-product-card__old-price">{money(product.oldPrice)}</span>}
          </div>

          <div className={`vybe-product-card__stock${hasStock ? '' : ' is-empty'}`}>
            {hasStock ? 'В наличии' : 'Нет в наличии'}
            {hasStock && variants.length ? <span>{stockTotal} шт.</span> : null}
          </div>
        </div>

        <div className="vybe-product-card__actions">
          <Link className="vybe-product-card__details" to={`/product/${product.slug}`}>
            Подробнее
          </Link>
          <button className="vybe-product-card__cart" type="button" onClick={handleAddToCart} disabled={!hasStock}>
            {hasStock ? 'В корзину' : 'Нет в наличии'}
          </button>
        </div>
      </div>

      {message && <p className="vybe-product-card__message">{message}</p>}
    </motion.article>
  );
}
