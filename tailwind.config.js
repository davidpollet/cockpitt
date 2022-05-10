const twColors = require('tailwindcss/colors')
const plugin = require('tailwindcss/plugin')
const appTheme = require('./utils/consts/theme')
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './views/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  darkMode: 'class',
  theme: {
    colors: {
      gray: twColors.gray,
      green: twColors.green,
      violet: appTheme.colors.violet,
      red: twColors.red,
      white: 'hsl(0, 0%, 100%)',
      black: 'hsl(0, 0%, 0%)',
      rose: {
        '50': '#ffeff3',
        '100': '#ffe0ea',
        '200': '#ffc6da',
        '300': '#ff97bb',
        '400': '#ff5d99',
        '500': '#ff247b',
        '600': '#ff006f',
        '700': '#d7005d',
        '800': '#b40057',
        '900': '#990251'
      }
    },
    extend: {
      animation: {
        spin: 'spin 600ms linear infinite'
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
