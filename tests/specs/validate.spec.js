'use strict';
var swaggerCli = require('../'),
    parser     = require('swagger-parser'),
    expect     = require('chai').expect,
    sinon      = require('sinon'),
    cbSpy      = null;

describe('swagger-cli validate command', function() {
  beforeEach(function() {
    //Mock the stderr output so that no actual expected error output gets written to the console
    Object.defineProperty(process, 'stderr', {writable: true});
    process.stderr = {write: function() {}};

    sinon.stub(parser, 'parse');
    var cb = function(error, output) {};
    cbSpy = sinon.spy(cb);
  });

  afterEach(function() {
    //remove existing stub
    parser.parse.restore();
  });

  it('should export the `validate` function', function() {
    expect(swaggerCli.validate).to.be.a('function');
  });

  it('should successfully pass an error object and output to the callback when an invalid file is given', function() {
    var options = {resolveRefs: true, externalRefs: true};

    var myErr = new Error('This is an error');
    parser.parse.callsArgWith(2, myErr);
    swaggerCli.validate('myfakefile.yaml', options, cbSpy);

    sinon.assert.calledOnce(parser.parse);
    sinon.assert.calledWith(parser.parse, 'myfakefile.yaml');
    sinon.assert.calledOnce(cbSpy);

    //Validate that the spy has the expect variables passed into the callback function
    var spyCall = cbSpy.getCall(0);
    expect(spyCall.args[0].message).to.equal('This is an error');
    expect(spyCall.args[1][0]).to.equal('Validating file: myfakefile.yaml');
  });

  it('should write a success message to the callback function when a valid swagger file is given', function() {
    var options = {resolveRefs: true, externalRefs: true};

    var fakeMetadata = {'test': 'test123'};
    parser.parse.callsArgWith(2, '', '', fakeMetadata);
    swaggerCli.validate('myfakefile.yaml', options, cbSpy);

    sinon.assert.calledOnce(parser.parse);
    sinon.assert.calledWith(parser.parse, 'myfakefile.yaml', sinon.match.object);
    sinon.assert.calledOnce(cbSpy);

    //Validate that the spy has the expect variables passed into the callback function
    var spyCall = cbSpy.getCall(0);
    expect(spyCall.args[0]).to.equal(null);
    expect(spyCall.args[1][0]).to.equal('Validating file: myfakefile.yaml');
    expect(spyCall.args[1][1]).to.equal('File validated successfully');
  });

});
