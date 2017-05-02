// const webpack = require('webpack');
const path = require('path');
const AutoprefixerPlugin = require('autoprefixer');

const styleLoaders = [
  {
    loader: 'css-loader',
    options: {
      modules: true,
    },
  },
  {
    loader: 'postcss-loader',
    options: {
      plugins: () => [
        AutoprefixerPlugin({ browsers: 'last 2 versions' }),
      ],
    },
  },
  {
    loader: 'sass-loader',
  },
];

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: path.resolve(__dirname, './src/index.html'),
  // filename: 'index.html',
  inject: 'body',
});

const config = {
  context: path.resolve(__dirname, './src'),
  entry: [
    'babel-polyfill',
    './index.js',
  ],
  output: {
    filename: 'app-bundle.js',
    path: path.resolve(__dirname, './dist'),
    publicPath: '/',
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.resolve(__dirname, './src'),
    historyApiFallback: true,
    stats: {
      children: false,
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        exclude: [/node_modules/],
        use: [{
          loader: 'eslint-loader',
          options: {
            fix: true,
            failOnError: false,
          },
        }],
      },
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: [{
          loader: 'babel-loader',
          options: {
            presets: [
              'es2015',
              'es2016',
              'es2017',
            ],
          },
        }],
      },
      {
        test: /\.(scss|sass)$/,
        exclude: [/node_modules/],
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: styleLoaders,
        }),
      },
    ],
  },
  plugins: [
    HtmlWebpackPluginConfig,
    new ExtractTextPlugin('styles.css'),
  ],
};

if (process.env.NODE_ENV === 'production') {
  config.devtool = ''; // No sourcemap for production
  config.output.publicPath = './';

  // Add more configuration for production here like
  // SASS & CSS loaders
  // Offline plugin
  // Etc,
}

module.exports = config;
