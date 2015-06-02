'use strict';

var program = require('commander');
var swaggerServer = require('swagger-server');

program
  .option('-u, --no-ui', 'Launch swagger server with no UI')
  .option('-m, --no-mocks', 'Launch server without any mocks')
  .option('-p, --port-number [portnumber]', 'specify port to run Swagger Server on')
  .parse(process.argv);

if(program.args.length === 0) {
  process.stderr('Please specify a swagger file \n');
  process.exit(1);
}

var app = swaggerServer(program.args[0]);

var portNumber = program.ports || 8000;

app.listen(portNumber, function() {
  console.log('Your REST API is now running at http://localhost:8000');
});

