'use strict';

var path      = require('path'),
    rimraf    = require('rimraf'),
    spawnSync = require('spawn-sync');

/**
 * The path of the CLI script.
 */
exports.cliPath = path.resolve(__dirname, '..', '..', 'bin', 'swagger.js');

/**
 * The path of the .tmp directory.
 * This directory is automatically cleared before each test.
 */
exports.tmpPath = path.join(__dirname, '..', '.tmp');

/**
 * Delete the .tmp directory before each test
 */
beforeEach(function(done) {
  rimraf(exports.tmpPath, done);
});

/**
 * Runs Swagger CLI with the given arguments.
 *
 * @param {...string} args - The arguments to pass to the CLI
 * @returns {object}
 */
exports.run = function(args) {
  // Run the CLI
  args = [exports.cliPath].concat(Array.prototype.slice.call(arguments));
  var output = spawnSync('node', args);

  // Normalize the output
  output.stdout = output.stdout.toString();
  output.stderr = output.stderr.toString();
  return output;
};
