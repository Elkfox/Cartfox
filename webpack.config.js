const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
const HtmlwebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const config = {
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          plugins: ['transform-runtime'],
          presets: ['es2015'],
        },
      },
    ],
  },
};

const unCompressed = Object.assign({}, config, {
  entry: ['./src/index.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'cartfox.js',
    library: 'Cartfox',
  },
  externals: {
    // require("jquery") is external and available
    //  on the global var jQuery
    jquery: 'jQuery',
    handlebars: 'Handlebars',
  },

  plugins: [
    new HtmlwebpackPlugin(),
  ],
});

const minified = Object.assign({}, config, {
  entry: ['./src/index.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'cartfox.min.js',
    library: 'Cartfox',
  },
  externals: {
    // require("jquery") is external and available
    //  on the global var jQuery
    jquery: 'jQuery',
    handlebars: 'Handlebars',
  },

  plugins: [
    new HtmlwebpackPlugin(),
    new UglifyJsPlugin({
      beautify: false,
      mangle: { screw_ie8: true },
      compress: { screw_ie8: true, warnings: false },
      comments: false,
    }),
  ],
});

module.exports = [unCompressed, minified];
