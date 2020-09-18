interface Config {
  json: Record<string, any>;
  get: (path: string) => string | undefined;
  toEnv: () => string;
}

export = Config;