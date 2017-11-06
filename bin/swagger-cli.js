#!/usr/bin/env node
'use strict';

let program = require('commander'),
    chalk = require('chalk'),
    api = require('../');

program.command('validate <filename>')
  .description('Validates a Swagger API against the Swagger 2.0 schema and spec')
  .option('--no-schema', 'Do NOT validate against the Swagger 2.0 schema')
  .option('--no-spec', 'Do NOT validate against the Swagger 2.0 spec')
  .action((filename, options) => {
    api.validate(filename, options)
      .then(() => {
        console.log(filename, 'is valid');
      })
      .catch(errorHandler);
  });

program.command('bundle <filename>')
  .description('Bundles a multi-file Swagger API into a single file')
  .option('-o, --outfile <filename>', 'The output file')
  .option('-r, --dereference', 'Fully dereference all $ref pointers')
  .option('-f, --format <spaces>', 'Formats the JSON output using the given number of spaces (default is 2)')
  .action((filename, options) => {
    api.bundle(filename, options)
      .then((bundle) => {
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

program
  .version(require('../package').version)
  .option('-d, --debug [filter]', 'Show debug output, optionally filtered (e.g. "*", "swagger:*", etc.)')
  .on('debug', (filter) => {
    process.env.DEBUG = filter || 'swagger:*,json-schema-ref-parser';
  })
  .parse(process.argv);

// Show help if no options were given
if (program.rawArgs.length < 4) {
  program.help();
}

/**
 * Writes error information to stderr and exits with a non-zero code
 *
 * @param {Error} err
 */
function errorHandler (err) {
  console.error(chalk.red(err.stack));
  process.exit(1);
}
