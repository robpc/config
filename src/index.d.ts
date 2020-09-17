import Config from './core'

type Loaders = {
  json: Config;
  env: Config;
  yaml: Config;
};

declare const index: Loaders;
export = index;