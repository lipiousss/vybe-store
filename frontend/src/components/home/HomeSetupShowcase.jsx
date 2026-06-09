import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const scenes = [
  {
    number: '01',
    title: 'Рабочее место',
    text: 'Графитовая база, приглушённый свет и предметы, которые задают ритм.',
    image: '/images/site/setup/setup-scene-1.png',
  },
  {
    number: '02',
    title: 'Периферия',
    text: 'Коврики, клавиатуры и детали, собранные в единую визуальную систему.',
    image: '/images/site/setup/setup-scene-2.png',
  },
  {
    number: '03',
    title: 'Атмосфера',
    text: 'Декор и коллекционные элементы превращают пространство в личный архив.',
    image: '/images/site/setup/setup-scene-3.png',
  },
];

export default function HomeSetupShowcase() {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const activeScene = scenes[activeIndex];

  return (
    <section className="home-setup-showcase">
      <div className="home-section-head">
        <div>
          <p className="section-label">Сцена VYBE</p>
          <h2>Собери атмосферу</h2>
        </div>
        <p>Три слоя визуального пространства: рабочее место, периферия и настроение.</p>
      </div>

      <div className="home-setup-showcase__grid">
        <div className="home-setup-steps">
          {scenes.map((scene, index) => (
            <button
              className={index === activeIndex ? 'is-active' : ''}
              type="button"
              key={scene.title}
              onMouseEnter={() => setActiveIndex(index)}
              onFocus={() => setActiveIndex(index)}
              onClick={() => setActiveIndex(index)}
            >
              <span>{scene.number}</span>
              <strong>{scene.title}</strong>
              <small>{scene.text}</small>
            </button>
          ))}
        </div>

        <div className="home-setup-visual">
          <AnimatePresence mode="wait">
            <motion.img
              key={activeScene.image}
              src={activeScene.image}
              alt={activeScene.title}
              initial={{ opacity: 0, x: 18, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -18, scale: 0.98 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
            />
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
