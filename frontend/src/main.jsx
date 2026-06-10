import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/App.jsx';
import './styles/variables.css';
import './styles/animations.css';
import './styles/index.css';
import './styles/admin.css';
import './styles/reference-polish.css';
import './components/product/ProductCard.css';
import './styles/layout-stability.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
