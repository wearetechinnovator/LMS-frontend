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

// Self-executing fallback for global appearance initialization
(() => {
  try {
    let accent = '';
    let textSize = '';
    let mode = '';
    
    try {
      const username = localStorage.getItem('username') || '';
      accent = (username && localStorage.getItem(`theme-accent-${username}`)) || localStorage.getItem('theme-accent') || '';
      textSize = (username && localStorage.getItem(`theme-text-size-${username}`)) || localStorage.getItem('theme-text-size') || '';
      mode = (username && localStorage.getItem(`theme-mode-${username}`)) || localStorage.getItem('theme-mode') || '';
    } catch(e) {
      // Ignore errors when reading local storage in restricted environments
    }

    if (!accent || !textSize || !mode) {
      const cookies = document.cookie.split('; ').reduce((acc, c) => {
        const [k, v] = c.split('=')
        if (k) acc[k.trim()] = decodeURIComponent(v || '')
        return acc
      }, {})
      accent = accent || cookies['theme-accent'] || '#004ac6';
      textSize = textSize || cookies['theme-text-size'] || '14px';
      mode = mode || cookies['theme-mode'] || 'light';
    }

    document.documentElement.style.setProperty('--color-primary', accent);
    document.documentElement.style.setProperty('--color-primary-fixed', `${accent}20`);

    const sizeNum = parseInt(textSize);
    document.documentElement.style.setProperty('--text-body-md', `${sizeNum}px`);
    document.documentElement.style.setProperty('--text-body-sm', `${sizeNum - 2}px`);
    document.documentElement.style.setProperty('--text-headline-md', `${sizeNum + 2}px`);
    document.documentElement.style.setProperty('--text-headline-lg', `${sizeNum + 6}px`);

    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {
    console.error("Failed to initialize appearance settings:", e);
  }
})();

// Intercept global fetch calls to broadcast 401 Unauthorized / expired token events
(() => {
  const originalFetch = window.fetch;
  window.fetch = async (...args) => {
    try {
      const response = await originalFetch(...args);
      if (response.status === 401) {
        window.dispatchEvent(new CustomEvent('lms-unauthorized'));
      }
      return response;
    } catch (error) {
      return Promise.reject(error);
    }
  };
})();

import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)

