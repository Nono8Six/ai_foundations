/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography';
import forms from '@tailwindcss/forms';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        primary: '#1e40af', // Deep blue (primary) - blue-700
        'primary-50': '#eff6ff', // Very light blue - blue-50
        'primary-100': '#dbeafe', // Light blue - blue-100
        'primary-500': '#3b82f6', // Medium blue - blue-500
        'primary-600': '#2563eb', // Darker blue - blue-600
        'primary-700': '#1d4ed8', // Dark blue - blue-700
        'primary-800': '#1e3a8a', // Very dark blue - blue-800
        'primary-900': '#1e40af', // Deepest blue - blue-900

        // Secondary Colors
        secondary: '#64748b', // Sophisticated slate - slate-500
        'secondary-50': '#f8fafc', // Very light slate - slate-50
        'secondary-100': '#f1f5f9', // Light slate - slate-100
        'secondary-200': '#e2e8f0', // Light-medium slate - slate-200
        'secondary-300': '#cbd5e1', // Medium-light slate - slate-300
        'secondary-400': '#94a3b8', // Medium slate - slate-400
        'secondary-500': '#64748b', // Base slate - slate-500
        'secondary-600': '#475569', // Dark slate - slate-600
        'secondary-700': '#334155', // Darker slate - slate-700
        'secondary-800': '#1e293b', // Very dark slate - slate-800
        'secondary-900': '#0f172a', // Deepest slate - slate-900

        // Accent Colors
        accent: '#059669', // Success-oriented emerald - emerald-600
        'accent-50': '#ecfdf5', // Very light emerald - emerald-50
        'accent-100': '#d1fae5', // Light emerald - emerald-100
        'accent-500': '#10b981', // Medium emerald - emerald-500
        'accent-600': '#059669', // Base emerald - emerald-600
        'accent-700': '#047857', // Dark emerald - emerald-700

        // Background Colors
        background: '#f8fafc', // Clean, slightly warm white - slate-50
        surface: '#ffffff', // Pure white - white

        // Text Colors
        'text-primary': '#0f172a', // Near-black with subtle warmth - slate-900
        'text-secondary': '#475569', // Medium gray for supporting info - slate-600

        // Status Colors
        success: '#10b981', // Vibrant green for completion - emerald-500
        'success-50': '#ecfdf5', // Light success background - emerald-50
        'success-100': '#d1fae5', // Light success - emerald-100

        warning: '#f59e0b', // Attention-getting amber - amber-500
        'warning-50': '#fffbeb', // Light warning background - amber-50
        'warning-100': '#fef3c7', // Light warning - amber-100

        error: '#ef4444', // Clear red for validation errors - red-500
        'error-50': '#fef2f2', // Light error background - red-50
        'error-100': '#fee2e2', // Light error - red-100

        // Border Colors
        border: '#e2e8f0', // Neutral border color - slate-200
        'border-focus': '#3b82f6', // Focus state border - blue-500
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
      spacing: {
        18: '4.5rem',
        88: '22rem',
        128: '32rem',
      },
      boxShadow: {
        subtle: '0 1px 3px rgba(0, 0, 0, 0.1)',
        medium: '0 4px 6px rgba(0, 0, 0, 0.1)',
        'elevation-1': '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'elevation-2': '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
        'elevation-3': '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      transitionDuration: {
        150: '150ms',
        200: '200ms',
        250: '250ms',
        300: '300ms',
      },
      animation: {
        'fade-in': 'fadeIn 200ms ease-out',
        'slide-in': 'slideIn 300ms ease-out',
        'bounce-subtle': 'bounceSubtle 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceSubtle: {
          '0%': { transform: 'scale(0.95)' },
          '50%': { transform: 'scale(1.02)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      zIndex: {
        60: '60',
        70: '70',
        80: '80',
        90: '90',
        100: '100',
        header: '1000',
        sidebar: '900',
        dropdown: '1100',
        overlay: '1200',
        modal: '1300',
      },
    },
  },
  plugins: [typography, forms],
};
