import React from 'react';

export default function Atmosphere({ subtle = false }) {
  const particles = React.useMemo(() => Array.from({ length: subtle ? 10 : 18 }, (_, index) => index), [subtle]);

  return (
    <div className={`atmosphere${subtle ? ' is-subtle' : ''}`} aria-hidden="true">
      <div className="atmosphere__glow atmosphere__glow--blue" />
      <div className="atmosphere__glow atmosphere__glow--gold" />
      <div className="atmosphere__fog atmosphere__fog--one" />
      <div className="atmosphere__fog atmosphere__fog--two" />
      <div className="atmosphere__ash">
        {particles.map((particle) => (
          <span key={particle} style={{ '--i': particle }} />
        ))}
      </div>
      <div className="atmosphere__noise" />
    </div>
  );
}
