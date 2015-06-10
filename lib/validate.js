'use strict';

var parser = require('swagger-parser'),
    util   = require('util'),
    chalk  = require('chalk');

module.exports = function validate(filename, options, cb) {
  var output = [];
  output.push(util.format('Validating file: %s', filename));
  //console.log('filename: %s\noptions: %s', filename, JSON.stringify(_.omit(options, 'parent'), null, 2));
  parser.parse(filename, {resolve$Refs: options.resolveRefs, external$Refs: options.externalRefs},
    function(err) {
      if (err) {
        return cb(err, output);
      }

      output.push(chalk.green('File validated successfully'));
      cb(null, output);
    }
  );
};
