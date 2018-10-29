"use strict";

const helper = require("../fixtures/helper");
const expect = require("chai").expect;
const helpText = require("../../bin/help-text.json");

describe("swagger-cli --help", () => {

  it("should output the help text and exit 0", () => {
    let output = helper.run("--help");

    expect(output.stderr).to.be.empty;
    expect(output.status).to.equal(0);
    expect(output.stdout).to.equal(helpText.default.join("\n") + "\n");
  });

  it("should output the help text and exit 1 if no args are provided", () => {
    let output = helper.run();

    expect(output.stdout).to.be.empty;
    expect(output.status).to.equal(1);
    expect(output.stderr).to.equal(
      "Error: Invalid arguments\n\n" + helpText.default.join("\n") + "\n"
    );
  });

  it("should output the help text and exit 1 if the command is invalid", () => {
    let output = helper.run("foo");

    expect(output.stdout).to.be.empty;
    expect(output.status).to.equal(1);
    expect(output.stderr).to.equal(
      "Error: Invalid arguments\n\n" + helpText.default.join("\n") + "\n"
    );
  });

  it("should output the help text and exit 1 if no file is provided", () => {
    let output = helper.run("validate");

    expect(output.stdout).to.be.empty;
    expect(output.status).to.equal(1);
    expect(output.stderr).to.equal(
      "Error: Invalid arguments\n\n" + helpText.validate.join("\n") + "\n"
    );
  });

  it('should work with the "-h" alias', () => {
    let output = helper.run("-h");

    expect(output.stderr).to.be.empty;
    expect(output.status).to.equal(0);
    expect(output.stdout).to.equal(helpText.default.join("\n") + "\n");
  });

  it('should output the help text for the "validate" command', () => {
    let output = helper.run("validate", "--help");

    expect(output.stderr).to.be.empty;
    expect(output.status).to.equal(0);
    expect(output.stdout).to.equal(helpText.validate.join("\n") + "\n");
  });

  it('should output the help text for the "validate" command if --help comes first', () => {
    let output = helper.run("--help", "validate");

    expect(output.stderr).to.be.empty;
    expect(output.status).to.equal(0);
    expect(output.stdout).to.equal(helpText.validate.join("\n") + "\n");
  });

  it('should output the help text for the "bundle" command', () => {
    let output = helper.run("bundle", "--help");

    expect(output.stderr).to.be.empty;
    expect(output.status).to.equal(0);
    expect(output.stdout).to.equal(helpText.bundle.join("\n") + "\n");
  });

  it('should output the help text for the "bundle" command if --help comes first', () => {
    let output = helper.run("--help", "bundle");

    expect(output.stderr).to.be.empty;
    expect(output.status).to.equal(0);
    expect(output.stdout).to.equal(helpText.bundle.join("\n") + "\n");
  });

});
