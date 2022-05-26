const twColors = require('tailwindcss/colors')
const plugin = require('tailwindcss/plugin')
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './views/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  darkMode: 'class',
  theme: {
    colors: {
      currentColor: 'currentColor',
      gray: twColors.gray,
      green: twColors.green,
      red: twColors.red,
      white: 'hsl(0, 0%, 100%)',
      black: 'hsl(0, 0%, 0%)',
      violet: {
        25: 'hsl(261, 84%, 97%)',
        50: 'hsl(261, 84%, 92%)',
        100: 'hsl(261, 84%, 87%)',
        150: 'hsl(261, 84%, 80%)',
        200: 'hsl(261, 84%, 77%)',
        250: 'hsl(261, 84%, 77%)',
        300: 'hsl(261, 84%, 67%)',
        350: 'hsl(261, 84%, 60%)',
        400: 'hsl(261, 84%, 55%)',
        450: 'hsl(261, 84%, 50%)',
        500: 'hsl(261, 84%, 44%)',
        600: 'hsl(261, 84%, 37%)',
        650: 'hsl(261, 84%, 32%)',
        700: 'hsl(261, 84%, 27%)',
        750: 'hsl(261, 84%, 27%)',
        800: 'hsl(261, 84%, 21%)',
        850: 'hsl(261, 84%, 15%)',
        900: 'hsl(261, 84%, 10%)',
        950: 'hsl(261, 84%, 3%)'
      }
    },
    extend: {
      animation: {
        spin: 'spin 600ms linear infinite',
        loading: 'loading 1200ms ease-in-out infinite',
        fadeIn: 'fadeIn 600ms ease forwards',
        fadeOut: 'fadeOut 600ms ease forwards',
        fadeOut: 'fadeOut 600ms ease forwards',
        shake: '1000ms ease shake backwards'
      },
      keyframes: {
        loading: {
          '0%': {
            strokeDasharray: '1, 200',
            strokeDashoffset: '0'
          },
          '50%': {
            strokeDasharray: '90, 200',
            strokeDashoffset: '-35px'
          },
          '100%': {
            strokeDashoffset: '-124px'
          }
        },
        fadeOut: {
          '100%': {
            opacity: 0
          }
        },
        fadeIn: {
          '100%': {
            opacity: 1
          }
        },
        shake: {
          '10%, 90%': {
            transform: 'rotate(-20deg)'
          },
          '20%, 80%': {
            transform: 'rotate(10deg)'
          },
          '30%, 50%, 70%': {
            transform: 'rotate(-20deg)'
          },
          '40%, 60%': {
            transform: 'rotate(10deg)'
          }
        }
      },
      backgroundSize: {
        'w-0/h-0': '0 0',
        'w-0/h-full': '0 100%',
        'w-full/h-0': '100% 0',
        'w-full/h-full': '100% 100%'
      }
    },
    screens: {
      '<sm': { max: '39.999375em' },
      sm: '40em', //640px
      '<md': { max: '47.999375em' },
      md: '48em', //768px
      '<lg': { max: '63.999375em' },
      lg: '64em', //1024px'
      '<xl': { max: '79.999375em' },
      xl: '80em', //1280px
      '<2xl': { max: '95,999375em' },
      '2xl': '96em' //1536px
    }
  },
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant('hocus', ['&:hover', '&:focus-visible'])
      addVariant('em', ({ container }) => {
        container.walkRules(rule => {
          rule.selector = `.em\\:${rule.selector.slice(1)}`
          rule.walkDecls(decl => {
            decl.value = decl.value.replace('rem', 'em')
          })
        })
      })
    })
  ]
}
