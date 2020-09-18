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
const path = require('path');
const { DefinePlugin } = require('webpack');

const configLoader = require('@robpc/config');

const { ROBPC_CONFIG_DEBUG, APP_STAGE } = process.env;

const config = configLoader.load(APP_STAGE);

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
  },
  plugins: [
    new DefinePlugin({
      'process.env.NODE_CONFIG': config.toEnv(),
      'process.env.ROBPC_CONFIG_DEBUG': JSON.stringify(ROBPC_CONFIG_DEBUG),
    }),
  ],
};
