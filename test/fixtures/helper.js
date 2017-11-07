'use strict';

const path = require('path');
const rimraf = require('rimraf');
const spawnSync = require('spawn-sync');

const cwdPath = process.cwd() + '/';
const cwdUrl = encodeURI(process.cwd() + '/');
const cliPath = path.resolve(__dirname, '..', '..', 'bin', 'swagger-cli.js');
const tmpPath = path.join(__dirname, '..', '.tmp');

/**
 * Delete the .tmp directory before each test
 */
beforeEach(done => {
  rimraf(tmpPath, done);
});

/**
 * Runs Swagger CLI with the given arguments.
 *
 * @param {...string} args - The arguments to pass to the CLI
 * @returns {object}
 */
exports.run = function (args) {
  // Run the CLI
  args = [cliPath].concat(Array.prototype.slice.call(arguments));
  let output = spawnSync('node', args);

  // Normalize the output
  output.stdout = replacePaths(output.stdout.toString());
  output.stderr = replacePaths(output.stderr.toString());

  return output;
};

/**
 * Replaces absolute paths with relative paths in the output, to simplify testing
 *
 * @param {string} output - The original program output
 * @returns {string}
 */
function replacePaths (output) {
  let newOutput = '';

  while (true) {                                  // eslint-disable-line no-constant-condition
    newOutput = output.replace(cwdPath, '');
    newOutput = newOutput.replace(cwdUrl, '');

    if (newOutput === output) {
      // No more occurrences exist
      return newOutput;
    }
    else {
      output = newOutput;
    }
  }
}
