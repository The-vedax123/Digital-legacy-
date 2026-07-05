/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Primary = deep forest green (the "legacy" accent)
        brand: {
          DEFAULT: '#41573F',
          50: '#f3f6f1',
          100: '#e4ede1',
          200: '#c8d8c2',
          300: '#a5bf9c',
          400: '#7fa073',
          500: '#5e7f53',
          600: '#41573F',
          700: '#354732',
          800: '#2b3929',
          900: '#212d20',
        },
        // Soft, muted pastels for stat/icon badges
        sage: '#6f8f68',
        lav: '#9887c0',
        sand: '#c1a15a',
        sky: '#7f9fbe',
        clay: '#b0895f',
        gold: '#c2a15b',
        // Muted status colors that fit the warm palette
        success: '#5c8a54',
        warning: '#c79a45',
        danger: '#c05b4d',
        // Surfaces
        canvas: '#f4f1e9',
        surface: '#ffffff',
        ink: '#191d14',
        bark: '#2e3d2a',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'Cambria', '"Times New Roman"', 'serif'],
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      boxShadow: {
        soft: '0 4px 24px rgba(52, 45, 28, 0.06)',
        glass: '0 4px 24px rgba(52, 45, 28, 0.06)',
        glow: '0 12px 34px rgba(65, 87, 63, 0.18)',
        'glow-violet': '0 12px 34px rgba(65, 87, 63, 0.18)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #4a6244 0%, #374b30 100%)',
        'brand-radial': 'radial-gradient(1100px 560px at 50% -12%, rgba(110,139,106,0.22), transparent 62%)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
      animation: {
        float: 'float 8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
