'use strict';

const helper = require('../fixtures/helper');
const expect = require('chai').expect;

describe('swagger-cli validate', () => {

  it('should validate a single-file API', () => {
    let output = helper.run('validate', 'test/files/valid/simple-api.spec.yaml');

    expect(output.stderr).to.be.empty;
    expect(output.status).to.equal(0);
    expect(output.stdout).to.equal('test/files/valid/simple-api.spec.yaml is valid\n');
  });

  it('should validate a multi-file API', () => {
    let output = helper.run('validate', 'test/files/valid/external-refs.spec.yaml');

    expect(output.stderr).to.be.empty;
    expect(output.status).to.equal(0);
    expect(output.stdout).to.equal('test/files/valid/external-refs.spec.yaml is valid\n');
  });

  it('should validate an API with circular references', () => {
    let output = helper.run('validate', 'test/files/valid/circular-api.spec.yaml');

    expect(output.stderr).to.be.empty;
    expect(output.status).to.equal(0);
    expect(output.stdout).to.equal('test/files/valid/circular-api.spec.yaml is valid\n');
  });

  it('should fail validation if a $ref is invalid', () => {
    let output = helper.run('validate', 'test/files/invalid/bad-ref.spec.yaml');

    expect(output.stdout).to.be.empty;
    expect(output.status).to.equal(1);
    expect(output.stderr).to.equal(
      'Error resolving $ref pointer "test/files/invalid/bad-ref.spec.yaml#/definitions/person". \n' +
      'Token "definitions" does not exist.\n'
    );
  });

  it('should fail validation if a referenced file does not exist', () => {
    let output = helper.run('validate', 'test/files/invalid/external-refs.spec.yaml');

    expect(output.stdout).to.be.empty;
    expect(output.status).to.equal(1);
    expect(output.stderr).to.equal(
      'Error opening file "test/files/invalid/address.yaml" \n' +
      "ENOENT: no such file or directory, open 'test/files/invalid/address.yaml'\n"
    );
  });

  it('should output the full error stack in debug mode', () => {
    let output = helper.run('--debug', 'validate', 'test/files/invalid/external-refs.spec.yaml');

    expect(output.stdout).not.to.be.empty;
    expect(output.status).to.equal(1);
    expect(output.stderr).to.include(
      'Error opening file "test/files/invalid/address.yaml" \n' +
      "ENOENT: no such file or directory, open 'test/files/invalid/address.yaml'\n"
    );
    expect(output.stderr).to.include('at ReadFileContext');
  });

});
