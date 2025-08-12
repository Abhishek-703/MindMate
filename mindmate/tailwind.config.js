/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Lora', 'serif'],
      },
      keyframes: {
        bounce: {
          '0%, 100%': { transform: 'translateY(-25%)', animationTimingFunction: 'cubic-bezier(0.8,0,1,1)' },
          '50%': { transform: 'none', animationTimingFunction: 'cubic-bezier(0,0,0.2,1)' },
        },
        slideInFromTop: {
          from: { transform: 'translateY(-100%)', opacity: 0 },
          to: { transform: 'translateY(0)', opacity: 1 },
        },
        slideOutToTop: {
          from: { transform: 'translateY(0)', opacity: 1 },
          to: { transform: 'translateY(-100%)', opacity: 0 },
        },
        'breathe-in': {
          '0%': { transform: 'scale(1)', opacity: 0.7 },
          '100%': { transform: 'scale(1.2)', opacity: 1 },
        },
        'breathe-out': {
          '0%': { transform: 'scale(1.2)', opacity: 1 },
          '100%': { transform: 'scale(1)', opacity: 0.7 },
        },
        'letter-appear': {
          from: { opacity: 0, transform: 'scale(0.8) rotate(-8deg) translateY(20px)' },
          to: { opacity: 1, transform: 'scale(1) rotate(0deg) translateY(0)' },
        },
        fadeInUp: {
          from: { opacity: 0, transform: 'translateY(20px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        bob: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        chatSlideInRight: {
          from: { opacity: 0, transform: 'translateX(20px) scale(0.95)' },
          to: { opacity: 1, transform: 'translateX(0) scale(1)' },
        },
        chatSlideInLeft: {
          from: { opacity: 0, transform: 'translateX(-20px) scale(0.95)' },
          to: { opacity: 1, transform: 'translateX(0) scale(1)' },
        },
        scaleDownSlightly: {
          from: { transform: 'scale(1)', filter: 'brightness(1)', borderRadius: '24px' },
          to: { transform: 'scale(0.95) translateY(10px)', filter: 'brightness(0.85)', borderRadius: '40px' },
        },
        scaleUpSlightly: {
          from: { transform: 'scale(0.95) translateY(10px)', filter: 'brightness(0.85)', borderRadius: '40px' },
          to: { transform: 'scale(1)', filter: 'brightness(1)', borderRadius: '24px' },
        },
        slideInFromRight: {
          from: { transform: 'translateX(30%)', opacity: 0 },
          to: { transform: 'translateX(0)', opacity: 1 },
        },
        slideOutToLeft: {
          from: { transform: 'translateX(0)', opacity: 1 },
          to: { transform: 'translateX(-30%)', opacity: 0 },
        },
        slideInFromLeft: {
          from: { transform: 'translateX(-30%)', opacity: 0 },
          to: { transform: 'translateX(0)', opacity: 1 },
        },
        slideOutToRight: {
          from: { transform: 'translateX(0)', opacity: 1 },
          to: { transform: 'translateX(30%)', opacity: 0 },
        },
        navIconSelect: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2) translateY(-3px)' },
          '100%': { transform: 'scale(1)' },
        },
        'gradient-pan': {
            '0%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
            '100%': { backgroundPosition: '0% 50%' },
        },
        'draw-scribble': {
          to: { strokeDashoffset: 0 },
        }
      },
      animation: {
        'letter-appear': 'letter-appear 0.5s cubic-bezier(0.25, 1, 0.5, 1) forwards',
        'fadeInUp': 'fadeInUp 0.5s cubic-bezier(0.25, 1, 0.5, 1) forwards',
        'fadeIn': 'fadeIn 0.4s ease-in-out forwards',
        'bob': 'bob 1.5s ease-in-out infinite',
        'chatSlideInRight': 'chatSlideInRight 0.4s cubic-bezier(0.25, 1, 0.5, 1) forwards',
        'chatSlideInLeft': 'chatSlideInLeft 0.4s cubic-bezier(0.25, 1, 0.5, 1) forwards',
        'scaleDown': 'scaleDownSlightly 0.5s cubic-bezier(0.25, 1, 0.5, 1) forwards',
        'scaleUp': 'scaleUpSlightly 0.5s cubic-bezier(0.25, 1, 0.5, 1) forwards',
        'slideInFromRight': 'slideInFromRight 0.5s cubic-bezier(0.25, 1, 0.5, 1) forwards',
        'slideOutToLeft': 'slideOutToLeft 0.5s cubic-bezier(0.25, 1, 0.5, 1) forwards',
        'slideInFromLeft': 'slideInFromLeft 0.5s cubic-bezier(0.25, 1, 0.5, 1) forwards',
        'slideOutToRight': 'slideOutToRight 0.5s cubic-bezier(0.25, 1, 0.5, 1) forwards',
        'nav-icon-select': 'navIconSelect 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'breathe-in': 'breathe-in 4s ease-in-out forwards',
        'breathe-out': 'breathe-out 4s ease-in-out forwards',
        'draw-scribble': 'draw-scribble 2s cubic-bezier(0.42, 0, 0.58, 1) forwards',
        'gradient-pan': 'gradient-pan 15s ease-in-out infinite',
        'slideInFromTop': 'slideInFromTop 0.5s cubic-bezier(0.25, 1, 0.5, 1) forwards',
        'slideOutToTop': 'slideOutToTop 0.5s cubic-bezier(0.25, 1, 0.5, 1) forwards'
      }
    },
  },
  plugins: [],
}