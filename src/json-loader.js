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

const Config = require('./core');
const Logger = require('./logger');

const { NODE_ENV } = process.env;

const logger = new Logger('config-json-loader');

const configNames = [
  'default',
];

if (NODE_ENV) {
  configNames.push(NODE_ENV);
}

const baseDir = './config';
const toJsonFilename = (name) => `${baseDir}/${name}.json`;

const loadedFiles = [];

const configs = configNames
  .map((name) => {
    const jsonFilename = toJsonFilename(name);
    if (fs.existsSync(jsonFilename)) {
      try {
        const str = fs.readFileSync(jsonFilename);
        const json = JSON.parse(str);
        loadedFiles.push(`${name} -> ${jsonFilename}`);
        return json;
      } catch (err) {
        logger.error(`Problem reading config file '${jsonFilename}`, err);
        return null;
      }
    }

    return null;
  })
  .filter((config) => config);

const merged = {};

configs.forEach((conf) => Object.assign(merged, conf));

const finalConfig = merged;

logger.log('Loading config from files:');
loadedFiles.forEach((s) => logger.log(` - ${s}`));
logger.log('config:', JSON.stringify(finalConfig, null, 2));

module.exports = new Config(finalConfig);
