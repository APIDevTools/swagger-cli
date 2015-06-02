#!/usr/bin/env node
'use strict';

var program = require('commander'),
    api     = require('../');

//TODO: Unit Tests
//TODO: Comments
program.version(require('../package').version);

//default parse, all default parse options are set to true
//options to give user --> --no-resolve-$refs, --no-external-$refs -->
// Output validation success to stdout, exit code 0
// Output validation errors to stderr, exit code 1
program.command('validate <filename>')
  .description('Parses and validates a Swagger file')
  .option('-R, --no-resolve-refs', 'Do not resolve any $ref pointers')
  .option('-X, --no-external-refs', 'Do not resolve any external $ref pointers')
  .action(api.validate);

//turn off validateSchema and strictValidation
// options to give user --> --no-external-$refs
// Output the dereferenced JSON to stdout, exit code 0
// If -o, --outfile <filename> is specified, then output JSON to that file
// Output errors to stderr, exit code 2
program.command('dereference')
  .description('Dereferences all $ref pointers in a Swagger file')
  .option('-d, --no-external-refs', 'Do not resolve any external $ref pointers')
  .option('-o, --output-file [filename]', 'Output JSON to file name specified');

// DOESN'T EXIST YET
// Output the dereferenced JSON to stdout, exit code 0
// If -o, --output <filename> is specified, then output JSON to that file
// Output errors to stderr, exit code 2
program.command('bundle', 'Bundles multiple Swagger files into a single file')

//regular Swagger Serve, options to give to user?
// options to give user --> --no-ui, --no-mocks
// stdio inherit
// exit code inherit
program.command('serve')
  .description('Serves a Swagger file via a built-in HTTP REST server')
  .option('-u, --no-ui', 'Launch swagger server with no UI')
  .option('-m, --no-mocks', 'Launch server without any mocks')
  .option('-p, --port-number <portnumber>', 'specify port to run Swagger Server on');

program.parse(process.argv);
