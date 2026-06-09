import React from 'react';

export default function EmptyState({
  label = 'Пусто',
  title = 'Ничего не найдено',
  message = 'Попробуйте изменить фильтры или вернуться позже.',
  action,
}) {
  return (
    <div className="ui-state ui-state--empty">
      <span className="section-label">{label}</span>
      <h2>{title}</h2>
      <p>{message}</p>
      {action}
    </div>
  );
}
