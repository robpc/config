import Config from './core';

interface ConfigLoadOptions {
  default?: string = 'default';
  baseDir?: string = './config';
}

type ConfigFactory = {
  load: (names: string | string[], options: ConfigLoadOptions) => Config
};

declare const index: ConfigFactory;
export = index;