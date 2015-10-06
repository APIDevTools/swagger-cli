'use strict';

var fs = require('fs');

/**
 * Bundles the given Swagger API
 *
 * @param {string} api - The path of the Swagger API file
 * @param {{outfile: string, dereference: boolean, format: number}} options
 * @param {function} [cb]
 * @returns {Promise}
 */
module.exports = function bundle(api, options, cb) {
  // NOTE: lazy-load SwaggerParser, so the CLI can set the env.DEBUG variable first
  var SwaggerParser = require('swagger-parser');  // eslint-disable-line

  // Determine which Swagger Parser method to use
  var method = options.dereference ? 'dereference' : 'bundle';

  // If the API contains circular $refs, then ignore them.
  // Otherwise, JSON serialization will fail
  var opts = {$refs: {circular: 'ignore'}};

  // Normalize the callback function
  if (typeof(cb) !== 'function') {
    cb = function() {};
  }

  return SwaggerParser[method](api, opts)
    .then(function(api) {
      // Serialize the bundled/dereferenced API as JSON
      var json = toJSON(api, options.format);

      if (options.outfile) {
        // Write the JSON to the output file
        fs.writeFileSync(options.outfile, json);
      }

      cb(null, json);
      return json;
    })
    .catch(function(err) {
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
function toJSON(api, spaces) {
  var strSpaces = spaces;
  var numSpaces = parseInt(spaces);
  if (isNaN(numSpaces)) {
    spaces = strSpaces || 2;
  }
  else {
    spaces = numSpaces;
  }

  return JSON.stringify(api, null, spaces) + '\n';
}
