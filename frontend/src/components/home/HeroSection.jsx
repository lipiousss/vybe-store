import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function HeroSection({ image = '/images/site/home/home-hero-bg.png' }) {
  return (
    <section className="home-hero home-storefront" style={{ '--home-hero-image': `url("${image}")` }}>
      <div className="home-hero__backdrop" />
      <span className="home-hero__gold-line" />
      <span className="home-hero__blue-glow" />

      <motion.div
        className="home-hero__content"
        initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.75, ease: 'easeOut' }}
      >
        <p className="section-label">ДИЗАЙНЕРСКИЙ МАГАЗИН</p>
        <h1>НОСИ ЛЕГЕНДУ</h1>
        <strong>Дизайн. Культура. Тьма.</strong>
        <span className="home-hero__rule" />
        <p>
          Дизайнерская продукция, собранная в единой визуальной системе:
          одежда, аксессуары, декор, периферия и коллекционные предметы.
        </p>
        <div className="home-hero__actions">
          <Link className="home-hero__button" to="/catalog">
            Смотреть каталог
          </Link>
          <Link className="home-hero__button ghost" to="/artworks">
            Открыть артворки
          </Link>
        </div>
      </motion.div>

      <motion.div
        className="home-hero__visual"
        initial={{ opacity: 0, scale: 0.96, x: 20 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ duration: 0.9, delay: 0.1, ease: 'easeOut' }}
      >
        <div className="home-hero__visual-frame">
          <img src={image} alt="Главный визуал VYBE" />
        </div>
      </motion.div>
    </section>
  );
}
