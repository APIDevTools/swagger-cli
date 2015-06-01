'use strict';
var swaggerCli = require('../'),
    expect = require('chai').expect,
    sinon  = require('sinon');

describe('swagger-cli', function() {
  it('should export the `sayHello` function', function() {
    expect(swaggerCli.sayHello).to.be.a('function');
  });

  it('should return "hello, world!"', function() {
    expect(swaggerCli.sayHello()).to.equal('hello, world!');
  });

  it('should return a mock response', function() {
    sinon.stub(swaggerCli, 'sayHello').returns('hi there');
    expect(swaggerCli.sayHello()).to.equal('hi there');
    swaggerCli.sayHello.restore();
  });
});
