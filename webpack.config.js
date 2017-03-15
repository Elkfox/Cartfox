var UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
var HtmlwebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: [ 'babel-polyfill', 
          './src/cartfox.js'
         ],
  output: {
    path: './dist',
    filename: 'cartfox.min.js',
    // filename: 'cartfox.js',
    library: 'Cartfox'
  },   
   externals: {
        // require("jquery") is external and available
        //  on the global var jQuery
        "jquery": "jQuery"
    },
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
};