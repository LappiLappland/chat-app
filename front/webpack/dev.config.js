const { merge } = require('webpack-merge');
const shared = require('./shared.config.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const plugins = [
  new MiniCssExtractPlugin({
    filename: '[name].[contenthash].css',
  }),
];

module.exports = merge(shared, {
  mode: 'development',
  target: 'web',
  plugins,
  devtool: 'source-map',
  output: {
    filename: '[name].[contenthash].js'
  },
});