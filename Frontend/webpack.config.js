'use strict'

const path = require('path');
const webpack = require('webpack');

const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackCdnPlugin = require('webpack-cdn-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const SitemapWebpackPlugin = require('sitemap-webpack-plugin').default;
// CSS
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// Images
const CopyPlugin = require('copy-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const imageminMozjpeg = require('imagemin-mozjpeg');

module.exports = (env, argv) => {
    const devMode = argv.mode !== 'production';

    let config = {
        entry: './src/app.js',
        output: {
            filename: devMode ? 'main.js' : 'main-[contenthash].js',
            path: path.resolve(__dirname, 'dist'),
            publicPath: '/',
        },
        devServer: {
            publicPath: "/",
            hot: true,
            watchOptions: {
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
                    { loader: "ifdef-loader", options: { DEBUG: devMode } }
                  ]
                },
                { test: /\.css$/,
                  use: [ 
                    {
                      loader: MiniCssExtractPlugin.loader,
                      options: {
                        hmr: devMode,
                      },
                    },
                    'css-loader' ]
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
                    minifyCSS: ! devMode,
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
                publicPath: '../node_modules'
            }),
            new MiniCssExtractPlugin({
                filename: devMode ? '[name].css' : '[name]-[contenthash].css',
                chunkFilename: devMode ? '[id].css' : '[id]-[contenthash].css',
            }),
            new CopyPlugin( [{ from: 'src/img', to: 'img' }] ),
        ],
    };

    if (devMode) {
        config.plugins.push(new webpack.HotModuleReplacementPlugin());
    }
    else {
        config.plugins.push(new OptimizeCssAssetsPlugin({
            cssProcessorPluginOptions: {
              preset: ['default', { discardComments: { removeAll: true } }],
            }
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