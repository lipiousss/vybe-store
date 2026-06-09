import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <main className="not-found-page">
      <section className="not-found-card fantasy-card">
        <p className="section-label">Неизвестный маршрут</p>
        <h1>404 — Потеряно в ночи</h1>
        <p>
          Этот путь ведёт за пределы архива VYBE. Вернитесь на главную и продолжите путешествие оттуда.
        </p>
        <Link className="relic-button" to="/">На главную</Link>
      </section>
    </main>
  );
}
