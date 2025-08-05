const zIndexScale = Array.from({ length: 21 }, (_, i) => i * 5).reduce(
    (acc, value) => {
        acc[value] = value;
        return acc;
    },
    {}
);

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        fontFamily: {
            sans: ['"EB Garamond"', "serif"],
        },
        extend: {
            zIndex: { ...zIndexScale },
        },
    },
    plugins: [require("tailwind-scrollbar")],
};
