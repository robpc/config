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
/* eslint-disable no-console */

/* eslint-disable-next-line prefer-destructuring */
const ROBPC_CONFIG_DEBUG = process.env.ROBPC_CONFIG_DEBUG;

const isDebug = ROBPC_CONFIG_DEBUG && ROBPC_CONFIG_DEBUG.toLowerCase() === 'true';

class Logger {
  constructor(name) {
    this.name = name;
  }

  log(...args) {
    if (isDebug) console.log(`[${this.name}]`, ...args);
  }

  error(...args) {
    console.log(`[${this.name}]`, ...args);
  }
}

module.exports = Logger;
