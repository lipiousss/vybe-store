import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSiteAssetStore } from '../../store/siteAssetStore.js';
import { mediaUrl } from '../../utils/mediaUrl.js';

const materials = ['Ткань', 'Металл', 'Камень', 'Свет'];
const timeline = [
  ['01', 'Истоки', 'Каждый дроп начинается как визуальный фрагмент из архива VYBE.'],
  ['02', 'Материалы', 'Материалы выбираются за фактуру, тень и тактильный контраст.'],
  ['03', 'Форма', 'Финальный предмет должен быть полезным, коллекционным и слегка нереальным.'],
  ['04', 'Дроп', 'Готовая вещь выходит как часть единого ночного мира бренда.'],
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
          <p className="section-label">О VYBE</p>
          <h1>Рождённые ночью</h1>
          <p>
            VYBE — это магазин дизайнерской продукции, построенный вокруг атмосферы,
            формы и визуальной силы.
          </p>
          <Link className="relic-button" to="/catalog">Смотреть каталог</Link>
        </motion.div>
        <motion.div
          className="about-hero__image"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.08 }}
        >
          <img src={aboutImage} alt="Визуальный образ проекта VYBE" />
        </motion.div>
      </section>

      <section className="about-mission fantasy-card">
        <p className="section-label">Философия</p>
        <h2>Мы превращаем магазин в архив реликвий.</h2>
        <p>
          Проект объединяет логику интернет-магазина и кинематографичную айдентику:
          каталог, коллекционные предметы, артворки, профиль, корзина, заказы и админка
          собраны в один цельный мир.
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
            <p>Фактура, контраст и атмосфера, превращённые в реальные предметы магазина.</p>
          </motion.article>
        ))}
      </section>

      <section className="brand-timeline about-story">
        <div className="section-heading">
          <p className="section-label">История</p>
          <h2>От референса до ритуального объекта</h2>
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
        {['Дизайн', 'Культура', 'Тьма'].map((item) => (
          <article className="fantasy-card" key={item}>
            <h3>{item}</h3>
            <div className="gold-divider" />
            <p>Магазин должен быть удобным в использовании и запоминающимся как визуальный опыт.</p>
          </article>
        ))}
      </section>
    </main>
  );
}
