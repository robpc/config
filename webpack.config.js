/*
 * Copyright 2019 Rob Cannon
 *
 * Permission to use, copy, modify, and/or distribute this software for any purpose with or
 * without fee is hereby granted, provided that the above copyright notice and this
 * permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO
 * THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT
 * SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR
 * ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF
 * CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE
 * OR PERFORMANCE OF THIS SOFTWARE.
 */
const fs = require('fs');
const path = require('path');

const { BannerPlugin } = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const LICENSE = fs.readFileSync('./LICENSE', 'utf8');
const dist = 'dist';

module.exports = {
  entry: {
    index: './src/index.js',
    'env-loader': './src/env-loader.js',
    'json-loader': './src/json-loader.js',
    'yaml-loader': './src/yaml-loader.js',
  },
  output: {
    library: '@robpc/config',
    libraryTarget: 'umd',
    path: path.join(__dirname, dist),
    filename: '[name].js',
  },
  target: 'node',
  // node: {
  //   fs: 'empty',
  // },
  optimization: {
    minimize: false,
    nodeEnv: false,
  },
  plugins: [
    new CleanWebpackPlugin(),
    new TerserPlugin({
      terserOptions: {
        format: {
          comments: false,
        },
      },
    }),
    new BannerPlugin(LICENSE),
    new CopyPlugin({
      patterns: [
        { from: 'package.json' },
        { from: 'README.md' },
        { from: 'LICENSE' },
        { from: '*.d.ts', context: 'src/' },
      ],
    }),
  ],
  externals: [
    'fs', 'js-yaml',
  ],
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
    ],
  },
};
