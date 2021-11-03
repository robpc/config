# @robpc/config

_NOTE: Recently updated to v2, for v1 see [v1/README.md](https://github.com/robpc/config/blob/v1/README.md)._

Simple configuration library for use in node and the browser. Inspired by [config](https://github.com/lorenwest/node-config), but doubles down on the [webpack use case](https://github.com/lorenwest/node-config/wiki/Webpack-Usage) and removes the dynamic require errors in webpack.

## Installation

    npm install --save @robpc/config

## Usage

    const config = require('@robpc/config/json-loader');

    const name = config.get('name');
    const morningGreeting = config.get('greeting.morning');

    console.log(`${morningGreeting}, ${name}!`);

This example uses the `json-loader` but all configs have the same interface.

    interface Config {
      // get individual values from the config using
      // a '.' path separator. Return undefined if any
      // part of the path is undefined
      get: (path: string) => string | undefined;

      // used in the webpack scenario to to export to
      // an environment variable
      toEnv: () => string;

      // Access the raw merged config directly
      json: Record<string, any>;
    }

## Loaders

There are three loaders that can be referenced directly using the pattern `@robpc/config/[name]-loader`. These have default configuratons and only contain code for their respecive needs (ie `env-loader` does not require `fs`, and `json-loader` does not require `js-yaml`). The default package import `@robpc/config` is a factory to generate a config with custom options. See the sections below for more information.

### File Loaders

_[Example Project](examples/node)_

_NOTE:_ The `yaml-loader` works in the same way but looks for `.yml` files instead of `.json`.

The `json-loader` loads configuration files from the `config/` directory at the root of the project. The library will load the `default.json` first followed by any json has a name matching the value in the `NODE_ENV` environmnent variable overriding previous values. So given the following configuration files:

_config/default.json_

    {
      "name": "Bob",
      "greeting": {
        "morning": "Good Morning"
      }
    }

_config/production.json_

    {
      "name": "Rob"
    }

If the `NODE_ENV` is set to `production`, then the effective value of the config would be:

    {
      "name": "Rob",
      "greeting": {
        "morning": "Good Morning"
      }
    }

Here the default name `Bob` is changed to `Rob` for production.

### Env Loader

_[Example Project](examples/browser)_

The `env-loader` loads configuration files from the `NODE_CONFIG` environmnent variable.

_Example NODE_CONFIG_

    {\"name\":\"Rob\",\"greeting\":{\"morning\":\"Good Morning\"}}

### Custom Loader

The custom loader utilizes all the above loaders and will look for config names
in the following order:

* `${baseDir}/${name}.yml`
* `${baseDir}/${name}.json`
* `process.env[name]`

```
const configLoader = require('@robpc/config');

const deployStage = process.env.NODE_ENV;

// Can be a string or an array of strings that list the configs
// to be loaded. The later configs will take higher precedence
const configNames = [deployStage, 'APP_CONFIG_OVERRIDE'];

// (Optional) ability to override the following defaults
const configOptions = {
  baseDir: './config', // directory with configuration files
  default: 'default', // base config to be included by default
}

const config = configLoader.load(process.env.NODE_ENV, options);

const name = config.get('name');
const morningGreeting = config.get('greeting.morning');

console.log(`${morningGreeting}, ${name}!`);
```

## Webpack

### Combining the Env and File Loaders

_[Example](examples/browser/webpack.config.js)_

The file loader can be used to seed the `NODE_CONFIG` using webpack, allowing the benefits of merging configurations without adding all the files into the bundle. With this method, the configuration files can be defined as intended for the `json-loader`, but using the `env-loader` for browser code.

    const { DefinePlugin } = require('webpack');

    const config = require('@robpc/config');
    const NODE_CONFIG = config.load(env.APP_STAGE).toEnv();

    module.exports = {
      // ...
      plugins: [
        new DefinePlugin({
          'process.env.NODE_CONFIG': NODE_CONFIG,
        }),
        // ...
      ],
    };

_NOTE: The `json-loader` and `yaml-loader` can also be used in this way though it is not
recommended since they use the `NODE_ENV` environment which can cause issues._

This would also allow frontend and backend code to use the same configuration files and allow sharing of values between them.

### Advanced Example

A more advanced usage allows sharing a subset of values between frontend and backend

_config/common.yml_

    validation:
      minItems: 2
      maxItems: 10

_config/ui.yml_

    auth:
      api: /api/v1/auth

_config/server.dev.yml_

    auth:
      token: 123434sdFASDFqwe$$%2323RQWER$qr32

_config/ui.dev.yml_

    auth:
      alwaysAdminUsers:
        - robpc

_server/config.js_

    const configLoader = require('@robpc/config');

    const { APP_STAGE } = process.env;

    module.exports = configLoader.load(
      ['server', `server.${APP_STAGE}`]),
      { default: 'common' },
    );

_app/webpack.config.js_

    const { DefinePlugin } = require('webpack');

    const configLoader = require('@robpc/config');

    const { APP_STAGE } = process.env;

    const config = configLoader.load(
      ['ui', `ui.${APP_STAGE}`]),
      { default: 'common' },
    );

    module.exports = {
      // ...
      plugins: [
        new DefinePlugin({
          'process.env.NODE_CONFIG': config.toEnv(),
        }),
        // ...
      ],
    };

_app/index.js_

    const config = require('@robpc/config/env-loader');

    const authApi = config.get('auth.api');
    const validation = config.get('validation');
