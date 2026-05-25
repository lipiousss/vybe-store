import React from 'react';
import { motion } from 'framer-motion';

export default function PageTransition({ children, className = '' }) {
  return (
    <motion.div
      className={`page-transition-shell ${className}`.trim()}
      initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
      transition={{ duration: 0.34, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
