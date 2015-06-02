'use strict';

var parser = require('swagger-parser'),
    _      = require('lodash');

module.exports = function validate(filename, options) {
  console.log('filename: %s\noptions: %s', filename, JSON.stringify(_.omit(options, 'parent'), null, 2));
  //parser.parse(filename, {resolve$Refs: options.resolveRefs, external$Refs: options.externalRefs}, function(err, api, metadata) {
  //  if (err) {
  //    process.stderr.write(err + '\n');
  //    process.exit(1);
  //  }
  //  process.stdout.write(JSON.stringify(metadata) + '\n');
  //  process.exit(0);
  //});
};
