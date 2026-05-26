import React from 'react';

export default function SectionFrame({ as: Component = 'section', className = '', children, ...props }) {
  return (
    <Component className={`section-frame corner-frame ${className}`.trim()} {...props}>
      {children}
    </Component>
  );
}
