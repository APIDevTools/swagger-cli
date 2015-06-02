#!/usr/bin/env node
var program = require('commander');
var parser = require('swagger-parser');

//TODO: Unit Tests
//TODO: Comments
program
  .version('1.0.0-beta')
  //default parse, all default parse options are set to true
  //options to give user --> --no-resolve-$refs, --no-external-$refs -->
  // Output validation success to stdout, exit code 0
  // Output validation errors to stderr, exit code 1
  .command('validate', 'Parses and validates a Swagger file')

  //turn off validateSchema and strictValidation
  // options to give user --> --no-external-$refs
  // Output the dereferenced JSON to stdout, exit code 0
  // If -o, --outfile <filename> is specified, then output JSON to that file
  // Output errors to stderr, exit code 2
  .command('dereference', 'Dereferences all $ref pointers in a Swagger file')

  // DOESN'T EXIST YET
  // Output the dereferenced JSON to stdout, exit code 0
  // If -o, --output <filename> is specified, then output JSON to that file
  // Output errors to stderr, exit code 2
  .command('bundle', 'Bundles multiple Swagger files into a single file')

  //regular Swagger Serve, options to give to user?
  // options to give user --> --no-ui, --no-mocks
  // stdio inherit
  // exit code inherit
  .command('serve', 'Serves a Swagger file via a built-in HTTP REST server')
  .parse(process.argv);
