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
      '/metalk8s': {
        target: ' http://localhost:3001/',
        changeOrigin: true,
        pathRewrite: { '^/metalk8s': '' },
      },
    },
    clientLogLevel: 'debug',
  },
  // `HtmlWebpackPlugin` will generate index.html into the build folder
  plugins: [
    new HtmlWebpackPlugin({ template: 'src/index.html' }),
    // new URLImportPlugin({
    //   useExternals: {
    //     // react: 'React',
    //     manifestName: 'my-special-build',
    //   },
    // }),
    new URLImportPlugin({
      manifestName,
      fileName: 'importManifest.js',
      basePath: ``,
      publicPath: `//localhost:3001/`,
      transformExtensions: /^(gz|map)$/i,
      writeToFileEmit: false,
      seed: null,
      filter: null,
      debug: true,
      map: null,
      generate: null,
      sort: null,
    }),
  ],
};

// new URLImportPlugin({
//   manifestName: "website-one",
//   fileName: "importManifest.js",
//   basePath: ``,
//   publicPath: `//localhost:3001/`,
//   writeToFileEmit: false,
//   seed: null,
//   filter: null,
//   debug: true,
//   useExternals: {},
//   provideExternals: {}
// })
