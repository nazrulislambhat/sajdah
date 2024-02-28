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
        SecondarySalahSync: '#8CD867',
        LightSalahSync: '#EBF2FA',
        WhiteSalahSync: '#f7fff6',
        TertiarySalahSync: '#171717',
        RedSalahSync: '#D00000',
        YellowSlahSync: '#F5DD90',
        OrangeSalahSync: '#F68E5F',
      },
    },
  },
  darkMode: 'class',
  plugins: [nextui()],
};
export default config;
