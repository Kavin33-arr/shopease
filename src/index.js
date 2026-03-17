import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
window.__leadEventQueue__ = [];
window.addEventListener("handleleadcreation", (e) => {
  window.__leadEventQueue__.push(e.detail);
});
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
