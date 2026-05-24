import React from 'react';
import { motion } from 'framer-motion';
import { useArtworkStore } from '../../store/artworkStore.js';

export default function ArtworkCard({ artwork, index, className = '' }) {
  const openArtworkModal = useArtworkStore((state) => state.openArtworkModal);
  const artworkNumber = String(index + 1).padStart(2, '0');
  const tags = Array.isArray(artwork.tags) ? artwork.tags : [];

  return (
    <motion.article
      className={`artwork-card artwork-tile ${className}`}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onClick={() => openArtworkModal(artwork)}
    >
      <button type="button" className="artwork-card__button" aria-label={`View ${artwork.title}`}>
        <span className="artwork-card__number">ARTWORK {artworkNumber}</span>
        <span className="artwork-card__image">
          <img src={artwork.image} alt={artwork.title} />
          <span className="artwork-card__overlay">View Artwork</span>
        </span>
        <span className="artwork-card__body">
          <span className="artwork-card__category">{artwork.category || 'Archive'}</span>
          <strong>{artwork.title}</strong>
          {artwork.description && <span>{artwork.description}</span>}
          {tags.length > 0 && (
            <span className="artwork-card__tags">
              {tags.slice(0, 3).map((tag) => (
                <small key={tag}>{tag}</small>
              ))}
            </span>
          )}
        </span>
      </button>
    </motion.article>
  );
}
