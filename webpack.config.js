const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const URLImportPlugin = require('webpack-external-import/webpack');

const manifestName = 'toto';

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
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
  },
  // `HtmlWebpackPlugin` will generate index.html into the build folder
  plugins: [
    new HtmlWebpackPlugin({ template: 'src/index.html' }),
    // URLImportPlugin is needed in the shell for `interleave` method.
    new URLImportPlugin({
      manifestName: 'Shell',
    }),
  ],
};
