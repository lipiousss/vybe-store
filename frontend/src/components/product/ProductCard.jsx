import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore.js';
import { useCartStore } from '../../store/cartStore.js';
import { useFavoriteStore } from '../../store/favoriteStore.js';
import { mediaUrl } from '../../utils/mediaUrl.js';

function money(value) {
  if (value === null || value === undefined) {
    return '';
  }

  return `$${Number(value).toFixed(2)}`;
}

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const isAuth = useAuthStore((state) => state.isAuth);
  const addToCart = useCartStore((state) => state.addToCart);
  const toggleFavorite = useFavoriteStore((state) => state.toggleFavorite);
  const isFavorite = useFavoriteStore((state) => state.isFavorite(product.id));
  const [message, setMessage] = React.useState(null);
  const [lightPosition, setLightPosition] = React.useState({ x: '50%', y: '50%' });
  const image = mediaUrl(product.images?.[0]?.url);
  const hasDiscount = product.oldPrice && Number(product.oldPrice) > Number(product.finalPrice);
  const hasStock = !product.variants?.length || product.variants.some((variant) => variant.stock > 0);

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

    if (!requireAuth()) {
      return;
    }

    await toggleFavorite(product.id);
  }

  async function handleAddToCart(event) {
    event.preventDefault();
    event.stopPropagation();

    if (!requireAuth()) {
      return;
    }

    if (!hasStock) {
      setMessage('Out of stock');
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
      className="product-card artifact-card"
      style={{ '--light-x': lightPosition.x, '--light-y': lightPosition.y }}
      onMouseMove={handleMouseMove}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.18 }}
    >
      <Link className="product-card-link" to={`/product/${product.slug}`}>
        <div className="product-image-wrap">
          <img src={image} alt={product.images?.[0]?.alt || product.name} />
          <div className="product-card-overlay">
            <span className="view-item">VIEW ITEM</span>
          </div>
        </div>

        <div className="product-card-body">
          <div className="badge-row">
            {product.isNew && <span className="badge blue">NEW</span>}
            {product.isLimited && <span className="badge blood">LIMITED</span>}
            {product.isFeatured && <span className="badge gold">FEATURED</span>}
          </div>

          <h3>{product.name}</h3>

          <div className="price-row">
            {hasDiscount && <span className="old-price">{money(product.oldPrice)}</span>}
            <span className="final-price">{money(product.finalPrice || product.price)}</span>
          </div>
        </div>
      </Link>

      <div className="product-card-actions">
        <button
          className={`icon-action${isFavorite ? ' is-active' : ''}`}
          type="button"
          onClick={handleFavorite}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {'\u2665'}
        </button>
        <button className="icon-action" type="button" onClick={handleAddToCart} disabled={!hasStock} aria-label="Add to cart">
          +
        </button>
      </div>
      {message && <p className="product-card-message">{message}</p>}
    </motion.article>
  );
}
