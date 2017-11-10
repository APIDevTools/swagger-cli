'use strict';

const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

/**
 * Bundles the given Swagger API
 *
 * @param {string} api - The path of the Swagger API file
 * @param {{outfile: string, dereference: boolean, format: number}} options
 * @param {function} [cb]
 * @returns {Promise}
 */
module.exports = function bundle (api, options, cb) {
  // NOTE: lazy-load SwaggerParser, so the CLI can set the env.DEBUG variable first
  var SwaggerParser = require('swagger-parser');  // eslint-disable-line

  // Determine which Swagger Parser method to use
  let method = options.dereference ? 'dereference' : 'bundle';

  // Throw an error if the API contains circular $refs and we're dereferencing,
  // since the output can't be serialized as JSON
  let opts = {
    dereference: !options.dereference,
  };

  // Normalize the callback function
  if (typeof cb !== 'function') {
    cb = function () {};
  }

  return SwaggerParser[method](api, opts)
    .then(bundled => {
      // Serialize the bundled/dereferenced API as JSON
      let json = toJSON(bundled, options.format);

      if (options.outfile) {
        // Create the output directory, if necessary
        mkdirp.sync(path.dirname(options.outfile));

        // Write the JSON to the output file
        fs.writeFileSync(options.outfile, json);
      }

      cb(null, json);
      return json;
    })
    .catch((err) => {
      cb(err, null);
      throw err;
    });
};

/**
 * Serializes the given API as JSON, using the given spaces for formatting.
 *
 * @param {object} api
 * @param {string|number} spaces
 */
function toJSON (api, spaces) {
  let strSpaces = spaces;
  let numSpaces = parseInt(spaces);
  if (isNaN(numSpaces)) {
    spaces = strSpaces || 2;
  }
  else {
    spaces = numSpaces;
  }

  return JSON.stringify(api, null, spaces) + '\n';
}
