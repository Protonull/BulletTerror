const webpack = require("webpack");

module.exports = {
  // Entry file JS
  entry: {
    game: "./index.js"
  },

  // File minified
  output: {
    path: __dirname,
    filename: "[name].min.js"
  },

  // Set shorcut to js files
  resolve: {
    root: __dirname,
    alias: {
      ig: "lib/impactES6"
    },
    extensions: ["", ".js"]
  },

  plugins: [
    // Create global variables
    new webpack.ProvidePlugin({
      ig: "ig",
    })
  ],

  module: {
    // Babel ES6 Loader
    loaders: [
      {
        test: /\.js$/,
        loader: "imports?this=>window",
        exclude: "/node_modules/"
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        query: {
          presets: ["es2015"]
        }
      }
    ]
  }
};