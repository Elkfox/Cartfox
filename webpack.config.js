var UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
var HtmlwebpackPlugin = require('html-webpack-plugin');

var config = {
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          plugins: ['transform-runtime'],
          presets: ['es2015']
        }
      }
    ]
  }
}

var unCompressed = Object.assign({}, config, {
entry: [ './src/cartfox.js'
         ],
  output: {
    path: './dist',
    filename: 'cartfox.js',
    library: 'Cartfox'
  },   
   externals: {
        // require("jquery") is external and available
        //  on the global var jQuery
        "jquery": "jQuery"
    },

  plugins: [
    new HtmlwebpackPlugin(),
  ]
});

var minified = Object.assign({}, config, {
entry: [ './src/cartfox.js'
         ],
  output: {
    path: './dist',
    filename: 'cartfox.min.js',
    library: 'Cartfox'
  },   
   externals: {
        // require("jquery") is external and available
        //  on the global var jQuery
        "jquery": "jQuery"
    },

  plugins: [
    new HtmlwebpackPlugin(),
    new UglifyJsPlugin({
      beautify: false,
      mangle: { screw_ie8 : true },
      compress: { screw_ie8: true, warnings: false },
      comments: false
    })
  ]
});

var unCompressedjQuery = Object.assign({}, config, {
entry: [ 'babel-polyfill', 
          './src/cartfox.js'
         ],
  output: {
    path: './dist',
    filename: 'cartfox.jquery.js',
    library: 'Cartfox'
  },   

  plugins: [
    new HtmlwebpackPlugin(),
  ]
});

var minifiedjQuery = Object.assign({}, config, {
entry: [ 'babel-polyfill', 
          './src/cartfox.js'
         ],
  output: {
    path: './dist',
    filename: 'cartfox.jquery.min.js',
    library: 'Cartfox'
  },   
  plugins: [
    new HtmlwebpackPlugin(),
    new UglifyJsPlugin({
      beautify: false,
      mangle: { screw_ie8 : true },
      compress: { screw_ie8: true, warnings: false },
      comments: false
    })
  ]
});

module.exports = [unCompressed, minified];