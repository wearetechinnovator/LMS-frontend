/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Roboto', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      fontSize: {
        // Custom typography scale for enterprise CRM
        'h1': ['24px', { lineHeight: '1.2', fontWeight: '600', letterSpacing: '-0.5px' }],
        'h2': ['18px', { lineHeight: '1.3', fontWeight: '600', letterSpacing: '-0.25px' }],
        'h3': ['16px', { lineHeight: '1.3', fontWeight: '600' }],
        'h4': ['14px', { lineHeight: '1.4', fontWeight: '600' }],
        'nav': ['14px', { lineHeight: '1.4', fontWeight: '500' }],
        'sidebar': ['13px', { lineHeight: '1.4', fontWeight: '500' }],
        'body': ['13px', { lineHeight: '1.5', fontWeight: '400' }],
        'body-strong': ['13px', { lineHeight: '1.5', fontWeight: '500' }],
        'label': ['13px', { lineHeight: '1.5', fontWeight: '400' }],
        'table-header': ['12px', { lineHeight: '1.4', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }],
        'table-data': ['13px', { lineHeight: '1.5', fontWeight: '400' }],
        'small': ['11px', { lineHeight: '1.4', fontWeight: '500' }],
        'extra-small': ['10px', { lineHeight: '1.3', fontWeight: '500' }],
      },
      colors: {
        // Enterprise color palette
        'text-primary': '#1e293b', // slate-800
        'text-secondary': '#64748b', // slate-500
        'text-tertiary': '#94a3b8', // slate-400
        'bg-primary': '#f8fafc', // slate-50
        'bg-surface': '#ffffff',
        'border-light': '#e2e8f0', // slate-200
      },
    },
  },
  plugins: [],
}

