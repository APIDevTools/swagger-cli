'use strict';

var program = require('commander');
var swagger = require('swagger-parser');
var fs = require('fs');
var parseOptions = {};

program
  .option('-d, --no-external-refs', 'Do not resolve any external $ref pointers')
  .option('-o, --output-file [filename]', 'Output JSON to file name specified')
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
  //Check to see if an outputFile was specified, else output to terminal
  if(program.outputFile){
    fs.writeFile(program.outputFile, JSON.stringify(metadata), function(err){
      if(err) {
        process.stderr.write(err + '\n');
        process.exit(1);
      }
      process.exit(0);
    });
  }
  else {
    process.stdout.write(JSON.stringify(metadata) + '\n');
    process.exit(0);
  }
});

function setOptions() {
  if(program.resolveRefs === false) {
    parseOptions.resolve$Refs = false;
  }
}

