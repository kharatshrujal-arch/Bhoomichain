/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'surface':               '#f8f9fa',
        'surface-lowest':        '#ffffff',
        'surface-low':           '#f3f4f5',
        'surface-container':     '#edeeef',
        'surface-high':          '#e7e8e9',
        'surface-highest':       '#e1e3e4',
        'on-surface':            '#191c1d',
        'on-surface-variant':    '#414844',
        'outline':               '#717973',
        'outline-variant':       '#c1c8c2',
        // Deep Green — land, trust, institutional
        'primary':               '#012d1d',
        'on-primary':            '#ffffff',
        'primary-container':     '#1b4332',
        'on-primary-container':  '#86af99',
        'primary-fixed':         '#c1ecd4',
        'primary-fixed-dim':     '#a5d0b9',
        'inverse-primary':       '#a5d0b9',
        // Earth Brown — grounding, secondary
        'secondary':             '#6e5a4e',
        'on-secondary':          '#ffffff',
        'secondary-container':   '#f6dacb',
        'on-secondary-container':'#735e52',
        // Tech Blue — blockchain layer, on-chain actions
        'tertiary':              '#002842',
        'on-tertiary':           '#ffffff',
        'tertiary-container':    '#003f63',
        'on-tertiary-container': '#59adef',
        'tertiary-fixed':        '#cde5ff',
        'tertiary-fixed-dim':    '#94ccff',
        // Error
        'error':                 '#ba1a1a',
        'on-error':              '#ffffff',
        'error-container':       '#ffdad6',
        'on-error-container':    '#93000a',
      },
      fontFamily: {
        'sans':  ['Public Sans', 'sans-serif'],
        'label': ['Inter', 'sans-serif'],
        'mono':  ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'display':     ['48px', { lineHeight: '56px', fontWeight: '700', letterSpacing: '-0.02em' }],
        'headline':    ['32px', { lineHeight: '40px', fontWeight: '600' }],
        'headline-sm': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'title':       ['20px', { lineHeight: '28px', fontWeight: '600' }],
        'body-lg':     ['18px', { lineHeight: '28px', fontWeight: '400' }],
        'body':        ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'label':       ['14px', { lineHeight: '20px', fontWeight: '500', letterSpacing: '0.01em' }],
        'label-sm':    ['12px', { lineHeight: '16px', fontWeight: '600' }],
      },
      borderRadius: {
        'DEFAULT': '0.25rem',
        'lg':      '0.5rem',
        'xl':      '0.75rem',
        'full':    '9999px',
      },
      boxShadow: {
        'card': '0px 4px 20px rgba(27, 67, 50, 0.08)',
      },
    }
  },
  plugins: [],
}
