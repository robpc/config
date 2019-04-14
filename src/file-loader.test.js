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

jest.mock('fs');

const files = {
  './config/default.json': {
    bob: 'evans',
    vehicle: {
      car: {
        topSpeed: 80,
      },
    },
  },
  './config/test.json': {
    vehicle: {
      car: {
        topSpeed: 120,
      },
    },
  },
};

fs.existsSync.mockReturnValue(true);
fs.readFileSync = jest.fn(filename => JSON.stringify(files[filename]));

test('file loader', () => {
  process.env.NODE_ENV = 'test';

  const config = require('./file-loader'); /* eslint-disable-line global-require */

  expect(config.get('bob')).toBe('evans');
  expect(config.get('vehicle.car.topSpeed')).toBe(120);
  expect(config.get('vehicle.truck.topSpeed')).toBe(undefined);
});
