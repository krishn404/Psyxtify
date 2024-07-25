/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        mytheme: {        
          "primary": "#29524A",             
          "secondary": "#94A187",             
          "accent": "#C5AFA0",             
          "neutral": "#f3f4f6",            
          "base-100": "#0D0D0D",            
          "info": "#94A187",          
          "success": "#29524A",          
          "warning": "#fde68a",           
          "error": "#f87171",
          },
        },
      ],
    },
  plugins: [
    require('@tailwindcss/typography'), require('daisyui'),
  ],
  corePlugins: {
     fontSmoothing: false,
  }
}

