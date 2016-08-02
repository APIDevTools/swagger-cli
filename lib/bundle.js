'use strict';

var fs = require('fs');
var jsonPath = require('jsonpath-plus');

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
  var SwaggerParser = require('swagger-parser');

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
      // Remove JSON Schema pieces that Swagger trips over
      if (options.swaggerJsonSchema) {
        deJsonSchemafy(api);
      }

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
 * Looks in the Swagger JSON object for JSON Schema keywords that aren't
 * supported by Swagger's subset of JSON Schema
 *
 * @param {object} api - The Swagger object
 */
function deJsonSchemafy(api) {
  jsonPath({json: api, path: '$.paths[*][*].responses[*].schema', callback: removeJsonSchemaParts});
  jsonPath({json: api, path: '$.paths[*][*].parameters[*].schema', callback: removeJsonSchemaParts});
  jsonPath({json: api, path: '$.paths[*].parameters[*].schema', callback: removeJsonSchemaParts});
  jsonPath({json: api, path: '$.definitions[*].schema', callback: removeJsonSchemaParts});
  jsonPath({json: api, path: '$.parameters[*].schema', callback: removeJsonSchemaParts});
}

/**
 * Modifies the given JSON Schema object to remove any pieces that Swagger
 * doesn't support
 *
 * @param {object} schemaObj - A JSON Schema object
 */
function removeJsonSchemaParts(schemaObj) {
  delete schemaObj.$schema;
  delete schemaObj.id;

  //If this type is an array, then we have to delete the required object.
  //We'll be deleting any related ids that could identify the related objects
  if (schemaObj.type === 'array') {
    delete schemaObj.required;
  }

  //Swagger only supports additionalProperties as an object
  if (typeof schemaObj.additionalProperties !== 'object') {
    delete schemaObj.additionalProperties;
  } else {
    jsonPath({json: schemaObj, path: '$.additionalProperties', callback: removeJsonSchemaParts});
  }

  jsonPath({json: schemaObj, path: '$.properties.*', callback: removeJsonSchemaParts});

  if (Array.isArray(schemaObj.items)) {
    jsonPath({json: schemaObj, path: '$.items[*]', callback: removeJsonSchemaParts});
  } else {
    jsonPath({json: schemaObj, path: '$.items', callback: removeJsonSchemaParts});
  }
}

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

  return JSON.stringify(api, null, spaces);
}
