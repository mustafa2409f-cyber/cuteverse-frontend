import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Restore saved theme before first paint
const saved = localStorage.getItem('cv_theme') ?? 'pastel';
if (saved !== 'pastel') document.documentElement.setAttribute('data-theme', saved);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
