# @robpc/config

Simple configuration library for use in node and the browser. Inspired by [config](https://github.com/lorenwest/node-config), but doubles down on the [webpack use case](https://github.com/lorenwest/node-config/wiki/Webpack-Usage) and removes the dynamic require errors in webpack.

## Installation

    npm install --save @robpc/config

## Usage

    const config = require('@robpc/config/json');
    // const config = require('@robpc/config/yaml');
    // const config = require('@robpc/config/env');

    const name = config.get('name');
    const morningGreeting = config.get('greeting.morning');

    console.log(`${morningGreeting}, ${name}!`);

## JSON Loader

_[Example Project](examples/node)_

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

_NOTE:_ The `yaml-loader` works in the same way but looks for `.yml` files instead of `.json`.

## Env Loader

_[Example Project](examples/browser)_

The `env-loader` loads configuration files from the `NODE_CONFIG` environmnent variable.

_Example NODE_CONFIG_

    {\"name\":\"Rob\",\"greeting\":{\"morning\":\"Good Morning\"}}

## Webpack: Combining the Env and File Loaders

_[Example](examples/browser/webpack.config.js)

The file loader can be used to seed the `NODE_CONFIG` using webpack, allowing the benefits of merging configurations without adding all the files into the bundle. This process makes use of the `config.json` object which is a frozen object of the final configuration. With this method, the configuration files can be defined as intended for the `file-loader`, but using the `env-loader` for browser code.

    const { DefinePlugin } = require('webpack');

    const config = require('@robpc/config/lib/file-loader');

    module.exports = {
      // ...
      plugins: [
        new DefinePlugin({
          'process.env.NODE_CONFIG': JSON.stringify(JSON.stringify(config.json)),
        }),
        // ...
      ],
    };

This would also allow frontend and backend code to use the same configuration files and allow sharing of values between them.