import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../../components/product/ProductCard.jsx';
import { useCollectionStore } from '../../store/collectionStore.js';
import { useProductStore } from '../../store/productStore.js';
import { useSiteAssetStore } from '../../store/siteAssetStore.js';
import { useUiStore } from '../../store/uiStore.js';
import { mediaUrl } from '../../utils/mediaUrl.js';

const timeline = [
  ['01', 'Origin', 'A darker visual code, born from archive sketches and ritual silhouettes.'],
  ['02', 'Material', 'Textile, resin, steel, glass, and print stock treated as relic surfaces.'],
  ['03', 'Form', 'Functional pieces shaped like artifacts from another world.'],
  ['04', 'Drop', 'Limited releases, seasonal capsules, and collectible fragments.'],
];

function EnterScreen({ image }) {
  const { isEnterScreenPassed, setEnterScreenPassed } = useUiStore();

  return (
    <AnimatePresence>
      {!isEnterScreenPassed && (
        <motion.div
          className="enter-screen"
          style={{ '--enter-image': `url("${image}")` }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.7 }}
        >
          <motion.div
            className="enter-sigil"
            initial={{ opacity: 0, scale: 0.82 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            V
          </motion.div>
          <p className="eyebrow">VYBE archive access</p>
          <h1>Enter the darker store.</h1>
          <button className="gold-button" type="button" onClick={setEnterScreenPassed}>
            Enter the Store
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function HomePage() {
  const { featuredProducts, fetchFeaturedProducts } = useProductStore();
  const { collections, fetchCollections } = useCollectionStore();
  const { fetchAssets, getAsset } = useSiteAssetStore();
  const enterImage = mediaUrl(getAsset('enter_screen_image')?.url);
  const heroImage = mediaUrl(getAsset('home_hero_image')?.url);

  React.useEffect(() => {
    fetchFeaturedProducts();
    fetchCollections();
    fetchAssets().catch(() => {});
  }, [fetchFeaturedProducts, fetchCollections, fetchAssets]);

  return (
    <main>
      <EnterScreen image={enterImage} />

      <section className="hero-section">
        <motion.div
          className="hero-copy"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="eyebrow">Dark fantasy designer goods</p>
          <h1>Objects for the night side of style.</h1>
          <p>
            VYBE Store collects apparel, accessories, decor, peripherals, and limited relics
            into one cinematic archive.
          </p>
          <div className="hero-actions">
            <Link className="gold-button" to="/catalog">Explore Catalog</Link>
            <Link className="ghost-button" to="/collectibles">Open Archive</Link>
          </div>
        </motion.div>

        <motion.div
          className="hero-media"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <img src={heroImage} alt="VYBE artifact preview" />
        </motion.div>
      </section>

      <section className="content-band">
        <div className="section-heading">
          <p className="eyebrow">Featured relics</p>
          <h2>Selected from the current drop</h2>
        </div>
        <div className="product-grid">
          {featuredProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="content-band collection-band">
        <div className="section-heading">
          <p className="eyebrow">Collections</p>
          <h2>Four doors into the archive</h2>
        </div>
        <div className="collection-grid">
          {collections.map((collection) => (
            <article className="collection-tile" key={collection.id}>
              <span>{collection.slug}</span>
              <h3>{collection.name}</h3>
              <p>{collection.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="timeline-section">
        {timeline.map(([number, title, text]) => (
          <article key={number}>
            <span>{number}</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </section>

      <section className="cta-section">
        <p className="eyebrow">Next drop signal</p>
        <h2>Follow the blue glow through the catalog.</h2>
        <Link className="gold-button" to="/catalog">View the Drop</Link>
      </section>
    </main>
  );
}
