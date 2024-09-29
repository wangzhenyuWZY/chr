/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  corePlugins: {
    preflight: false,
  },
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        Pingfang: 'Pingfang',
        Inter: 'Inter',
        Montserrat: 'Montserrat',
      },
      colors: {
        borderGreen: '#09FA96',
        panelBg: '#101313',
        textBlack1: '#151515',
        grayBg: '#F2F2F2',
        textGray1: '#999999',
        textGreen1: '#09FA97',
        panelBg2: '#1D1D1D',
        textYellow: '#FFB900',
        textGray2: '#666666',
        panelBg3: '#0E1110',
        textGreen2: '#069C5F',
        bgYellow: '#FFF803',
        textBlack: '#070808',
        borderBlack: '#272A2A',
        textGray: '#909090',
        textGreen: '#00BE66',
        bgGray: '#F0F0F0',
        textGray3: '#7E7E7E',
        textGray4: '#BEBAB4',
        textGray5: '#868C92',
      },
    },
  },
};
