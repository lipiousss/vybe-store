import React from 'react';

export default function ErrorState({ title = 'Something went wrong', message, action }) {
  return (
    <div className="ui-state ui-state--error" role="alert">
      <span className="section-label">Error</span>
      <h2>{title}</h2>
      {message && <p>{message}</p>}
      {action}
    </div>
  );
}
