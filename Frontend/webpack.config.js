'use strict'

const glob = require('glob')
const path = require('path');
const webpack = require('webpack');

const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackCdnPlugin = require('webpack-cdn-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const SitemapWebpackPlugin = require('sitemap-webpack-plugin').default;
// CSS
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin')
// Images
const CopyPlugin = require('copy-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const imageminMozjpeg = require('imagemin-mozjpeg');

module.exports = (env, argv) => {
    const devMode = argv.mode !== 'production';

    let config = {
        entry: './src/app.js',
        stats: 'minimal',
        output: {
          filename: devMode ? 'main.js' : '[name]-[contenthash].js',
          chunkFilename: devMode ? '[name].js' : '[name]-[contenthash].js',
          path: path.resolve(__dirname, 'dist_new'),
          publicPath: '/',
          crossOriginLoading: 'anonymous',
        },
        optimization: {
          splitChunks: {
            chunks: 'all',
          },
        },
        devServer: {
          publicPath: "/",
          port: 8080,
          hot: true,
          watchOptions: {
            aggregateTimeout: 300,
            poll: true,
          },
          historyApiFallback: true,
        },
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
              use: 'vue-loader'
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
                loader: MiniCssExtractPlugin.loader,
                options: {
                  hmr: devMode
                },
              },
              'css-loader',
              {
                loader: 'postcss-loader',
                options: {
                  ident: 'postcss',
                  plugins: [
                    require('postcss-import'),
                    require('tailwindcss'),
                    require('autoprefixer'),
                    require('cssnano')({
                      preset: ['default', {
                        discardComments: { removeAll: ! devMode }
                      }],                              
                    })
                  ]
                }
              } ]
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
          // Ignore node_modules to lower CPU usage with dev server
          new webpack.WatchIgnorePlugin([
            path.join(__dirname, '.git'),
            path.join(__dirname, 'dist'),
            path.join(__dirname, 'nginx'),
            path.join(__dirname, 'node_modules'),
            path.join(__dirname, 'src', 'img'),
          ]),
          new CleanWebpackPlugin(),
          new VueLoaderPlugin(),
          new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.resolve(__dirname, 'src', 'index.html'),
            inject: true,
            minify: {
              html5: ! devMode,
              collapseWhitespace: ! devMode,
              minifyJS: ! devMode
            }
          }),
          new WebpackCdnPlugin({
            modules: [
              {
                name: 'vue',
                var: 'Vue',
                path: devMode ? 'vue.runtime.js' : 'vue.runtime.min.js'
              },
              {
                name: 'vue-router',
                var: 'VueRouter',
                path: devMode ? 'vue-router.js' : 'vue-router.min.js'
              },
              {
                name: 'vuex',
                var: 'Vuex',
                path: devMode ? 'vuex.js' : 'vuex.min.js'
              },
              {
                name: 'axios',
                var: 'axios',
                path: 'axios.min.js'
              },
            ],
            prodUrl: 'https://cdnjs.cloudflare.com/ajax/libs/:name/:version/:path',
            devUrl: ':name/dist/:path',
            prod: ! devMode,
            publicPath: '../node_modules',
            crossOrigin: 'anonymous',
            sri: true,
          }),
          new MiniCssExtractPlugin({
            filename: devMode ? '[name].css' : '[name]-[contenthash].css',
            chunkFilename: devMode ? '[name].css' : '[name]-[contenthash].css',
          }),
          new CopyPlugin( [{ from: 'src/img', to: 'img' }] ),
        ],
    };

    if (devMode) {
      config.plugins.push(new webpack.HotModuleReplacementPlugin());
      config.plugins.push(new webpack.NamedModulesPlugin());
    }
    else {
      config.plugins.push(new PurgecssPlugin({
        paths: glob.sync(path.join(__dirname, 'src', '**', '*'),  { nodir: true }),
        content: ['index.html', '**/*.js', '**/*.html', '**/*.vue'],
        // Include any special characters you're using in this regular expression
        defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
      }));
      config.plugins.push(new ImageminPlugin({
        cacheFolder: path.resolve(__dirname, 'cache'),
        plugins: [
          imageminMozjpeg({quality: 85}),
        ],
      }));
      config.plugins.push(new SitemapWebpackPlugin('https://www.granblue.party/',
        [
          '/',
          '/builder',
          '/collection',
          '/calcevoker',
          '/calcgw',
          '/release',
          '/friendsum',
          '/dailygrind'
        ],
        {
          changeFreq: 'weekly',
          lastMod: true,
        }
      ));
    }

    return config;
}