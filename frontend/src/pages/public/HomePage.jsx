import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import EnterScreen from '../../components/home/EnterScreen.jsx';
import HeroSection from '../../components/home/HeroSection.jsx';
import ProductCard from '../../components/product/ProductCard.jsx';
import { useCollectionStore } from '../../store/collectionStore.js';
import { useProductStore } from '../../store/productStore.js';
import { useSiteAssetStore } from '../../store/siteAssetStore.js';
import { mediaUrl } from '../../utils/mediaUrl.js';

const timeline = [
  ['01', 'Origin', 'A darker visual code, born from archive sketches and ritual silhouettes.'],
  ['02', 'Material', 'Textile, resin, steel, glass, and print stock treated as relic surfaces.'],
  ['03', 'Form', 'Functional pieces shaped like artifacts from another world.'],
  ['04', 'Drop', 'Limited releases, seasonal capsules, and collectible fragments.'],
];

function ShowcaseProduct({ product, index }) {
  const image = mediaUrl(product.images?.[0]?.url);

  return (
    <motion.article
      className="showcase-product fantasy-card"
      initial={{ opacity: 0, y: 42 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.62, delay: index * 0.04 }}
    >
      <div className="showcase-product__image">
        <img src={image} alt={product.name} />
      </div>
      <div className="showcase-product__copy">
        <p className="section-label">Artifact {String(index + 1).padStart(2, '0')}</p>
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <strong>{Number(product.finalPrice || product.price).toLocaleString('ru-RU')} ₽</strong>
        <Link className="relic-button" to={`/product/${product.slug}`}>View Item</Link>
      </div>
    </motion.article>
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

  const showcase = featuredProducts.slice(0, 4);

  return (
    <main className="home-page">
      <EnterScreen image={enterImage} />
      <HeroSection image={heroImage} />

      <section className="home-showcase">
        <div className="section-heading">
          <p className="section-label">Featured relics</p>
          <h2>Choose an artifact from the current drop</h2>
        </div>
        {showcase.length === 0 ? (
          <div className="fantasy-card empty-state">
            <h3>No featured relics yet.</h3>
            <p>Mark products as FEATURED in admin to fill this cinematic shelf.</p>
          </div>
        ) : (
          showcase.map((product, index) => (
            <ShowcaseProduct product={product} index={index} key={product.id} />
          ))
        )}
      </section>

      <section className="content-band collection-band">
        <div className="section-heading">
          <p className="section-label">Collections</p>
          <h2>Four doors into the archive</h2>
        </div>
        <div className="collection-grid">
          {collections.map((collection) => (
            <motion.article
              className="collection-tile fantasy-card"
              key={collection.id}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <span>{collection.slug}</span>
              <h3>{collection.name}</h3>
              <p>{collection.description}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="brand-timeline">
        <div className="section-heading">
          <p className="section-label">Brand ritual</p>
          <h2>How the archive takes shape</h2>
        </div>
        <div className="brand-timeline__line">
          {timeline.map(([number, title, text]) => (
            <motion.article
              key={number}
              initial={{ opacity: 0, x: -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.45 }}
              transition={{ duration: 0.44 }}
            >
              <span>{number}</span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="content-band">
        <div className="section-heading">
          <p className="section-label">Compact grid</p>
          <h2>Selected from the current drop</h2>
        </div>
        <div className="product-grid">
          {featuredProducts.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="cta-section fantasy-card">
        <p className="section-label">Archive paths</p>
        <h2>Follow the blue glow deeper into VYBE.</h2>
        <div className="hero-actions">
          <Link className="relic-button" to="/collectibles">Open Collectibles</Link>
          <Link className="ghost-button" to="/artworks">View Artworks</Link>
        </div>
      </section>
    </main>
  );
}
