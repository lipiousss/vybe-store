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
import { mediaUrl } from '../../utils/mediaUrl.js';

function money(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

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
    return <main className="page-shell"><Loader text="Loading item..." /></main>;
  }

  if (error) {
    return <main className="page-shell"><ErrorState title="Product is unavailable" message={error} /></main>;
  }

  if (!currentProduct) {
    return (
      <main className="page-shell">
        <EmptyState
          label="Product"
          title="Item not found."
          message="This artifact is absent from the visible catalog."
          action={<Link className="ghost-button" to="/catalog">Back to catalog</Link>}
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
      setLocalError('Choose a variant');
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
    <main className="page-shell product-detail product-reference-page">
      <section className="product-reference-layout">
        <aside className="product-thumbnails" aria-label="Product images">
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
          <nav className="product-breadcrumbs" aria-label="Breadcrumbs">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/catalog">Shop</Link>
            <span>/</span>
            <span>{currentProduct.category?.name || 'Relic'}</span>
          </nav>

          <p className="eyebrow">{currentProduct.collection?.name || 'VYBE Archive'}</p>
          <h1>{currentProduct.name}</h1>

          <div className="detail-price">
            <span>{money(currentProduct.finalPrice || currentProduct.price)}</span>
            {currentProduct.oldPrice && <span className="old-price">{money(currentProduct.oldPrice)}</span>}
            {discountPercent > 0 && <strong className="discount-badge">-{discountPercent}%</strong>}
          </div>

          <p>{currentProduct.description}</p>

          <dl className="detail-list">
            <div><dt>Category</dt><dd>{currentProduct.category?.name || 'Open catalog'}</dd></div>
            <div><dt>Collection</dt><dd>{currentProduct.collection?.name || 'Open archive'}</dd></div>
            <div><dt>Material</dt><dd>{currentProduct.material || 'Mixed media'}</dd></div>
            <div><dt>Color</dt><dd>{currentProduct.color || 'Black'}</dd></div>
          </dl>

          {hasVariants && (
            <div className="variant-section">
              <div className="variant-section__head">
                <span>Size</span>
                <small>Choose available variant</small>
              </div>
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
                      {label}
                      <small>{variant.stock} left</small>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <p className={`availability-line${isOutOfStock ? ' danger' : ''}`}>
            Availability <span>{isOutOfStock ? 'Out of Stock' : 'In Stock'}</span>
          </p>
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
      </section>

      <section className="product-details-tabs">
        <div className="product-tabs">
          {[
            ['details', 'Details'],
            ['care', 'Material & Care'],
            ['shipping', 'Shipping & Returns'],
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
                <li>Designed by {currentProduct.designer || 'VYBE Studio'}</li>
                <li>Brand: {currentProduct.brand || 'VYBE'}</li>
                <li>Status: {currentProduct.status}</li>
              </ul>
            </>
          )}
          {activeTab === 'care' && (
            <p>{currentProduct.material || 'Mixed media'} should be stored away from direct light and cleaned gently.</p>
          )}
          {activeTab === 'shipping' && (
            <p>Demo checkout creates an order without payment integration. Shipping and returns are represented for diploma preview.</p>
          )}
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="you-may-like">
          <div className="home-section-head">
            <h2>You May Also Like</h2>
            <Link to="/catalog">View All</Link>
          </div>
          <div className="product-grid product-related-grid">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
