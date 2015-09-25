#!/usr/bin/env node
'use strict';

var program = require('commander'),
    chalk   = require('chalk'),
    api     = require('../');

program.version(require('../package').version);

program.command('validate <filename>')
  .description('Validates a Swagger API against the Swagger 2.0 schema and spec')
  .option('--no-schema', 'Do NOT validate against the Swagger 2.0 schema')
  .option('--no-spec', 'Do NOT validate against the Swagger 2.0 spec')
  .action(function(filename, options) {
    api.validate(filename, options, outputErrorHandler);
  });

program.command('bundle')
  .description('Bundles a multi-file Swagger API into a single file')
  .option('-o, --output-file <filename>', 'The output file')
  .option('-d, --dereference', 'Fully dereference all $ref pointers')
  .action(function(filename, options) {
    api.bundle(filename, options, outputErrorHandler);
  });

program.command('serve <filename>')
  .description('Serves a Swagger API via the built-in HTTP REST server')
  .option('-p, --port <port>', 'The server port number or socket name')
  .option('-j, --json <basedir>', 'Store REST resources as JSON files under the given directory')
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
