import React from 'react';

export default function BlueGlow({ className = '' }) {
  return <span className={`blue-glow ${className}`.trim()} aria-hidden="true" />;
}
