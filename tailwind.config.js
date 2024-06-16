/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    colors:{
      primary: "#5864f2",
      secondary: "#b5bac1",
      background: "#313338",
      "background-secondary": "#2b2d31",
      "component-background": "#383a40",
      "background-tertiary":"#1e1f22",
      success:"#248046",
      warning:"#f0b033",
      danger:"#da363c",
      info:"#05a8fc"
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

