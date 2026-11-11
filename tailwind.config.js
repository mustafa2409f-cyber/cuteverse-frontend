/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FFF9F3',
        blush: {
          50: '#FFF1F4',
          100: '#FFE3EA',
          200: '#FFC9D6',
          300: '#FFA3B8',
          400: '#FF7BA0',
          500: '#FF5C85',
          600: '#F23D68',
        },
        lav: {
          50: '#F6F3FF',
          100: '#EDE7FF',
          200: '#DDD3FF',
          300: '#C4B0FF',
          400: '#A784FF',
          500: '#8B5CF6',
          600: '#7C3AED',
        },
        sky2: {
          50: '#F0F8FF',
          100: '#E0F1FE',
          200: '#B9E4FE',
          300: '#8DD3FC',
          400: '#63BCF7',
          500: '#3FA9F5',
        },
        mint: {
          50: '#F0FDF7',
          100: '#DCFCE9',
          200: '#BBF7D8',
          300: '#86EFAC',
          400: '#5BD68A',
          500: '#3FCF7A',
        },
        peach: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F59E0B',
        },
      },
      fontFamily: {
        display: ['"Baloo 2"', 'ui-rounded', 'system-ui', 'sans-serif'],
        body: ['"Nunito"', 'ui-rounded', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        soft: '0 10px 40px -12px rgba(255, 92, 133, 0.25)',
        card: '0 8px 30px -10px rgba(139, 92, 246, 0.18)',
        glow: '0 0 40px rgba(255, 123, 160, 0.45)',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0) rotate(-2deg)' },
          '50%': { transform: 'translateY(-18px) rotate(2deg)' },
        },
        drift: {
          '0%': { transform: 'translateX(-10%)' },
          '100%': { transform: 'translateX(110%)' },
        },
        wiggle: {
          '0%,100%': { transform: 'rotate(-4deg)' },
          '50%': { transform: 'rotate(4deg)' },
        },
        pop: {
          '0%': { transform: 'scale(0.6)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        float: 'float 5s ease-in-out infinite',
        drift: 'drift 60s linear infinite',
        wiggle: 'wiggle 2.4s ease-in-out infinite',
        pop: 'pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        shimmer: 'shimmer 2.5s linear infinite',
      },
    },
  },
  plugins: [],
};
