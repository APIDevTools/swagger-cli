'use strict';
var expect  = require('chai').expect,
    sinon   = require('sinon'),
    mockery = require('mockery'),
    swaggerCli = null,
    cbSpy   = null,
    appStub = null,
    appMock = null,
    app     = null;

describe('swagger-cli serve command', function() {
  beforeEach(function() {

    //TODO: Turn this into a mock?
    app = { listen: function() {} };
    appStub = sinon.stub(app, 'listen');

    //Mock attempt
    //app = {
    //  listen: function(portNum , cb) {
    //    cb('This is an error');
    //  }
    //};
    //
    //appMock = sinon.mock(app);

    var swaggerServerMock = function() {
      return app;
    };

    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    mockery.registerMock('swagger-server', swaggerServerMock);
    //mockery.registerMock('swagger-server', swaggerServerMock);

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

  //it('should set the default port number to 8000 when no portNumber options is set', function() {
  //  swaggerCli.serve('fakefile.yaml', {}, cbSpy);
  //
  //  sinon.assert.calledOnce(app.listen);
  //  sinon.assert.calledWith(app.listen, 8000);
  //});

});
