/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "SF Pro Display", "Segoe UI", "system-ui", "sans-serif"],
      },
      colors: {
        primary: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
        },
        slate: {
          925: "#0b1220"
        },
      },
      boxShadow: {
        soft: "0 20px 70px rgba(15, 23, 42, 0.12)",
        card: "0 12px 40px rgba(15, 23, 42, 0.08)",
      },
      backgroundImage: {
        "subtle-radial": "radial-gradient(circle at 20% 20%, rgba(99,102,241,0.12), transparent 25%), radial-gradient(circle at 80% 0%, rgba(14,165,233,0.12), transparent 25%)",
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: 0.9 },
          '50%': { opacity: 0.6 },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        shine: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 5s ease-in-out infinite',
        'spin-slow': 'spin-slow 18s linear infinite',
        shine: 'shine 2.4s ease-in-out infinite',
      }
    },
  },
  plugins: [],
};

