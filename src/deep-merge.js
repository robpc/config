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
const mutableMerge = (a, b) => {
  if (typeof a === 'object' && typeof b === 'object') {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);

    const next = {};

    const diffAKeys = aKeys.filter((k) => !bKeys.includes(k));
    diffAKeys.forEach((k) => { next[k] = a[k]; });

    const diffBKeys = bKeys.filter((k) => !aKeys.includes(k));
    diffBKeys.forEach((k) => { next[k] = b[k]; });

    bKeys.filter((k) => bKeys.includes(k))
      .forEach((k) => {
        if (typeof a[k] !== typeof b[k]) {
          next[k] = b[k];
        } else {
          next[k] = mutableMerge(a[k], b[k]);
        }
      });

    return next;
  }

  // if (Array.isArray(a) && Array.isArray(b)) {
  //   // iterate over the array?
  //   return b;
  // }

  return b;
};
const deepMerge = (a, b) => JSON.parse(JSON.stringify(mutableMerge(a, b)));

module.exports = deepMerge;
