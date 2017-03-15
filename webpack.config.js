var UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');

module.exports = {
  entry: [ 'babel-polyfill', 
          './src/cartfox.js'
         ],
  output: {
    path: './dist',
    filename: 'cartfox.js'
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
    new UglifyJsPlugin({
      beautify: false,
      mangle: { screw_ie8 : true },
      compress: { screw_ie8: true, warnings: false },
      comments: false
    })
  ]
};