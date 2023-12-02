const { merge } = require('webpack-merge');
const shared = require('./shared.config.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const plugins = [
  new MiniCssExtractPlugin({
    filename: '[contenthash].css',
  }),
];

module.exports = merge(shared, {
  mode: 'production',
  target: 'browserslist',
  plugins,
  devtool: false,
  output: {
    filename: '[fullhash].js',
  },
  optimization: {
    usedExports: false,
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          mangle: false,
          compress: true,
          output: {
            beautify: true,
            comments: false,
          },
        },
        extractComments: false,
      }),
    ],
  },
});