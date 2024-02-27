import type { Config } from 'tailwindcss';
const { nextui } = require('@nextui-org/react');

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        PrimarySalahSync: '#3423A6',
        SecondarySalahSync: '#63A375',
        LightSalahSync: '#ede7e3',
        WhiteSalahSync: '#f7fff6',
        TertiarySalahSync: '#171717',
        RedSalahSync: '#D00000',
      },
    },
  },
  darkMode: 'class',
  plugins: [nextui()],
};
export default config;
