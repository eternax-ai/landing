module.exports = {
  content: [
    "./*.html",
    "./blogs/**/*.html",
    "./_includes/**/*.html",
    "./scripts/blog-template.html",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["IBM Plex Sans", "ui-sans-serif", "system-ui", "sans-serif"],
        condensed: ["IBM Plex Sans Condensed", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
};
