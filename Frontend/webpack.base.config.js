'use strict'

const webpack = require('webpack');
const path = require("path");
const { VueLoaderPlugin } = require('vue-loader');
// CSS
const ExtractCssPlugin = require('extract-css-chunks-webpack-plugin');

const devMode = process.env.NODE_ENV !== 'production';

let config = {
  mode: devMode ? 'development' : 'production',
  stats: 'minimal',
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '#': path.resolve(__dirname, 'node_modules'),
    },
  },
  module: {
    rules: [
      { test: /\.vue$/,
        use: [
          {
            loader: 'vue-loader',
            options: {
              compilerOptions: { whitespace: devMode ? 'preserve' : 'condense' }
            }
          }
        ]
      },
      { test: /\.js$/, 
        exclude: /node_modules/, 
        use: [
          {
            loader: "ifdef-loader",
            options: { DEBUG: devMode }
          }
        ]
      },
      { test: /\.css$/,
        use: [ 
        {
          loader: ExtractCssPlugin.loader,
          options: {
            hmr: devMode
          },
        },
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              ident: 'postcss',
              plugins: [
                'postcss-import',
                'tailwindcss',
                'autoprefixer',
                ['cssnano', {
                  preset: ['default', {
                    discardComments: { removeAll: ! devMode }
                  }],
                }]
              ]
            }
          }
        }
       ]
      },
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
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    new ExtractCssPlugin({
      filename: devMode ? '[name].css' : '[name]-[contenthash].css',
      chunkFilename: devMode ? '[name].css' : '[name]-[contenthash].css',
    }),
  ]
}

if (devMode) {
  console.log('Dev mode');
}
else {
  console.log('Production mode');
}

module.exports = config;