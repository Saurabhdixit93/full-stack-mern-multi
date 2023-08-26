const Dotenv = require("dotenv-webpack");

// dotenv config
module.exports = {
  plugins: [new Dotenv()],
  devServer: {
    historyApiFallback: {
      rewrites: [{ from: /\//, to: "/404.html" }],
    },
  },
};
