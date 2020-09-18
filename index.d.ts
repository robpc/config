class Config {
  json: Record<string, any>;
  get(path: string): string | undefined;
}

type Main = {
  json: Config;
  env: Config;
  yaml: Config;
};

declare module '@robpc/config' {
  const main: Main;
  export = main;
}
declare module '@robpc/config/json' {
  const config: Config;
  export = config;
}

declare module '@robpc/config/env' {
  const config: Config;
  export = config;
}

declare module '@robpc/config/yaml' {
  const config: Config;
  export = config;
}