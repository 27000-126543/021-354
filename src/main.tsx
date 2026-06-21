import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { RectificationProvider } from './context/RectificationContext';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RectificationProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </RectificationProvider>
  </React.StrictMode>,
);
