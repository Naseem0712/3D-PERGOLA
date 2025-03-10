/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        'gradient': 'gradient 8s linear infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        }
      },
      colors: {
        'cosmic': {
          900: '#0a0a0f',
          800: '#1a1a2f',
          700: '#2a2a4f'
        }
      },
      spacing: {
        '128': '32rem',
      },
      backdropBlur: {
        'xs': '2px',
      },
      transitionDuration: {
        '400': '400ms',
      },
      scale: {
        '98': '0.98',
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwindcss/plugin')(({ addBase }) => {
      addBase({
        'html': { height: '100%' },
        'body': {
          height: '100%',
          margin: 0,
          backgroundColor: '#111827',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale'
        },
        '#root': { height: '100%' }
      })
    })
  ],
  future: {
    hoverOnlyWhenSupported: true,
  }
}

