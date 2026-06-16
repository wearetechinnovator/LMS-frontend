import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

// Self-executing fallback for localStorage in sandbox/iframe environments
(() => {
  try {
    const test = '__storage_test__';
    window.localStorage.setItem(test, test);
    window.localStorage.removeItem(test);
  } catch (e) {
    console.warn("Storage access is restricted. Providing memory-based localStorage fallback.", e);
    const mockStore = {};
    const mockStorage = {
      getItem: (key) => (key in mockStore ? mockStore[key] : null),
      setItem: (key, val) => { mockStore[key] = String(val); },
      removeItem: (key) => { delete mockStore[key]; },
      clear: () => { for (const k in mockStore) delete mockStore[k]; },
      key: (i) => Object.keys(mockStore)[i] || null,
      get length() { return Object.keys(mockStore).length; }
    };
    try {
      Object.defineProperty(window, 'localStorage', {
        value: mockStorage,
        writable: true,
        configurable: true
      });
    } catch (err) {
      try {
        Object.defineProperty(Window.prototype, 'localStorage', {
          value: mockStorage,
          configurable: true,
          enumerable: true
        });
      } catch (err2) {
        console.error("Failed to mock localStorage", err2);
      }
    }
  }
})();

import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)

