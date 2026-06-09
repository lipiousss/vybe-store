import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useArtworkStore } from '../../store/artworkStore.js';
import { mediaUrl } from '../../utils/mediaUrl.js';

export default function ArtworkModal() {
  const selectedArtwork = useArtworkStore((state) => state.selectedArtwork);
  const isModalOpen = useArtworkStore((state) => state.isModalOpen);
  const closeArtworkModal = useArtworkStore((state) => state.closeArtworkModal);
  const tags = Array.isArray(selectedArtwork?.tags) ? selectedArtwork.tags : [];

  useEffect(() => {
    if (!isModalOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeArtworkModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [closeArtworkModal, isModalOpen]);

  return (
    <AnimatePresence>
      {isModalOpen && selectedArtwork && (
        <motion.div
          className="artwork-modal"
          role="dialog"
          aria-modal="true"
          aria-label={selectedArtwork.title}
          initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          animate={{ opacity: 1, backdropFilter: 'blur(8px)' }}
          exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          onClick={closeArtworkModal}
        >
          <motion.div
            className="artwork-modal__content"
            initial={{ opacity: 0, scale: 0.94, filter: 'blur(8px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.94, filter: 'blur(8px)' }}
            transition={{ duration: 0.22 }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="artwork-modal__close"
              onClick={closeArtworkModal}
              aria-label="Закрыть окно артворка"
            >
              Закрыть
            </button>
            <div className="artwork-modal__image">
              <img src={mediaUrl(selectedArtwork.image, '/images/placeholders/artwork-placeholder.png')} alt={selectedArtwork.title} />
            </div>
            <div className="artwork-modal__info">
              <p className="eyebrow">{selectedArtwork.category || 'Архив'}</p>
              <h2>{selectedArtwork.title}</h2>
              {selectedArtwork.description && <p>{selectedArtwork.description}</p>}
              {tags.length > 0 && (
                <div className="artwork-modal__tags">
                  {tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
