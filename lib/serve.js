'use strict';

var swaggerServer = require('swagger-server'),
    util          = require('util'),
    _             = require('lodash');

//TODO: Swagger resolves for dereference command but won't serve or validate
module.exports = function(filename, options, cb) {
  var output = [];
  output.push(util.format('Starting swagger serve with %s', filename));
  var app = swaggerServer(filename);

  var portNumber = options.portNumber || 8000;

  app.listen(portNumber, function(err) {
    if(err) {
      return cb(err, output);
    }

    output.push('Your REST API is now running at http://localhost:' + portNumber + '\n');
    cb(null, output);
  });
};
