#!/usr/bin/env node
'use strict';

/**
 * Sets up the various CLI commands using Commander
 */

var program = require('commander'),
    chalk   = require('chalk'),
    api     = require('../');

program.version(require('../package').version);

program.command('validate <filename>')
  .description('Validates a Swagger file (and any $referenced files)')
  .option('-R, --no-resolve-refs', 'Do not resolve any $ref pointers')
  .option('-X, --no-external-refs', 'Do not resolve any external $ref pointers')
  .action(function(filename, options) {
    api.validate(filename, options, outputErrorHandler);
  });

program.command('bundle')
  .description('Bundles multiple Swagger files into a single file')
  .option('-d, --dereference', 'Dereference all $ref pointers (not just external ones)')
  .option('-o, --output-file [filename]', 'Output JSON to file name specified')
  .action(function(filename, options) {
    api.bundle(filename, options, outputErrorHandler);
  });

program.command('serve <filename>')
  .description('Serves a Swagger file via a built-in HTTP REST server')
  .option('-p, --port <port>', 'Specify port to run Swagger Server on')
  .option('-f, --file-data-store [basedir]', 'Persist mock data to JSON files instead of in-memory')
  .action(function(filename, options) {
    api.serve(filename, options, outputErrorHandler);
  });

program.parse(process.argv);

function outputErrorHandler(err, data) {
  //the data output is expected to be an array where each index is an output entry
  //that will be written to the console.
  if (data instanceof Array) {
    console.log(data.join('\n'));
    if (err) {
      console.error(chalk.red(err.message));
      process.exit(1);
    }
  }
}
