import React from 'react';

export default function ErrorState({ title = 'Что-то пошло не так', message, action }) {
  return (
    <div className="ui-state ui-state--error" role="alert">
      <span className="section-label">Ошибка</span>
      <h2>{title}</h2>
      {message && <p>{message}</p>}
      {action}
    </div>
  );
}
