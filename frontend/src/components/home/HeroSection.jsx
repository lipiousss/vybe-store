import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function HeroSection({ image }) {
  const heroImage = image || '/images/placeholders/product-placeholder.png';

  return (
    <section className="home-hero home-storefront" style={{ '--home-hero-image': `url("${heroImage}")` }}>
      <div className="home-hero__backdrop" />

      <motion.div
        className="home-hero__content"
        initial={{ opacity: 0, y: 22, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.72, ease: 'easeOut' }}
      >
        <p className="section-label">WEAR THE SHADOW. COMMAND THE SILENCE.</p>
        <h1>ENTER THE REALM OF VYBE</h1>
        <span className="home-hero__rule" />
        <p>
          Dark-fantasy fashion and designer pieces for those who walk beyond the light.
        </p>
        <Link className="home-hero__button" to="/catalog">
          EXPLORE THE COLLECTION {'\u2192'}
        </Link>
      </motion.div>

      <motion.div
        className="home-hero__visual"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.82, delay: 0.08, ease: 'easeOut' }}
      >
        <img src={heroImage} alt="VYBE dark fantasy storefront" />
      </motion.div>
    </section>
  );
}
