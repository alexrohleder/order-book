const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

if (process.env.NODE_ENV === "production") {
  // convert tailwind css variables to their values, for styles performance :)
  config.plugins["postcss-css-variables"] = {};
}

module.exports = config;
