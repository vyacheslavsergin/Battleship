const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const merge = require('webpack-merge');
const devserver = require('./webpack/devserver');
const sass = require('./webpack/sass');
const strip = require('./webpack/strip');

const common = merge(
  {
    context: path.resolve(__dirname, 'src'),
    entry: {
      app: [
        'babel-polyfill',
        // 'core-js/fn/promise',
        './index',
      ],
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: './',
    },
    // devtool: 'inline-source-map',
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: '/node_modules/',
        },
        // {
        //   test: /\.scss$/,
        //   use: [
        //     'style-loader',
        //     MiniCssExtractPlugin.loader,
        //     {
        //       loader: 'css-loader',
        //       options: {
        //         sourceMap: true
        //       }
        //     },
        //     {
        //       loader: 'postcss-loader',
        //       options: {
        //         sourceMap: true,
        //         config: {
        //           path: 'src/js/postcss.config.js'
        //         }
        //       }
        //     },
        //     {
        //       loader: 'sass-loader',
        //       options: {
        //         sourceMap: true
        //       }
        //     }
        //   ]
        // },
        {
          test: /\.css$/,
          use: [
            'style-loader',
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
                config: {
                  path: 'src/js/postcss.config.js',
                },
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
              },
            },
          ],
        },
        {
          // test: /\.(jpg|png|svg)$/,
          test: /\.(png|jpg|svg|ttf|eot|woff|woff2)$/,
          loader: 'file-loader',
          options: {
            // name: '[path][name].[ext]?[hash]',
            name: '[path][name].[ext]',
          },
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].css',
      }),
      new CleanWebpackPlugin(['dist']),
      new CopyWebpackPlugin(
        [
          { from: './img', to: 'img' },
          // { from: './fonts', to: 'fonts' }
        ],
        // {
        //   ignore: [
        //     {glob: 'svg/*'}
        //   ]
        // }
      ),
      // new webpack.optimize.CommonsChunkPlugin({
      //   name: 'common'
      // })
    ],
  },
  sass(),
);

const developmentConfig = {
  devtool: 'inline-source-map',
  // devServer: {
  //   overlay: true,
  //   port: 9000
  // }
};

module.exports = function (env) {
  console.log(env);
  if (env === 'production') {
    // return common;

    return merge([
      common,
      strip(),
    ]);
  }
  if (env === 'development') {
    // return Object.assign(
    //   {},
    //   common,
    //   developmentConfig,
    //   devserver()
    // )

    return merge([
      common,
      devserver(),
      developmentConfig,
    ]);
  }
};
