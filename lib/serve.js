'use strict';

var Promise = require('./promise');

/**
 * Serves the given Swagger API using Swagger Server
 *
 * @param {string} api - The path of the Swagger API file
 * @param {{port: number, json: string}} options
 * @param {function} [cb]
 * @returns {Promise}
 */
module.exports = function serve(api, options, cb) {
  return new Promise(function(resolve, reject) {
    var err = new Error('Sorry, the "swagger serve" command has not been implemented yet');
    cb && cb(err);
    reject(err);
  });
};
