import React from 'react';

const items = [
  ['WORLDWIDE SHIPPING', 'Secure & tracked delivery', '[]'],
  ['PREMIUM QUALITY', 'Crafted to last beyond realms', '<>'],
  ['SECURE CHECKOUT', 'Protected demo checkout', '{}'],
  ['EASY RETURNS', 'Simple return scenario', '()'],
];

export default function TrustStrip() {
  return (
    <section className="trust-strip" aria-label="Store guarantees">
      {items.map(([title, text, icon]) => (
        <article key={title}>
          <span className="trust-strip__icon">{icon}</span>
          <div>
            <strong>{title}</strong>
            <span>{text}</span>
          </div>
        </article>
      ))}
    </section>
  );
}
