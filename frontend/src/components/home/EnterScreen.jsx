import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useUiStore } from '../../store/uiStore.js';

export default function EnterScreen({ image = '/images/site/enter/enter-screen-bg.png' }) {
  const { isEnterScreenPassed, setEnterScreenPassed } = useUiStore();
  const [isOpening, setIsOpening] = React.useState(false);

  function enter() {
    setIsOpening(true);
    window.setTimeout(setEnterScreenPassed, 760);
  }

  return (
    <AnimatePresence>
      {!isEnterScreenPassed && (
        <motion.section
          className={`ritual-enter${isOpening ? ' is-opening' : ''}`}
          style={{ '--enter-image': `url("${image}")` }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="ritual-enter__veil" />
          <motion.div
            className="ritual-enter__gate"
            initial={{ opacity: 0, scale: 0.92, filter: 'blur(14px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
          >
            <span className="ritual-enter__ring" />
            <p>НОЧНАЯ КОЛЛЕКЦИЯ</p>
            <h1>VYBE</h1>
            <button className="relic-button" type="button" onClick={enter}>
              Войти в магазин
            </button>
          </motion.div>
          <span className="ritual-enter__line" />
          <span className="ritual-enter__flash" />
        </motion.section>
      )}
    </AnimatePresence>
  );
}
