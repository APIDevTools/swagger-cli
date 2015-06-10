#!/usr/bin/env node
'use strict';

var program = require('commander'),
    chalk   = require('chalk'),
    api     = require('../');

program.version(require('../package').version);

program.command('validate <filename>')
  .description('Parses and validates a Swagger file')
  .option('-R, --no-resolve-refs', 'Do not resolve any $ref pointers')
  .option('-X, --no-external-refs', 'Do not resolve any external $ref pointers')
  .action(function(filename, options) {
    api.validate(filename, options, outputErrorHandler);
  });

program.command('dereference')
  .description('Dereferences all $ref pointers in a Swagger file')
  .option('-D, --no-external-refs', 'Do not resolve any external $ref pointers')
  .option('-o, --output-file [filename]', 'Output JSON to file name specified')
  .action(function(filename, options) {
    api.dereference(filename, options, outputErrorHandler);
  });

// DOESN'T EXIST YET
// Output the dereferenced JSON to stdout, exit code 0
// If -o, --output <filename> is specified, then output JSON to that file
// Output errors to stderr, exit code 2
//program.command('bundle', 'Bundles multiple Swagger files into a single file')

program.command('serve <filename>')
  .description('Serves a Swagger file via a built-in HTTP REST server')
  .option('-u, --no-ui', 'Launch swagger server with no UI')
  .option('-m, --no-mocks', 'Launch server without any mocks')
  .option('-p, --port-number <portnumber>', 'specify port to run Swagger Server on')
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
