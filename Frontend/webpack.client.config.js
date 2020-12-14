const webpack = require('webpack')
const { merge } = require('webpack-merge')
const path = require("path");
const baseConfig = require('./webpack.base.config.js')

const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackCdnPlugin = require('webpack-cdn-plugin');
const SitemapWebpackPlugin = require('sitemap-webpack-plugin').default;

const devMode = process.env.NODE_ENV !== 'production';
const dist_path = devMode ? 'dist_dev' : 'dist_new';

let config = merge(baseConfig, {
  entry: './src/entry-client.js',
  output: {
    filename: devMode ? 'main.js' : '[name]-[contenthash].js',
    chunkFilename: devMode ? '[name].js' : '[name]-[contenthash].js',
    path: path.resolve(__dirname, dist_path),
    publicPath: '/',
    crossOriginLoading: 'anonymous',
  },
  optimization: {
    splitChunks: {
      name: "manifest",
      minChunks: Infinity
    },
  },
  plugins: [
    // This plugins generates `vue-ssr-client-manifest.json` in the
    // output directory.
    new VueSSRClientPlugin(),
    new webpack.DefinePlugin({
      'VUE_ENV': JSON.stringify('client'),
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, 'src', 'index.template.html'),
      inject: ! devMode,
      chunks: [
        'axios.min.js', 'svg-with-js.min.css',
        'vue.runtime.min.js', 'vue.runtime.js',
        'vue-router.min.js', 'vue-router.js',
        'vuex.min.js', 'vuex.js'
      ],
      minify: {
        html5: ! devMode,
        collapseWhitespace: ! devMode,
      }
    }),
  ]
})

if (devMode) {
  config = merge(config, {
    output: {
      publicPath: 'http://localhost:8081/dist_dev/',
    },
    devServer: {
      writeToDisk: true,
      publicPath: "http://localhost:8081/",
      port: 8081,
      hot: true,
      watchOptions: {
        aggregateTimeout: 300,
        poll: true,
      },
      historyApiFallback: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      // Ignore node_modules to lower CPU usage with dev server
      new webpack.WatchIgnorePlugin([
        path.join(__dirname, '.git'),
        path.join(__dirname, 'nginx'),
        path.join(__dirname, 'node_modules'),
        path.join(__dirname, 'src', 'img'),
        path.join(__dirname, 'dist_new'),
        path.join(__dirname, 'dist'),
      ]),
    ],
    devtool: 'source-map',
  })
}
else {
  config = merge(config, {
    plugins: [
      new WebpackCdnPlugin({
        modules: [
          {
            name: 'vue',
            var: 'Vue',
            path: devMode ? 'dist/vue.runtime.js' : 'dist/vue.runtime.min.js'
          },
          {
            name: 'vue-router',
            var: 'VueRouter',
            path: devMode ? 'dist/vue-router.js' : 'dist/vue-router.min.js'
          },
          {
            name: 'vuex',
            var: 'Vuex',
            path: devMode ? 'dist/vuex.js' : 'dist/vuex.min.js'
          },
          {
            name: 'axios',
            var: 'axios',
            path: 'dist/axios.min.js'
          },
          {
            name: '@fortawesome/fontawesome-free',
            var: 'faCSS',
            cssOnly: true,
            style: 'css/svg-with-js.min.css'
          }
        ],
        //prodUrl: 'https://unpkg.com/:name@:version/dist/:path',
        //devUrl: ':name/dist/:path',
        prod: ! devMode,
        publicPath: '../node_modules',
        crossOrigin: 'anonymous',
        sri: true,
      }),
      new SitemapWebpackPlugin({
        base: 'https://www.granblue.party/',
        paths: [
          '/',
          '/builder',
          '/collection',
          '/calcevoker',
          '/calcgw',
          '/release',
          '/friendsum',
          '/dailygrind',
          '/replicard',
          '/roomname',
          '/search',
          '/spark'
        ],
        options: {
          changefreq: 'weekly',
          lastmod: true,
        }
      })      
    ]
  })
}

module.exports = config;