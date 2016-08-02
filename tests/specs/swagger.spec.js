'use strict';
var fs = require('fs'),
  os     = require('os'),
  expect = require('chai').expect,
  path   = require('path'),
  _      = require('lodash'),
  execSync = require('child_process').execSync,
  swaggerCmd = 'node ' + path.resolve(__dirname, '..', 'bin', 'swagger.js');

describe('swagger-cli commands', function() {

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

  it('running the \'swagger bundle\' command on a valid swagger file passes successfully', function() {
    var returnBuffer = execSync(swaggerCmd + ' bundle tests/swaggerSample/swagger.yaml');
    var outputArray = returnBuffer.toString().split('\n');
    outputArray = _.dropRight(outputArray);

    var successDereference = null;
    if (os.platform() === 'darwin') {
      successDereference = require('./swaggerSample/testFiles/successBundleDarwin.json');
    }
    else {
      successDereference = require('./swaggerSample/testFiles/successBundleWin32.json');
    }
    expect(outputArray[0]).to.equal('Bundling file: tests/swaggerSample/swagger.yaml');
    expect(outputArray[1]).to.equal('File parsed successfully');
    //Will only compare the $refs property, file comparisons differ between Windows and Linux environments
    expect(JSON.parse(outputArray[2]).$refs).to.deep.equal(successDereference.$refs);
  });

  it('running the \'swagger bundle -d\' command on a valid swagger file passes successfully', function() {
    var returnBuffer = execSync('swagger bundle -d tests/swaggerSample/swagger.yaml');
    var outputArray = returnBuffer.toString().split('\n');
    outputArray = _.dropRight(outputArray);

    var successDereference = null;

    if (os.platform() === 'darwin') {
      successDereference = require('./swaggerSample/testFiles/dereferenceInternalRefsBundleDarwin.json');
    }
    else {
      successDereference = require('./swaggerSample/testFiles/dereferenceInternalRefsBundleWin32.json');
    }

    expect(outputArray[0]).to.equal('Bundling file: tests/swaggerSample/swagger.yaml');
    expect(outputArray[1]).to.equal('File parsed successfully');
    //Will only compare the $refs property, file comparisons differ between Windows and Linux environments
    expect(JSON.parse(outputArray[2]).$refs).to.deep.equal(successDereference.$refs);
  });

  it('running the \'swagger bundle -o\' command on a valid swagger file outputs metadata to designated file',
    function() {
      //remove potential leftover testfile from previous failed test
      if (fs.existsSync('tests/swaggerSample/test.json')) {
        fs.unlinkSync('tests/swaggerSample/test.json');
      }

      var returnBuf = execSync('swagger bundle -o tests/swaggerSample/test.json tests/swaggerSample/swagger.yaml');
      var outputArray = returnBuf.toString().split('\n');
      outputArray = _.dropRight(outputArray);

      expect(outputArray).to.deep.equal([
        'Bundling file: tests/swaggerSample/swagger.yaml',
        'File parsed successfully',
        'Writing parsed data to file tests/swaggerSample/test.json',
        'Parsed data successfully written to file'
      ]);

      var successDereference = null;
      if (os.platform() === 'darwin') {
        successDereference = require('./swaggerSample/testFiles/successBundleDarwin.json');
      }
      else {
        successDereference = require('./swaggerSample/testFiles/successBundleWin32.json');
      }
      expect(require('./swaggerSample/test.json').$refs).to.deep.equal(successDereference.$refs);

      //remove potential
      fs.unlinkSync('tests/swaggerSample/test.json');
    }
  );

  it('running the \'swagger bundle -j\' command removes json schema parts that swagger can\'t handle', function() {
    //remove potential leftover testfile from previous failed test
    if (fs.existsSync('tests/swaggerSample/test.json')) {
      fs.unlinkSync('tests/swaggerSample/test.json');
    }
    
    //Bundle the file while specifying -j to remove json-schema parts
    var returnBuf = execSync('swagger bundle -j -o tests/swaggerSample/test.json tests/swaggerSample/swagger-with-schema.json');
    var outputArray = returnBuf.toString().split('\n');
    outputArray = _.dropRight(outputArray);
    
    //Command should run successfully
    expect(outputArray).to.deep.equal([
      'Bundling file: tests/swaggerSample/swagger.yaml',
      'File parsed successfully',
      'Writing parsed data to file tests/swaggerSample/test.json',
      'Parsed data successfully written to file'
    ]);

    //Now validate the resulting file to ensure the troublesome json-schema parts don't result in errors
    var returnBuffer = execSync(swaggerCmd + ' validate tests/swaggerSample/test.json');
    var outputArray = returnBuffer.toString().split('\n');

    outputArray = _.dropRight(outputArray);

    expect(outputArray).to.deep.equal([
      'Validating file: tests/swaggerSample/test.yaml',
      'File validated successfully'
    ]);
  });

  it('running the \'swagger bundle\' command on an invalid swagger file produces the expected error', function() {
    var errorMessageArray = [];
    try {
      //Run with improper file
      execSync('swagger bundle tests/swaggerSamplle/slaggeas');
    }
    catch (error) {
      errorMessageArray = error.message.split('\n');
    }
    expect(errorMessageArray[0]).to.equal('Command failed: swagger bundle tests/swaggerSamplle/slaggeas');
  });

});

