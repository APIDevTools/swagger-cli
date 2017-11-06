'use strict';

var helper = require('../fixtures/helper'),
    expect = require('chai').expect;

describe('swagger validate', function() {
  it('should validate a single-file API', function() {
    var output = helper.run('validate', 'tests/files/valid/simple-api.spec.yaml');
    expect(output.stderr).to.be.empty;
    expect(output.status).to.equal(0);
    expect(output.stdout).to.equal('tests/files/valid/simple-api.spec.yaml is valid\n');
  });
});
