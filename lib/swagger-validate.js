'use strict';

var program = require('commander');
var swagger = require('swagger-parser')
var parseOptions = {};

program
  .option('-r, --no-resolve-refs', 'Do not resolve any $ref pointers')
  .option('-d, --no-external-refs', 'Do not resolve any external $ref pointers')
  .option('-e, --no-test$Refs', 'blah blah blah')
  .parse(process.argv);

if(program.args.length === 0) {
  process.stderr('Please specify a swagger file \n');
  process.exit(1);
}

setOptions();
swagger.parse(program.args[0], parseOptions, function(err, api, metadata) {
  if (err) {
    process.stderr.write(err + '\n');
    process.exit(1);
  }
  process.stdout.write(JSON.stringify(metadata) + '\n');
  process.exit(0);
});

function setOptions() {
  if(program.resolveRefs === false) {
    parseOptions.resolve$Refs = false;
  }
  if(program.externalRefs === false) {
    parseOptions.resolveExternal$Refs = false;
  }
}
