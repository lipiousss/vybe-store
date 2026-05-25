import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSiteAssetStore } from '../../store/siteAssetStore.js';
import { mediaUrl } from '../../utils/mediaUrl.js';

const materials = ['Fabric', 'Metal', 'Stone', 'Light'];
const timeline = [
  ['01', 'Sketch', 'Every drop starts as a visual fragment from the VYBE archive.'],
  ['02', 'Surface', 'Materials are selected for texture, shadow, and tactile contrast.'],
  ['03', 'Object', 'The final piece must feel useful, collectible, and slightly unreal.'],
];

export default function AboutPage() {
  const { fetchAssets, getAsset } = useSiteAssetStore();
  const aboutImage = mediaUrl(getAsset('about_main_image')?.url);

  React.useEffect(() => {
    fetchAssets().catch(() => {});
  }, [fetchAssets]);

  return (
    <main className="page-shell about-page">
      <section className="about-hero">
        <motion.div
          className="about-hero__copy"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.62 }}
        >
          <p className="section-label">About VYBE</p>
          <h1>Born from the Night</h1>
          <p>
            VYBE is a diploma storefront about designer products that feel like fragments of a
            dark visual world: wearable pieces, room objects, collectibles, and archive imagery.
          </p>
          <Link className="relic-button" to="/catalog">Explore the Collection</Link>
        </motion.div>
        <motion.div
          className="about-hero__image"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.08 }}
        >
          <img src={aboutImage} alt="VYBE project visual" />
        </motion.div>
      </section>

      <section className="about-mission fantasy-card">
        <p className="section-label">Mission</p>
        <h2>We turn product pages into an archive of relics.</h2>
        <p>
          The project combines commerce logic with a cinematic identity: catalog, collectibles,
          artworks, user profile, cart, orders, and admin tools are built as one coherent world.
        </p>
      </section>

      <section className="about-materials">
        {materials.map((material) => (
          <motion.article
            className="fantasy-card"
            key={material}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
          >
            <span>{material}</span>
            <p>Texture, contrast, and atmosphere translated into usable store objects.</p>
          </motion.article>
        ))}
      </section>

      <section className="brand-timeline about-story">
        <div className="section-heading">
          <p className="section-label">Storyline</p>
          <h2>From reference to ritual object</h2>
        </div>
        <div className="brand-timeline__line">
          {timeline.map(([number, title, text]) => (
            <article key={number}>
              <span>{number}</span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="about-triad">
        {['We Design', 'We Craft', 'We Collect'].map((item) => (
          <article className="fantasy-card" key={item}>
            <h3>{item}</h3>
            <div className="gold-divider" />
            <p>Building a store that feels practical to use and memorable to explore.</p>
          </article>
        ))}
      </section>
    </main>
  );
}
