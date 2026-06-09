import React from 'react';

const items = [
  ['Доставка по России', 'Надёжная доставка с отслеживанием', '01'],
  ['Премиальное качество', 'Материалы и сборка для долгого срока', '02'],
  ['Безопасная оплата', 'Demo-mode оформление без платёжной системы', '03'],
  ['Простое оформление заказа', 'Понятный путь от корзины до заказа', '04'],
];

export default function TrustStrip() {
  return (
    <section className="trust-strip" aria-label="Преимущества магазина">
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
