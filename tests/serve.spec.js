'use strict';
var expect  = require('chai').expect,
    sinon   = require('sinon'),
    mockery = require('mockery'),
    swaggerCli = null,
    cbSpy   = null,
    appStub = null,
    app     = null;

describe('swagger-cli serve command', function() {
  beforeEach(function() {

    app = { listen: function() {} };
    appStub = sinon.stub(app, 'listen');

    var swaggerServerMock = function() {
      return app;
    };

    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    mockery.registerMock('swagger-server', swaggerServerMock);

    swaggerCli = require('../');

    var cb = function(error, output) {};
    cbSpy = sinon.spy(cb);
  });

  afterEach(function() {
    //appMock.restore();
    app.listen.restore()
  });

  it('should export the `dereference` function', function() {
    expect(swaggerCli.serve).to.be.a('function');
  });

  it('should set the portNumber variable when the portNumber option is set', function() {

    var options = {portNumber : 1234};

    //app.listen.callsArgWith(1);
    swaggerCli.serve('fakefile.yaml', options, cbSpy);

    //appMock.expects('listen').once();
    //appMock.verify();
    sinon.assert.calledOnce(app.listen);
    sinon.assert.calledWith(app.listen, 1234);
  });

  it('should set the default port number to 8000 when no portNumber options is set', function() {
    swaggerCli.serve('fakefile.yaml', {}, cbSpy);

    sinon.assert.calledOnce(app.listen);
    sinon.assert.calledWith(app.listen, 8000);
  });

  it('should set the default port number to 8000 when no portNumber options is set', function() {
    swaggerCli.serve('fakefile.yaml', {}, cbSpy);

    sinon.assert.calledOnce(app.listen);
    sinon.assert.calledWith(app.listen, 8000);
  });

  it('app.listen should call the callback function with an error if one occurs on the listen call', function() {
    var myErr = new Error('This is an error');
    app.listen.callsArgWith(1, myErr);
    swaggerCli.serve('fakefile.yaml', {}, cbSpy);

    var spyCall = cbSpy.getCall(0);
    expect(spyCall.args[0].message).to.equal('This is an error');
    expect(spyCall.args[1][0]).to.equal('Starting swagger serve with fakefile.yaml');
    sinon.assert.calledOnce(cbSpy);
  });

  it('app.listen should call the callback function with successful output when a valid swagger file is used', function() {
    app.listen.callsArgWith(1, null);
    swaggerCli.serve('fakefile.yaml', {}, cbSpy);

    var spyCall = cbSpy.getCall(0);
    expect(spyCall.args[0]).to.equal(null);
    expect(spyCall.args[1][0]).to.equal('Starting swagger serve with fakefile.yaml');
    expect(spyCall.args[1][1]).to.equal('Your REST API is now running at http://localhost:8000\n');
    sinon.assert.calledOnce(cbSpy);
  });
});
