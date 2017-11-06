'use strict';

let helper = require('../fixtures/helper'),
    expect = require('chai').expect;

describe('swagger-cli validate', function () {
  it('should validate a single-file API', function () {
    let output = helper.run('validate', 'test/files/valid/simple-api.spec.yaml');
    expect(output.stderr).to.be.empty;
    expect(output.status).to.equal(0);
    expect(output.stdout).to.equal('test/files/valid/simple-api.spec.yaml is valid\n');
  });
});
