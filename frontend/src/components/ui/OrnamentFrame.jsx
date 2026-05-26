import React from 'react';

export default function OrnamentFrame({ as: Component = 'div', className = '', children, ...props }) {
  return (
    <Component className={`ornament-frame ${className}`.trim()} {...props}>
      {children}
    </Component>
  );
}
