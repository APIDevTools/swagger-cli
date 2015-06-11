'use strict';
var fs = require('fs'),
  os     = require('os'),
  expect = require('chai').expect,
  path   = require('path'),
  _      = require('lodash'),
  execSync = require('child_process').execSync,
  swaggerCmd = 'node ' + path.resolve(__dirname, '..', 'bin', 'swagger.js');

describe('swagger-cli dereference command', function() {

  it('running the \'swagger validate\' command on a valid swagger file passes successfully', function() {
    var returnBuffer = execSync(swaggerCmd + ' validate tests/swaggerSample/swagger.yaml');
    var outputArray = returnBuffer.toString().split('\n');

    outputArray = _.dropRight(outputArray);

    expect(outputArray).to.deep.equal([
      'Validating file: tests/swaggerSample/swagger.yaml',
      'File validated successfully'
    ]);
  });

  it('running the \'swagger validate -R\' command on a valid swagger file passes successfully', function() {
    var returnBuffer = execSync(swaggerCmd + ' validate -R tests/swaggerSample/swagger.yaml');
    var outputArray = returnBuffer.toString().split('\n');
    outputArray = _.dropRight(outputArray);

    expect(outputArray).to.deep.equal([
      'Validating file: tests/swaggerSample/swagger.yaml',
      'File validated successfully'
    ]);
  });

  it('running the \'swagger validate -X\' command on a valid swagger file passes successfully', function() {
    var returnBuffer = execSync(swaggerCmd + ' validate -R tests/swaggerSample/swagger.yaml');
    var outputArray = returnBuffer.toString().split('\n');
    outputArray = _.dropRight(outputArray);

    expect(outputArray).to.deep.equal([
      'Validating file: tests/swaggerSample/swagger.yaml',
      'File validated successfully'
    ]);
  });

  it('running the \'swagger validate\' command on an invalid swagger file produces the expected error', function() {
    var errorMessageArray = [];
    try {
      //Run with improper file
      execSync(swaggerCmd + ' validate tests/swaggerSamplle/slaggeas');
    }
    catch (error) {
      errorMessageArray = error.message.split('\n');
    }
    expect(errorMessageArray[0]).to.equal('Command failed: ' + swaggerCmd + ' validate tests/swaggerSamplle/slaggeas');
  });

  it('running the \'swagger dereference\' command on a valid swagger file passes successfully', function() {
    var returnBuffer = execSync(swaggerCmd + ' dereference tests/swaggerSample/swagger.yaml');
    var outputArray = returnBuffer.toString().split('\n');
    outputArray = _.dropRight(outputArray);

    var successDereference = null;
    if (os.platform() === 'darwin') {
      successDereference = require('./swaggerSample/testFiles/successDereferenceDarwin.json');
    }
    else {
      successDereference = require('./swaggerSample/testFiles/successDereferenceWin32.json');
    }
    expect(outputArray[0]).to.equal('Dereferencing file: tests/swaggerSample/swagger.yaml');
    expect(outputArray[1]).to.equal('File parsed successfully');
    //Will only compare the $refs property, file comparisons differ between Windows and Linux environments
    expect(JSON.parse(outputArray[2]).$refs).to.deep.equal(successDereference.$refs);
  });

  it('running the \'swagger dereference -D\' command on a valid swagger file passes successfully', function() {
    var returnBuffer = execSync('swagger dereference -D tests/swaggerSample/swagger.yaml');
    var outputArray = returnBuffer.toString().split('\n');
    outputArray = _.dropRight(outputArray);

    var successDereference = null;

    if (os.platform() === 'darwin') {
      successDereference = require('./swaggerSample/testFiles/noExternalDereferenceDarwin.json');
    }
    else {
      successDereference = require('./swaggerSample/testFiles/noExternalDereferenceWin32.json');
    }

    expect(outputArray[0]).to.equal('Dereferencing file: tests/swaggerSample/swagger.yaml');
    expect(outputArray[1]).to.equal('File parsed successfully');
    //Will only compare the $refs property, file comparisons differ between Windows and Linux environments
    expect(JSON.parse(outputArray[2]).$refs).to.deep.equal(successDereference.$refs);
  });

  it('running the \'swagger dereference -o\' command on a valid swagger file outputs metadata to designated file',
    function() {
      //remove potential leftover testfile from previous failed test
      if (fs.existsSync('tests/swaggerSample/test.json')) {
        fs.unlinkSync('tests/swaggerSample/test.json');
      }

      var returnBuf = execSync('swagger dereference -o tests/swaggerSample/test.json tests/swaggerSample/swagger.yaml');
      var outputArray = returnBuf.toString().split('\n');
      outputArray = _.dropRight(outputArray);

      expect(outputArray).to.deep.equal([
        'Dereferencing file: tests/swaggerSample/swagger.yaml',
        'File parsed successfully',
        'Writing parsed data to file tests/swaggerSample/test.json',
        'Parsed data successfully written to file'
      ]);

      var successDereference = null;
      if (os.platform() === 'darwin') {
        successDereference = require('./swaggerSample/testFiles/successDereferenceDarwin.json');
      }
      else {
        successDereference = require('./swaggerSample/testFiles/successDereferenceWin32.json');
      }
      expect(require('./swaggerSample/test.json').$refs).to.deep.equal(successDereference.$refs);

      //remove potential
      fs.unlinkSync('tests/swaggerSample/test.json');
    }
  );

  it('running the \'swagger dereference\' command on an invalid swagger file produces the expected error', function() {
    var errorMessageArray = [];
    try {
      //Run with improper file
      execSync('swagger dereference tests/swaggerSamplle/slaggeas');
    }
    catch (error) {
      errorMessageArray = error.message.split('\n');
    }
    expect(errorMessageArray[0]).to.equal('Command failed: swagger dereference tests/swaggerSamplle/slaggeas');
  });

});

