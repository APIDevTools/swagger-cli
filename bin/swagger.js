#!/usr/bin/env node
'use strict';

var program = require('commander'),
    chalk   = require('chalk'),
    api     = require('../');

program.command('validate <filename>')
  .description('Validates a Swagger API against the Swagger 2.0 schema and spec')
  .option('--no-schema', 'Do NOT validate against the Swagger 2.0 schema')
  .option('--no-spec', 'Do NOT validate against the Swagger 2.0 spec')
  .action(function(filename, options) {
    api.validate(filename, options)
      .then(function() {
        console.log(filename, 'is valid');
      })
      .catch(errorHandler);
  });

program.command('bundle <filename>')
  .description('Bundles a multi-file Swagger API into a single file')
  .option('-o, --outfile <filename>', 'The output file')
  .option('-r, --dereference', 'Fully dereference all $ref pointers')
  .option('-f, --format <spaces>', 'Formats the JSON output using the given number of spaces (default is 2)')
  .action(function(filename, options) {
    api.bundle(filename, options)
      .then(function(bundle) {
        if (options.outfile) {
          console.log('Created %s from %s', options.outfile, filename);
        }
        else {
          // Write the bundled API to stdout
          console.log(bundle);
        }
      })
      .catch(errorHandler);
  });

program.command('serve <filename>')
  .description('Serves a Swagger API via the built-in HTTP REST server')
  .option('-p, --port <port>', 'The server port number or socket name')
  .option('-j, --json <basedir>', 'Store REST resources as JSON files under the given directory')
  .action(function(filename, options) {
    api.serve(filename, options)
      .catch(errorHandler);
  });

program
  .version(require('../package').version)
  .option('-d, --debug [filter]', 'Show debug output, optionally filtered (e.g. "*", "swagger:*", etc.)')
  .on('debug', function(filter) {
    process.env.DEBUG = filter || 'swagger:*,json-schema-ref-parser';
  })
  .parse(process.argv);

// Show help if no options were given
if (program.rawArgs.length < 3) {
  program.help();
}

/**
 * Writes error information to stderr and exits with a non-zero code
 *
 * @param {Error} err
 */
function errorHandler(err) {
  console.error(chalk.red(err.stack));
  process.exit(1);
}
