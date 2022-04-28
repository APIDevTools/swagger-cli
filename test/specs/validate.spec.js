"use strict";

const helper = require("../fixtures/helper");
const expect = require("chai").expect;

describe("swagger-cli validate", () => {

  it("should validate a single-file API", () => {
    let output = helper.run("validate", "test/files/valid/single-file/api.yaml");

    expect(output.stderr).to.have.lengthOf(0);
    expect(output.status).to.equal(0);
    expect(output.stdout).to.equal("test/files/valid/single-file/api.yaml is valid\n");
  });

  it("should validate a single-file API (JSON output)", () => {
    let output = helper.run(
      "--json",
      "validate",
      "test/files/valid/single-file/api.yaml"
    );

    expect(output.stderr).to.have.lengthOf(0);
    expect(output.status).to.equal(0);
    expect(JSON.parse(output.stdout)).to.deep.equal({
      valid: true,
      error: [],
    });
  });

  it("should validate a multi-file API", () => {
    let output = helper.run("validate", "test/files/valid/multi-file/api.yaml");

    expect(output.stderr).to.have.lengthOf(0);
    expect(output.status).to.equal(0);
    expect(output.stdout).to.equal("test/files/valid/multi-file/api.yaml is valid\n");
  });

  it("should validate an API with circular references", () => {
    let output = helper.run("validate", "test/files/valid/circular-refs/api.yaml");

    expect(output.stderr).to.have.lengthOf(0);
    expect(output.status).to.equal(0);
    expect(output.stdout).to.equal("test/files/valid/circular-refs/api.yaml is valid\n");
  });

  it("should fail validation against the Swagger 2.0 schema", () => {
    let output = helper.run("validate", "test/files/invalid/schema/api.yaml");

    expect(output.stdout).to.have.lengthOf(0);
    expect(output.status).to.equal(1);
    expect(output.stderr).to.include("Swagger schema validation failed.");
  });

  it("should skip validation against the Swagger 2.0 schema", () => {
    let output = helper.run("validate", "--no-schema", "test/files/invalid/schema/api.yaml");

    expect(output.stderr).to.have.lengthOf(0);
    expect(output.status).to.equal(0);
    expect(output.stdout).to.include("test/files/invalid/schema/api.yaml is valid\n");
  });

  it("should fail validation against the Swagger 2.0 specification", () => {
    let output = helper.run("validate", "test/files/invalid/spec/api.yaml");

    expect(output.stdout).to.have.lengthOf(0);
    expect(output.status).to.equal(1);
    expect(output.stderr).to.equal("Validation failed. /paths/people/{name}/get is missing path parameter(s) for {name}\n");
  });

  it("should fail validation against the Swagger 2.0 specification (JSON output)", () => {
    let output = helper.run(
      "--json",
      "validate",
      "test/files/invalid/spec/api.yaml"
    );

    expect(output.stdout).to.have.lengthOf(0);
    expect(output.status).to.equal(1);

    const parsed = JSON.parse(output.stderr);
    expect(parsed.valid).to.be.false;
    expect(parsed.error.message).to.equal(
      "Validation failed. /paths/people/{name}/get is missing path parameter(s) for {name}"
    );
    expect(parsed.error.name).to.equal("SyntaxError");
    expect(parsed.error.inner).to.be.undefined;
  });

  it("should skip validation against the Swagger 2.0 specification", () => {
    let output = helper.run("validate", "--no-spec", "test/files/invalid/spec/api.yaml");

    expect(output.stderr).to.have.lengthOf(0);
    expect(output.status).to.equal(0);
    expect(output.stdout).to.include("test/files/invalid/spec/api.yaml is valid\n");
  });

  it("should fail validation if a $ref is invalid", () => {
    let output = helper.run("validate", "test/files/invalid/internal-ref/api.yaml");

    expect(output.stdout).to.have.lengthOf(0);
    expect(output.status).to.equal(1);
    expect(output.stderr).to.include('Token "definitions" does not exist.\n');
  });

  it("should fail validation if a referenced file does not exist", () => {
    let output = helper.run("validate", "test/files/invalid/external-ref/api.yaml");

    expect(output.stdout).to.have.lengthOf(0);
    expect(output.status).to.equal(1);
    expect(output.stderr).to.contain("Error opening file ");
    expect(output.stderr).to.contain("ENOENT: no such file or directory");
  });

  it("should output the full error stack in debug mode", () => {
    let output = helper.run("--debug", "validate", "test/files/invalid/external-ref/api.yaml");

    expect(output.stdout).not.to.have.lengthOf(0);
    expect(output.status).to.equal(1);
    expect(output.stderr).to.include("Error opening file ");
    expect(output.stderr).to.include("ENOENT: no such file or directory");
    expect(output.stderr).to.include("at ReadFileContext");
  });

});
