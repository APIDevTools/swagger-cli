'use strict';
var swaggerCli = require('../'),
  fs     = require('fs'),
  expect = require('chai').expect,
  sinon  = require('sinon'),
  execSync = require('child_process').execSync,
  cbSpy = null;

describe('swagger-cli dereference command', function() {

  before(function() {
    //TODO: This feels like bad practice, ask James what the best way to make sure the command line has the 'swagger bits installed'
    execSync('npm link');
  });

  after(function() {
    execSync('npm unlink');
  });

  it('running the \'swagger validate\' command on a valid swagger file passes successfully', function() {
    var returnBuffer = execSync('swagger validate tests/swaggerSample/swagger.yaml');
    var outputArray = returnBuffer.toString().split('\n');
    expect(outputArray[0]).to.equal('Validating file: tests/swaggerSample/swagger.yaml');
    expect(outputArray[1]).to.equal('File validated successfully');
  });

  it('running the \'swagger validate -R\' command on a valid swagger file passes successfully', function() {
    var returnBuffer = execSync('swagger validate -R tests/swaggerSample/swagger.yaml');
    var outputArray = returnBuffer.toString().split('\n');
    expect(outputArray[0]).to.equal('Validating file: tests/swaggerSample/swagger.yaml');
    expect(outputArray[1]).to.equal('File validated successfully');
  });

  it('running the \'swagger validate -X\' command on a valid swagger file passes successfully', function() {
    var returnBuffer = execSync('swagger validate -R tests/swaggerSample/swagger.yaml');
    var outputArray = returnBuffer.toString().split('\n');
    expect(outputArray[0]).to.equal('Validating file: tests/swaggerSample/swagger.yaml');
    expect(outputArray[1]).to.equal('File validated successfully');
  });

  it('running the \'swagger validate\' command on an invalid swagger file produces the expected error', function() {
    var errorMessageArray = [];
    try {
      //Run with improper file
      execSync('swagger validate tests/swaggerSamplle/slaggeas');
    }
    catch(error) {
      errorMessageArray = error.message.split('\n');
    }
    expect(errorMessageArray[0]).to.equal('Command failed: swagger validate tests/swaggerSamplle/slaggeas');
  });

  it('running the \'swagger dereference\' command on a valid swagger file passes successfully', function() {
    var returnBuffer = execSync('swagger dereference tests/swaggerSample/swagger.yaml');
    var outputArray = returnBuffer.toString().split('\n');
    expect(outputArray[0]).to.equal('Dereferencing file: tests/swaggerSample/swagger.yaml');
    expect(outputArray[1]).to.equal('File parsed successfully');
    expect(outputArray[2]).to.equal('[object Object]');
  });

  it('running the \'swagger dereference -D\' command on a valid swagger file passes successfully', function() {
    var returnBuffer = execSync('swagger dereference -D tests/swaggerSample/swagger.yaml');
    var outputArray = returnBuffer.toString().split('\n');
    expect(outputArray[0]).to.equal('Dereferencing file: tests/swaggerSample/swagger.yaml');
    expect(outputArray[1]).to.equal('File parsed successfully');
    expect(outputArray[2]).to.equal('[object Object]');
  });

  it('running the \'swagger dereference -o\' command on a valid swagger file outputs metadata to designated file', function() {
    //remove leftover testfile
    if(fs.existsSync('tests/swaggerSample/test.json')) {
      fs.unlinkSync('tests/swaggerSample/test.json');
    }

    var returnBuffer = execSync('swagger dereference -o tests/swaggerSample/test.json tests/swaggerSample/swagger.yaml');
    var outputArray = returnBuffer.toString().split('\n');
    expect(outputArray[0]).to.equal('Dereferencing file: tests/swaggerSample/swagger.yaml');
    expect(outputArray[1]).to.equal('File parsed successfully');
    expect(outputArray[2]).to.equal('Writing parsed data to file tests/swaggerSample/test.json');

    expect(fs.existsSync('tests/swaggerSample/test.json')).to.equal(true);

    fs.unlinkSync('tests/swaggerSample/test.json');
  });

  it('running the \'swagger dereference\' command on an invalid swagger file produces the expected error', function() {
    var errorMessageArray = [];
    try {
      //Run with improper file
      execSync('swagger dereference tests/swaggerSamplle/slaggeas');
    }
    catch(error) {
      errorMessageArray = error.message.split('\n');
    }
    expect(errorMessageArray[0]).to.equal('Command failed: swagger dereference tests/swaggerSamplle/slaggeas');
  });

});
