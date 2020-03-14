"use strict";

/**
 * Validates the given Swagger/OpenAPI definition
 *
 * @param {string} api - The path of the Swagger/OpenAPI file
 * @param {{schema: boolean, spec: boolean}} options
 * @param {function} [cb]
 * @returns {Promise}
 */
module.exports = function validate (api, options, cb) {
  // Convert the Swagger CLI options into Swagger Parser options
  options = options || {};
  options = {
    validate: {
      schema: options.schema,
      spec: options.spec
    }
  };

  // NOTE: lazy-load SwaggerParser, so the CLI can set the env.DEBUG variable first
  var SwaggerParser = require('@apidevtools/swagger-parser');  // eslint-disable-line

  // Validate the API and return it
  return SwaggerParser.validate(api, options, cb);
};
