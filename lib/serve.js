'use strict';

var swaggerServer = require('swagger-server'),
    util          = require('util');

module.exports = function(filename, options, cb) {
  var output = [];
  output.push(util.format('Starting swagger serve with %s', filename));
  var app = swaggerServer(filename);

  var portNumber = options.portNumber || 8000;

  app.listen(portNumber, function(err) {
    if (err) {
      return cb(err, output);
    }

    output.push(util.format('Your REST API is now running at http://localhost:%s\n', portNumber));
    cb(null, output);
  });
};
