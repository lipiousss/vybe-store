import React from 'react';

export default function EmptyState({
  label = 'Empty',
  title = 'Nothing found',
  message = 'Try changing filters or return later.',
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
