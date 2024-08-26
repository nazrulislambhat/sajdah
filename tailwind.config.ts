// import type { Config } from 'tailwindcss';
// const { nextui } = require('@nextui-org/react');

// const config: Config = {
//   content: [
//     './pages/**/*.{js,ts,jsx,tsx,mdx}',
//     './components/**/*.{js,ts,jsx,tsx,mdx}',
//     './app/**/*.{js,ts,jsx,tsx,mdx}',
//     './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
//   ],
//   theme: {
//     extend: {
//       colors: {
//         PrimarySalahSync: '#3423A6',
//         SecondarySalahSync: '#8CD867',
//         LightSalahSync: '#EBF2FA',
//         WhiteSalahSync: '#f7fff6',
//         TertiarySalahSync: '#171717',
//         RedSalahSync: '#f46036',
//         YellowSalahSync: '#F5DD90',
//         OrangeSalahSync: '#F68E5F',
//       },
//     },
//   },
//   darkMode: 'class',
//   plugins: [nextui()],
// };
// export default config;
import type { Config } from 'tailwindcss';
const { nextui } = require('@nextui-org/react');
const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');
const {
  default: flattenColorPalette,
} = require('tailwindcss/lib/util/flattenColorPalette');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        PrimarySalahSync: '#3423A6',
        SecondarySalahSync: '#8CD867',
        LightSalahSync: '#EBF2FA',
        WhiteSalahSync: '#f7fff6',
        TertiarySalahSync: '#171717',
        RedSalahSync: '#f46036',
        YellowSalahSync: '#F5DD90',
        OrangeSalahSync: '#F68E5F',
      },
    },
  },
  plugins: [
    // rest of the code
    [nextui()],
    addVariablesForColors,
  ],
};

// This plugin adds each Tailwind color as a global CSS variable, e.g. var(--gray-200).
function addVariablesForColors({ addBase, theme }: any) {
  let allColors = flattenColorPalette(theme('colors'));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ':root': newVars,
  });
}
