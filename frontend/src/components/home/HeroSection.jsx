import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function HeroSection({ image }) {
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 0.86]);
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 8]);
  const rotateY = useTransform(scrollYProgress, [0, 1], [0, -7]);
  const glowX = useTransform(scrollYProgress, [0, 1], ['15%', '68%']);

  return (
    <section className="home-hero" ref={ref}>
      <motion.div className="home-hero__glow" style={{ left: glowX }} />
      <motion.div
        className="home-hero__copy"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.72, ease: 'easeOut' }}
      >
        <p className="section-label">Dark fantasy designer goods</p>
        <h1>Designer relics for the night-born.</h1>
        <p>
          Clothing, accessories, room objects and visual artifacts shaped in a darker aesthetic.
        </p>
        <div className="hero-actions">
          <Link className="relic-button" to="/catalog">Explore Collection</Link>
          <Link className="ghost-button" to="/artworks">View Artworks</Link>
        </div>
      </motion.div>

      <motion.div
        className="home-hero__artifact"
        style={{ scale: imageScale, y: imageY, rotateX, rotateY }}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.86, delay: 0.1, ease: 'easeOut' }}
      >
        <span className="home-hero__frame" />
        <img src={image} alt="VYBE night relic" />
      </motion.div>
    </section>
  );
}
