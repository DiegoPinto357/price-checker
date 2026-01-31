/** @type {import('tailwindcss').Config} */

import { nextui } from '@nextui-org/react';

export default {
  content: [
    'index.html',
    'src/**/*.{jsx,tsx}', // Only scan component files, not all TS files
    '!src/server/**', // Exclude server
    '!src/**/*.test.{ts,tsx}', // Exclude tests
    'node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  darkMode: 'class',
  plugins: [nextui()],
};
