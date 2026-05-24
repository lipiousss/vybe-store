import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProductStore } from '../../store/productStore.js';

function money(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

export default function ProductPage() {
  const { slug } = useParams();
  const { currentProduct, isLoading, error, fetchProductBySlug } = useProductStore();

  React.useEffect(() => {
    fetchProductBySlug(slug);
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

  const image = currentProduct.images?.[0]?.url || '/images/placeholders/product-placeholder.png';

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

        <div className="variant-row">
          {currentProduct.variants?.map((variant) => (
            <span key={variant.id}>{variant.size || variant.color} · {variant.stock} left</span>
          ))}
        </div>

        <button className="gold-button" type="button">Add to Cart</button>
      </section>
    </main>
  );
}
