/** @type {import('tailwindcss').Config} */
import flowbitePlugin from 'flowbite/plugin';
export const content = [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    './node_modules/flowbite-react/**/*.{js,ts,jsx,tsx}',
    
];
export const theme = {
    extend: {},
};
// export const plugins = [
//     require('flowbite/plugin')
// ];

export const plugins = [
    flowbitePlugin
];