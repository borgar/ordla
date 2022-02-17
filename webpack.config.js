/* globals module require __dirname */
const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const DefinePlugin = require('webpack').DefinePlugin;

module.exports = function (a, wp) {
  const isDev = wp.mode === 'development';
  const destPath = path.resolve(__dirname, './docs');
  return {
    entry: './src/index.jsx',
    output: {
      // have no idea why dev server is so flaky but this works:
      publicPath: isDev ? '/' : './',
      path: destPath
    },
    // eslint-disable-next-line no-undefined
    devtool: isDev ? 'source-map' : undefined,
    devServer: {
      compress: true,
      port: 9000,
      magicHtml: false,
      static: {
        directory: path.join(__dirname, './static')
      }
    },
    plugins: [
      new HtmlWebPackPlugin({
        template: './src/index.html',
        filename: 'index.html'
      }),
      new CopyWebpackPlugin({
        patterns: [ {
          from: path.resolve(__dirname, './static'),
          to: destPath
        } ]
      }),
      new DefinePlugin({
        BUILD_ID: JSON.stringify(Math.floor(Date.now() / 1000).toString(16))
      })
    ],
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /(node_modules)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-react'
              ]
            }
          }
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: 'style-loader'
            },
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
                modules: true
              }
            }
          ]
        }
      ]
    }
  };
};
