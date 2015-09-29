'use strict';
var swaggerCli = require('../'),
  parser = require('swagger-parser'),
  fs     = require('fs'),
  expect = require('chai').expect,
  sinon  = require('sinon'),
  cbSpy = null;

describe('swagger-cli bundle command', function() {
  beforeEach(function() {
    //Mock the stderr output so that no actual expected error output gets written to the console
    Object.defineProperty(process, 'stderr', {writable: true});
    process.stderr = {write: function() {}};

    sinon.stub(parser, 'parse');
    sinon.stub(fs, 'writeFile');

    var cb = function(error, output) {};
    cbSpy = sinon.spy(cb);
  });

  afterEach(function() {
    //remove existing stub
    parser.parse.restore();
    fs.writeFile.restore();
  });

  it('should export the `bundle` function', function() {
    expect(swaggerCli.bundle).to.be.a('function');
  });

  it('should pass an error to the callback when an invalid file path is given', function() {
    var options = {externalRefs: true};

    var myErr = new Error('This is an error');
    parser.parse.callsArgWith(2, myErr);
    swaggerCli.bundle('myfakefile.yaml', options, cbSpy);

    sinon.assert.calledOnce(parser.parse);
    sinon.assert.calledWith(parser.parse, 'myfakefile.yaml');

    //Validate that the spy has the expect variables passed into the callback function
    var spyCall = cbSpy.getCall(0);
    expect(spyCall.args[0].message).to.equal('This is an error');
    expect(spyCall.args[1][0]).to.equal('Bundling file: myfakefile.yaml');
  });

  it('should successfully write a metadata object to callback when a valid swagger file is given and no -o option',
    function() {
      var options = {externalRefs: true};

      var fakeMetadata = {'test': 'test123'};
      parser.parse.callsArgWith(2, '', '', fakeMetadata);
      swaggerCli.bundle('myfakefile.yaml', options, cbSpy);

      sinon.assert.calledOnce(parser.parse);
      sinon.assert.calledWith(parser.parse, 'myfakefile.yaml', sinon.match.object);

      //Validate that the spy has the expect variables passed into the callback function
      var spyCall = cbSpy.getCall(0);
      expect(spyCall.args[0]).to.equal(null);
      expect(spyCall.args[1][0]).to.equal('Bundling file: myfakefile.yaml');
      expect(spyCall.args[1][1]).to.equal('File parsed successfully');
      expect(spyCall.args[1][2]).to.equal(JSON.stringify(fakeMetadata));
    }
  );

  it('should successfully write a metadata object to the specified file when the outputFile option is set', function() {
    var options = {externalRefs: true, outputFile: 'test.js'};

    var fakeMetaData = {test: 'this'};

    parser.parse.callsArgWith(2, '', '', fakeMetaData);
    fs.writeFile.callsArgWith(2, '');
    swaggerCli.bundle('myfakefile.yaml', options, cbSpy);

    sinon.assert.calledOnce(parser.parse);
    sinon.assert.calledWith(parser.parse, 'myfakefile.yaml', sinon.match.object);

    var spyCall = cbSpy.getCall(0);
    expect(spyCall.args[0]).to.equal(null);
    expect(spyCall.args[1][0]).to.equal('Bundling file: myfakefile.yaml');
    expect(spyCall.args[1][1]).to.equal('File parsed successfully');
    expect(spyCall.args[1][2]).to.equal('Writing parsed data to file test.js');
    expect(spyCall.args[1][3]).to.equal('Parsed data successfully written to file');
  });

  it('should write an error to the callback when a specified file to write the metadata results to fails', function() {
    var options = {externalRefs: true, outputFile: 'test.js'};

    var fakeMetaData = {test: 'this'};
    var error = new Error('this is an error');

    parser.parse.callsArgWith(2, '', '', fakeMetaData);
    fs.writeFile.callsArgWith(2, error);
    swaggerCli.bundle('myfakefile.yaml', options, cbSpy);

    sinon.assert.calledOnce(parser.parse);
    sinon.assert.calledWith(parser.parse, 'myfakefile.yaml', sinon.match.object);

    var spyCall = cbSpy.getCall(0);
    expect(spyCall.args[0].message).to.equal('this is an error');
    expect(spyCall.args[1][0]).to.equal('Bundling file: myfakefile.yaml');
  });

});
