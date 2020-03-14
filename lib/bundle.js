"use strict";

const { promises: fs } = require("fs");
const path = require("path");

/**
 * Bundles the given Swagger/OpenAPI definition
 *
 * @param {string} api - The path of the Swagger/OpenAPI file
 * @param {{outfile: string, dereference: boolean, format: number, wrap: number}} options
 * @returns {Promise}
 */
module.exports = async function bundle (api, options) {
  // NOTE: lazy-load SwaggerParser, so the CLI can set the env.DEBUG variable first
  var SwaggerParser = require('@apidevtools/swagger-parser');  // eslint-disable-line

  // Determine which Swagger Parser method to use
  let method = options.dereference ? "dereference" : "bundle";

  // The "format" option can be a number of characters or the string to use as the indent
  let numSpaces = parseInt(options.format);
  options.format = numSpaces || options.format || 2;

  // The "wrap" option can only be a number
  options.wrap = parseInt(options.wrap) || Infinity;

  // Throw an error if the API contains circular $refs and we're dereferencing,
  // since the output can't be serialized as JSON
  let opts = {
    dereference: {
      circular: !options.dereference,
    }
  };

  let bundled = await SwaggerParser[method](api, opts);

  let content;

  switch (options.type) {
    case "yaml":
      // Serialize the bundled/dereferenced API as YAML
      content = toYAML(bundled, options.format, options.wrap);
      break;
    default:
      // Serialize the bundled/dereferenced API as JSON
      content = toJSON(bundled, options.format);
      break;
  }

  if (options.outfile) {
    // Create the output directory, if necessary
    await fs.mkdir(path.dirname(options.outfile), { recursive: true });

    // Write the result to the output file
    await fs.writeFile(options.outfile, content);
  }

  return content;
};

/**
 * Serializes the given API as JSON, using the given spaces for formatting.
 *
 * @param {object} api
 * @param {string|number} spaces
 */
function toJSON (api, spaces) {
  return JSON.stringify(api, null, spaces) + "\n";
}

/**
 * Serializes the given API as YAML, using the given spaces for formatting.
 *
 * @param {object} api API to convert to YAML
 * @param {string|number} spaces number of spaces to ident
 * @param {number} wrap the column to word-wrap at
 */
function toYAML (api, spaces, wrap) {
  const jsYaml = require("js-yaml");

  return jsYaml.dump(api, {
    indent: spaces,
    lineWidth: wrap,
    noRefs: true
  });
}
