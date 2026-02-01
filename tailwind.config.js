/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                casino: {
                    gold: '#FFD700',
                    dark: '#0F172A', // Slate 900
                    green: '#14532D', // Green 900
                    red: '#7F1D1D', // Red 900
                }
            }
        },
    },
    plugins: [],
}
