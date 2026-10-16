import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { registrarServiceWorker } from './utils/registrarSW';

import './styles/global.css';
import './styles/mascote.css';
import './styles/login.css';
import './styles/tutorial.css';

const root = document.getElementById('root');
if (!root) {
  throw new Error(
    'Elemento #root não encontrado no index.html. ' +
    'Verifique se o shell do Vite está correto.'
  );
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Registra o service worker (só em produção)
registrarServiceWorker();