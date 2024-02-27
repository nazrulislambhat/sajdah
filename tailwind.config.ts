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
        SecondarySalahSync: '#171717',
        LightSalahSync: '#ede7e3',
        WhiteSalahSync: '#f7fff6',
        GreenSalahSync: '#63A375',
        RedSalahSync: '#D57A66',
      },
    },
  },
  darkMode: 'class',
  plugins: [nextui()],
};
export default config;
