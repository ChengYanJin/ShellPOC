const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const URLImportPlugin = require('webpack-external-import/webpack');
const webpack = require('webpack');

const config = {
  mode: 'development',
  entry: {
    shell: './src/index.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[hash].js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ['file-loader'],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader'],
      },
    ],
  },
  devServer: {
    compress: true,
    port: 3000,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    proxy: {
      // In order to fetch the manifest from metalk8s
      '/external-manifest/metalk8s': {
        target: ' http://localhost:3001/',
        changeOrigin: true,
        pathRewrite: { '^/external-manifest/metalk8s': '' },
      },
      // In order to fetch the components from metalk8s
      //  we will need to add the `publicPath = /external-component/metalk8s`
      //  for URLImportPlugin in metalk8s
      '/external-component/metalk8s': {
        target: 'http://localhost:3001/',
        changeOrigin: true,
        pathRewrite: { '^/external-component/metalk8s': '' },
      },
    },
    clientLogLevel: 'debug',
    historyApiFallback: true,
    hot: true,
  },
  // `HtmlWebpackPlugin` will generate index.html into the build folder
  plugins: [
    new HtmlWebpackPlugin({ template: 'src/index.html' }),
    // URLImportPlugin is needed in the shell for `interleave` method.
    new URLImportPlugin({
      manifestName: 'Shell',
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  node: {
    Buffer: false,
    process: false,
  },
};

module.exports = config;

const util = require('util');
// alternative shortcut
console.log(
  'metal',
  util.inspect(config, false, null, true /* enable colors */),
);

// Webpack config note:

// How to solve Refresh issue?
// Issue description: When we refresh the page in the shell, it fetch the resources(importManifest, components and bundles)base on the current URL.
// 1. For URLImportPlugin, we need to give absolute path for publicPath.
// 2. Same for the importManifest path, we will need to add `/` at the beginning to make it an absolute path.
// 3. For the output webpack config, we need to give a publicPath '/' to make it an absolute path.

// HMR (Hot Module Replacement) should never be used in production.
