import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useUiStore } from '../../store/uiStore.js';

export default function EnterScreen({ image }) {
  const { isEnterScreenPassed, setEnterScreenPassed } = useUiStore();
  const [isOpening, setIsOpening] = React.useState(false);

  function enter() {
    setIsOpening(true);
    window.setTimeout(setEnterScreenPassed, 720);
  }

  return (
    <AnimatePresence>
      {!isEnterScreenPassed && (
        <motion.section
          className={`ritual-enter${isOpening ? ' is-opening' : ''}`}
          style={{ '--enter-image': `url("${image}")` }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            className="ritual-enter__gate"
            initial={{ opacity: 0, scale: 0.88, filter: 'blur(12px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
          >
            <span className="ritual-enter__ring" />
            <p>NIGHT COLLECTION</p>
            <h1>VYBE</h1>
            <button className="relic-button" type="button" onClick={enter}>
              Enter the Store
            </button>
          </motion.div>
          <span className="ritual-enter__line" />
        </motion.section>
      )}
    </AnimatePresence>
  );
}
