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
        PrimarySalahSync: '#d8f1a0',
        SecondarySalahSync: '#fe5e41',
        GreenSalahSync: '#00a878',
        BlueSalahSync: '#05299e',
        LightSalahSync: '#ede7e3',
        YellowSalahSync: '#faf2a1',
        PastelGreenSalahSync: '#c5ebc3',
        BlackSalahSync: '#151515',
        SkySalahSync: '#c8e0f4',
        WhiteSalahSync: '#f7fff6',
      },
    },
  },
  darkMode: 'class',
  plugins: [nextui()],
};
export default config;
