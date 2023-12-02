const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const Webpack = require('webpack');

const mode = process.env.WEBPACK_SERVE ? 'development' : 'production';

const plugins = [
  new Webpack.HotModuleReplacementPlugin(),
  new HtmlWebpackPlugin({
    template: './src/index.html',
  }),
];

if (mode === 'development') {
  plugins.push(new ReactRefreshWebpackPlugin());
}

const devServer = {
  historyApiFallback: true,
  compress: true,
  allowedHosts: 'all',
  hot: true,
  client: {
    overlay: {
      errors: true,
      warnings: true,
    },
    progress: true,
  },
  port: 3000,
};

module.exports = {
  mode,
  plugins,
  devServer,
  entry: path.join(__dirname, '..', 'src', 'index.tsx'),

  output: {
    path: path.resolve(__dirname, '..', 'dist'),
    assetModuleFilename: 'assets/[hash][ext][query]',
    clean: true,
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },

  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          }
        }
      },
      {
        test: /\.(html)$/,
        use: ['html-loader'],
      },
      {
        test: /\.(s[ac]|c)ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              esModule: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  ['postcss-preset-env'],
                ]
              }
            }
          },
        ],
      },
      {
        test: /\.(s[ac])ss$/i,
        use: ['sass-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp|ico)$/i,
        type: mode === 'production' ? 'asset' : 'asset/resource',
        generator: {
          filename: 'assets/img/[hash][ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)$/i,
        exclude: /node_modules/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[hash][ext]'
        }
      },
    ],
  },
};