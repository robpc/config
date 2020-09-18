/* eslint-disable global-require */
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

const files = {
  './config/default.yml':
`bob: evans
vehicle:
  car:
    topSpeed: 80
    seats: 5`,
  './config/test.yml':
`vehicle:
  car:
    topSpeed: 120
    seats: 6`,
  './config/default.json': JSON.stringify({
    bob: 'evans',
    vehicle: {
      car: {
        topSpeed: 80,
        seats: 8,
      },
    },
  }),
  './config/test.json': JSON.stringify({
    vehicle: {
      car: {
        topSpeed: 120,
      },
    },
  }),
  './config/mixed.json': JSON.stringify({
    vehicle: {
      truck: {
        topSpeed: 68,
      },
    },
  }),
};

beforeAll(() => {
  jest.mock('fs');
  const fs = require('fs');

  fs.existsSync = jest.fn((filename) => !!files[filename]);
  fs.readFileSync = jest.fn((filename) => files[filename]);
});

test('yaml in generic loader', () => {
  process.env.NODE_ENV = 'test';

  const configLoader = require('./index');
  const config = configLoader.load('test');

  expect(config.get('bob')).toBe('evans');
  expect(config.get('vehicle.car.topSpeed')).toBe(120);
  expect(config.get('vehicle.truck.topSpeed')).toBe(undefined);
});

test('yaml in generic loader', () => {
  process.env.NODE_ENV = 'test';

  const configLoader = require('./index');
  const config = configLoader.load('test');

  expect(config.get('bob')).toBe('evans');
  expect(config.get('vehicle.car.topSpeed')).toBe(120);
  expect(config.get('vehicle.truck.topSpeed')).toBe(undefined);
});

test('env in generic loader', () => {
  const test = {
    bob: 'evans',
    vehicle: {
      car: {
        topSpeed: 80,
      },
    },
  };

  process.env.NODE_CONFIG = JSON.stringify(test);

  const configLoader = require('./index');
  const config = configLoader.load('NODE_CONFIG');

  expect(config.get('bob')).toBe('evans');
  expect(config.get('vehicle.car.topSpeed')).toBe(80);
  expect(config.get('vehicle.truck.topSpeed')).toBe(undefined);
});

test('mixed loaders in generic loader', () => {
  const test = {
    bob: 'evans',
    vehicle: {
      car: {
        topSpeed: 60,
      },
    },
  };

  process.env.NODE_CONFIG = JSON.stringify(test);

  const configLoader = require('./index');
  const config = configLoader.load(['test', 'mixed', 'NODE_CONFIG']);

  expect(config.get('bob')).toBe('evans');
  expect(config.get('vehicle.car.topSpeed')).toBe(60);
  expect(config.get('vehicle.car.seats')).toBe(6);
  expect(config.get('vehicle.truck.topSpeed')).toBe(68);
});
