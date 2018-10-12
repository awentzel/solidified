const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = (env) => ({
  mode: env === 'prod' ? 'production' : 'development',
  
  entry: './src/index.js',

  output: {
    path: path.resolve('www'),
    publicPath: '/',
    filename: 'scripts/bundle.js'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },

  plugins: [
    new CopyWebpackPlugin([
      { from: 'app' }
    ]),
    new HtmlWebpackPlugin(
      {
        template: './app/index.html'
      }
    )
   
  ]
})
