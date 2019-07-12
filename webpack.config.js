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

const { BannerPlugin } = require('webpack');

const LICENSE = fs.readFileSync('./LICENSE', 'utf8');

module.exports = {
  entry: {
    main: './src/index.js',
    env: './src/env-loader.js',
    json: './src/json-loader.js',
    yaml: './src/yaml-loader.js',
  },
  output: {
    library: '@robpc/config',
    libraryTarget: 'umd',
    path: __dirname,
    filename: '[name].js',
  },
  target: 'node',
  node: {
    fs: 'empty',
  },
  optimization: {
    minimize: false,
  },
  plugins: [
    new BannerPlugin(LICENSE),
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
