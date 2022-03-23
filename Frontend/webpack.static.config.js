'use strict'

const { merge } = require('webpack-merge')
const path = require("path");
const baseConfig = require('./webpack.base.config.js')

const CopyPlugin = require('copy-webpack-plugin');
const RemovePlugin = require('remove-files-webpack-plugin');

const devMode = process.env.NODE_ENV !== 'production';
const dist_path = devMode ? 'dist_dev' : 'dist_new';

module.exports = merge(baseConfig, {
  // Point entry to your app's server entry file
  entry: './src/app-deps.js',
  output: {
    path: path.join(__dirname, dist_path),
    filename: 'garbage.js'
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif|ico|txt|webp)$/,
        type: 'asset/resource',
        generator: {
          filename: '[name][ext]',
        }
      },
    ]
  },
  plugins: [
    new CopyPlugin( { patterns: [
      { from: path.resolve(__dirname, 'src', 'img_opti'), to: 'img' }
    ]} ),
    new RemovePlugin({
      after: {
        root: './' + dist_path,
        include: [
          'garbage.js',
        ]
      }
    })
  ]
})