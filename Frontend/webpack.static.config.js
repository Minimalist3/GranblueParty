
'use strict'

const merge = require('webpack-merge')
const path = require("path");
const baseConfig = require('./webpack.base.config.js')

const CopyPlugin = require('copy-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const imageminMozjpeg = require('imagemin-mozjpeg');
const RemovePlugin = require('remove-files-webpack-plugin');

module.exports = merge(baseConfig, {
  // Point entry to your app's server entry file
  entry: './src/app-deps.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'garbage.js'
  },
  module: {
    rules: [
      { test: /\.(png|jpg|gif|ico|txt)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
              context: 'src',
            },
          },
        ],
      },
    ]
  },
  plugins: [
    new CopyPlugin( [{ from: path.resolve(__dirname, 'src', 'img'), to: 'img' }] ),
    new ImageminPlugin({
      cacheFolder: path.resolve(__dirname, 'cache'),
      minFileSize: 1024,
      plugins: [
        imageminMozjpeg({quality: 85}),
      ],
    }),
    new RemovePlugin({
      after: {
        root: './dist',
        include: [
          'garbage.js',
        ]
      }
  })
  ]
})