'use strict';

const helper = require('../fixtures/helper');
const expect = require('chai').expect;

describe('swagger-cli validate', () => {

  it('should validate a single-file API', () => {
    let output = helper.run('validate', 'test/files/valid/single-file/api.yaml');

    expect(output.stderr).to.be.empty;
    expect(output.status).to.equal(0);
    expect(output.stdout).to.equal('test/files/valid/single-file/api.yaml is valid\n');
  });

  it('should validate a multi-file API', () => {
    let output = helper.run('validate', 'test/files/valid/multi-file/api.yaml');

    expect(output.stderr).to.be.empty;
    expect(output.status).to.equal(0);
    expect(output.stdout).to.equal('test/files/valid/multi-file/api.yaml is valid\n');
  });

  it('should validate an API with circular references', () => {
    let output = helper.run('validate', 'test/files/valid/circular-refs/api.yaml');

    expect(output.stderr).to.be.empty;
    expect(output.status).to.equal(0);
    expect(output.stdout).to.equal('test/files/valid/circular-refs/api.yaml is valid\n');
  });

  it('should fail validation against the Swagger 2.0 schema', () => {
    let output = helper.run('validate', 'test/files/invalid/schema/api.yaml');

    expect(output.stdout).to.be.empty;
    expect(output.status).to.equal(1);
    expect(output.stderr).to.include('Swagger schema validation failed.');
  });

  it('should skip validation against the Swagger 2.0 schema', () => {
    let output = helper.run('validate', '--no-schema', 'test/files/invalid/schema/api.yaml');

    expect(output.stderr).to.be.empty;
    expect(output.status).to.equal(0);
    expect(output.stdout).to.include('test/files/invalid/schema/api.yaml is valid\n');
  });

  it('should fail validation against the Swagger 2.0 specification', () => {
    let output = helper.run('validate', 'test/files/invalid/spec/api.yaml');

    expect(output.stdout).to.be.empty;
    expect(output.status).to.equal(1);
    expect(output.stderr).to.equal('Validation failed. /paths/people/{name}/get is missing path parameter(s) for {name}\n');
  });

  it('should skip validation against the Swagger 2.0 specification', () => {
    let output = helper.run('validate', '--no-spec', 'test/files/invalid/spec/api.yaml');

    expect(output.stderr).to.be.empty;
    expect(output.status).to.equal(0);
    expect(output.stdout).to.include('test/files/invalid/spec/api.yaml is valid\n');
  });

  it('should fail validation if a $ref is invalid', () => {
    let output = helper.run('validate', 'test/files/invalid/internal-ref/api.yaml');

    expect(output.stdout).to.be.empty;
    expect(output.status).to.equal(1);
    expect(output.stderr).to.equal(
      'Error resolving $ref pointer "test/files/invalid/internal-ref/api.yaml#/definitions/person". \n' +
      'Token "definitions" does not exist.\n'
    );
  });

  it('should fail validation if a referenced file does not exist', () => {
    let output = helper.run('validate', 'test/files/invalid/external-ref/api.yaml');

    expect(output.stdout).to.be.empty;
    expect(output.status).to.equal(1);
    expect(output.stderr).to.equal(
      'Error opening file "test/files/invalid/external-ref/address.yaml" \n' +
      "ENOENT: no such file or directory, open 'test/files/invalid/external-ref/address.yaml'\n"
    );
  });

  it('should output the full error stack in debug mode', () => {
    let output = helper.run('--debug', 'validate', 'test/files/invalid/external-ref/api.yaml');

    expect(output.stdout).not.to.be.empty;
    expect(output.status).to.equal(1);
    expect(output.stderr).to.include(
      'Error opening file "test/files/invalid/external-ref/address.yaml" \n' +
      "ENOENT: no such file or directory, open 'test/files/invalid/external-ref/address.yaml'\n"
    );
    expect(output.stderr).to.include('at ReadFileContext');
  });

});
