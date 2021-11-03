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
const yaml = require('js-yaml');

const Config = require('./core');
const Logger = require('./logger');

const deepMerge = require('./deep-merge');

const logger = new Logger('config-loader');

const toFilename = (baseDir, name, ext) => `${baseDir}/${name}.${ext}`;

const loadYamlFile = (filename) => {
  if (fs.existsSync(filename)) {
    try {
      const str = fs.readFileSync(filename, 'utf8');
      const json = yaml.load(str);
      return json;
    } catch (err) {
      logger.error(`Problem reading yaml file '${filename}`, err);
      return null;
    }
  }

  return null;
};

const loadJsonFile = (filename) => {
  if (fs.existsSync(filename)) {
    try {
      const str = fs.readFileSync(filename);
      const json = JSON.parse(str);
      return json;
    } catch (err) {
      logger.error(`Problem reading json file '${filename}`, err);
      return null;
    }
  }

  return null;
};

const loadEnv = (name) => {
  if (process.env[name]) {
    const envVar = process.env[name];

    try {
      return JSON.parse(envVar);
    } catch (err) {
      logger.error(`Problem loading environment variable '${name}': ${envVar}`);
      return null;
    }
  }

  return null;
};

const loadFile = (baseDir, name) => {
  const yamlFilename = toFilename(baseDir, name, 'yml');
  const yamlJson = loadYamlFile(yamlFilename);
  if (yamlJson) return [yamlJson, yamlFilename, 'yaml'];

  const jsonFilename = toFilename(baseDir, name, 'json');
  const json = loadJsonFile(jsonFilename);
  if (json) return [json, jsonFilename, 'json'];

  const envJson = loadEnv(name);
  if (envJson) return [envJson, name, 'env'];

  return [null, null, null];
};

const load = (names, options) => {
  const defaultName = options && options.default ? options.default : 'default';
  const baseDir = options && options.baseDir ? options.baseDir : './config';

  const loadedFiles = [];

  const configNames = [defaultName];
  if (Array.isArray(names)) {
    configNames.push(...names);
  } else {
    configNames.push(names);
  }

  const configs = configNames
    .map((n) => {
      const [json, filename, loader] = loadFile(baseDir, n);

      if (loader) {
        loadedFiles.push(`${n} -> ${filename} [${loader}]`);
      } else {
        loadedFiles.push(`${n} -> Not Found`);
      }

      return json;
    })
    .filter((x) => !!x);

  logger.log('Loading config from files:');
  loadedFiles.forEach((s) => logger.log(` - ${s}`));

  const merged = configs.reduce(deepMerge, {});

  const finalConfig = merged;

  logger.log('config:', JSON.stringify(finalConfig, null, 2));

  return new Config(finalConfig);
};

module.exports = {
  load,
};
