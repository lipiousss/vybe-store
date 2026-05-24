import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/App.jsx';
import './styles/variables.css';
import './styles/animations.css';
import './styles/index.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
