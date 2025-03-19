import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            keyframes: {
                "fade-in": {
                    "0%": { opacity: 0 },
                    "100%": { opacity: 1 }
                },
                "fade-out": {
                    "0%": { opacity: 1 },
                    "100%": { opacity: 0 }
                },
                "slide-in-from-top": {
                    "0%": { transform: "translateY(-100%)" },
                    "100%": { transform: "translateY(0)" }
                }
            },
            animation: {
                "fade-in": "fade-in 200ms ease-in-out",
                "fade-out": "fade-out 200ms ease-in-out",
                "slide-in-from-top": "slide-in-from-top 200ms ease-in-out",
            }
        },
    },

    plugins: [forms],
};
