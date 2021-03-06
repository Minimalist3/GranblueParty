const webpack = require('webpack')
const { merge } = require('webpack-merge')
const path = require("path");
const nodeExternals = require('webpack-node-externals')
const baseConfig = require('./webpack.base.config.js')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')

const devMode = process.env.NODE_ENV !== 'production';
const dist_path = devMode ? 'dist_dev' : 'dist_new';

module.exports = merge(baseConfig, {
  // Point entry to your app's server entry file
  entry: './src/entry-server.js',

  // This allows webpack to handle dynamic imports in a Node-appropriate
  // fashion, and also tells `vue-loader` to emit server-oriented code when
  // compiling Vue components.
  target: 'node',

  // For bundle renderer source map support
  devtool: 'source-map',

  // This tells the server bundle to use Node-style exports
  output: {
    path: path.resolve(__dirname, dist_path),
    libraryTarget: 'commonjs2'
  },

  // https://webpack.js.org/configuration/externals/#function
  // https://github.com/liady/webpack-node-externals
  // Externalize app dependencies. This makes the server build much faster
  // and generates a smaller bundle file.
  externals: nodeExternals({
    // do not externalize dependencies that need to be processed by webpack.
    // you can add more file types here e.g. raw *.vue files
    // you should also allowlist deps that modifies `global` (e.g. polyfills)
    allowlist: /\.css$/
  }),

  // This is the plugin that turns the entire output of the server build
  // into a single JSON file. The default file name will be
  // `vue-ssr-server-bundle.json`
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    }),
    new VueSSRServerPlugin(),
    new webpack.DefinePlugin({
      'VUE_ENV': JSON.stringify('server'),
    }),
  ]
})