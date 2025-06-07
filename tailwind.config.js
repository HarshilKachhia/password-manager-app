/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--ion-color-primary)',
        tertiary: 'var(--ion-color-tertiary)',
        success: 'var(--ion-color-success)',
        warning: 'var(--ion-color-warning)',
        danger: 'var(--ion-color-danger)',
        medium: 'var(--ion-color-medium)',
        light: 'var(--ion-color-light)'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        'Basic-commercial-black': ['Basic-commercial-black', 'sans-serif'],
        'Basic-commercial-black-italic': ['Basic-commercial-black-italic', 'sans-serif'],
        'Basic-commercial-bold': ['Basic-commercial-bold', 'sans-serif'],
        'Basic-commercial-bold-italic': ['Basic-commercial-bold-italic', 'sans-serif'],
        'Basic-commercial-italic': ['Basic-commercial-italic', 'sans-serif'],
        'Basic-commercial-light': ['Basic-commercial-light', 'sans-serif'],
        'Basic-commercial-light-italic': ['Basic-commercial-light-italic', 'sans-serif'],
        'Basic-commercial-roman': ['Basic-commercial-roman', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 