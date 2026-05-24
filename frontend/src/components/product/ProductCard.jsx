import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function money(value) {
  if (value === null || value === undefined) {
    return '';
  }

  return `$${Number(value).toFixed(2)}`;
}

export default function ProductCard({ product }) {
  const image = product.images?.[0]?.url || '/images/placeholders/product-placeholder.png';
  const hasDiscount = product.oldPrice && Number(product.oldPrice) > Number(product.finalPrice);

  return (
    <motion.article
      className="product-card"
      whileHover={{ y: -6 }}
      transition={{ duration: 0.22 }}
    >
      <Link className="product-card-link" to={`/product/${product.slug}`}>
        <div className="product-image-wrap">
          <img src={image} alt={product.images?.[0]?.alt || product.name} />
          <div className="product-card-overlay">
            <span className="view-item">View Item</span>
          </div>
        </div>

        <div className="product-card-body">
          <div className="badge-row">
            {product.isNew && <span className="badge">NEW</span>}
            {product.isLimited && <span className="badge blue">LIMITED</span>}
            {product.isFeatured && <span className="badge gold">FEATURED</span>}
          </div>

          <p className="product-category">{product.category?.name || 'VYBE'}</p>
          <h3>{product.name}</h3>

          <div className="price-row">
            {hasDiscount && <span className="old-price">{money(product.oldPrice)}</span>}
            <span className="final-price">{money(product.finalPrice || product.price)}</span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
