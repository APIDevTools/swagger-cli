'use strict';

const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

/**
 * Bundles the given Swagger/OpenAPI definition
 *
 * @param {string} api - The path of the Swagger/OpenAPI file
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
      let content;

      switch (options.type) {
        case 'yaml':
          // Serialize the bundled/dereferenced API as YAML
          content = toYAML(bundled, options.format);
          break;
        default:
          // Serialize the bundled/dereferenced API as JSON
          content = toJSON(bundled, options.format);
          break;
      }

      if (options.outfile) {
        // Create the output directory, if necessary
        mkdirp.sync(path.dirname(options.outfile));

        // Write the result to the output file
        fs.writeFileSync(options.outfile, content);
      }

      cb(null, content);
      return content;
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

/**
 * Serializes the given API as YAML, using the given spaces for formatting.
 *
 * @param {object} api API to convert to YAML
 * @param {string|number} spaces number of spaces to ident
 */
function toYAML (api, spaces) {
  const jsYaml = require('js-yaml');

  let strSpaces = spaces;
  let numSpaces = parseInt(spaces);
  if (isNaN(numSpaces)) {
    spaces = strSpaces || 2;
  }
  else {
    spaces = numSpaces;
  }

  return jsYaml.dump(api, {
    indent: spaces,
    noRefs: true
  });
}
