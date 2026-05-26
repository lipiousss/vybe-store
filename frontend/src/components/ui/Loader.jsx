import React from 'react';

export default function Loader({ text = 'Loading...' }) {
  return (
    <div className="ui-state ui-state--loader" role="status" aria-live="polite">
      <span className="ui-loader-ring" aria-hidden="true" />
      <p>{text}</p>
    </div>
  );
}
