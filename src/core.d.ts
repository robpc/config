interface Config {
  json: Record<string, any>;
  get: (path: string) => string | undefined;
}

export = Config;