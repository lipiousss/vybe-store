import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore.js';
import { useCartStore } from '../../store/cartStore.js';
import { useFavoriteStore } from '../../store/favoriteStore.js';
import { useProductStore } from '../../store/productStore.js';
import { mediaUrl } from '../../utils/mediaUrl.js';

function money(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

export default function ProductPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { currentProduct, isLoading, error, fetchProductBySlug } = useProductStore();
  const isAuth = useAuthStore((state) => state.isAuth);
  const addToCart = useCartStore((state) => state.addToCart);
  const toggleFavorite = useFavoriteStore((state) => state.toggleFavorite);
  const isFavorite = useFavoriteStore((state) => (
    currentProduct ? state.isFavorite(currentProduct.id) : false
  ));
  const [selectedVariantId, setSelectedVariantId] = React.useState('');
  const [localError, setLocalError] = React.useState(null);

  React.useEffect(() => {
    fetchProductBySlug(slug);
    setSelectedVariantId('');
    setLocalError(null);
  }, [slug, fetchProductBySlug]);

  if (isLoading) {
    return <main className="page-shell"><p className="state-text">Loading item...</p></main>;
  }

  if (error) {
    return <main className="page-shell"><p className="state-text danger">{error}</p></main>;
  }

  if (!currentProduct) {
    return <main className="page-shell"><p className="state-text">Item not found.</p></main>;
  }

  const image = mediaUrl(currentProduct.images?.[0]?.url);
  const variants = currentProduct.variants || [];
  const selectedVariant = variants.find((variant) => variant.id === selectedVariantId);
  const hasVariants = variants.length > 0;
  const isOutOfStock = hasVariants
    ? !variants.some((variant) => variant.stock > 0)
    : currentProduct.status === 'OUT_OF_STOCK';

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
      setLocalError('Out of stock');
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
    <main className="page-shell product-detail">
      <div className="product-detail-media">
        <img src={image} alt={currentProduct.name} />
      </div>

      <section className="product-detail-info">
        <Link className="back-link" to="/catalog">Back to catalog</Link>
        <p className="eyebrow">{currentProduct.category?.name}</p>
        <h1>{currentProduct.name}</h1>
        <div className="detail-price">
          {currentProduct.oldPrice && <span className="old-price">{money(currentProduct.oldPrice)}</span>}
          <span>{money(currentProduct.finalPrice || currentProduct.price)}</span>
        </div>
        <p>{currentProduct.description}</p>

        <dl className="detail-list">
          <div><dt>Collection</dt><dd>{currentProduct.collection?.name || 'Open archive'}</dd></div>
          <div><dt>Material</dt><dd>{currentProduct.material || 'Mixed media'}</dd></div>
          <div><dt>Color</dt><dd>{currentProduct.color || 'Black'}</dd></div>
        </dl>

        {hasVariants && (
          <div className="variant-picker">
            {variants.map((variant) => {
              const label = [variant.size, variant.color].filter(Boolean).join(' / ') || 'Default';
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
                  {label} · {variant.stock} left
                </button>
              );
            })}
          </div>
        )}

        {isOutOfStock && <p className="state-text danger">Out of stock</p>}
        {localError && <p className="state-text danger">{localError}</p>}

        <div className="product-detail-actions">
          <button className="gold-button" type="button" onClick={handleAddToCart} disabled={isOutOfStock}>
            Add to Cart
          </button>
          <button className={`ghost-button${isFavorite ? ' is-active' : ''}`} type="button" onClick={handleFavorite}>
            {isFavorite ? 'In Favorites' : 'Favorite'}
          </button>
        </div>
      </section>
    </main>
  );
}
