#!/usr/bin/env node
"use strict";

const yargs = require("yargs");
const chalk = require("chalk");
const api = require("../");
const helpText = require("./help-text.json");

const validTypeOptions = ["json", "yaml"];

(function main () {
  let args = parseArgs();
  let command = args.command;
  let file = args.file;
  let options = args.options;

  if (options.debug) {
    // Enable debug output
    process.env.DEBUG = "swagger:*,json-schema-ref-parser";
  }

  // Check if the output type contains a valid value
  if (validTypeOptions.indexOf(options.type) === -1) {
    const validValues = validTypeOptions.join(", ");
    console.error('Error: type value "' + options.type + '" is invalid. Valid values: ' + validValues);
    process.exit(2);
  }

  if (options.help) {
    // Show help text and exit
    console.log(getHelpText(command));
    process.exit(0);
  }
  else if (command === "validate" && file) {
    // Validate an API
    validate(file, options);
  }
  else if (command === "bundle" && file) {
    // Bundle a multi-file API
    bundle(file, options);
  }
  else {
    // Invalid args.  Show help text and exit with non-zero
    console.error("Error: Invalid arguments\n");
    console.error(getHelpText(command));
    process.exit(1);
  }
}());


/**
 * Parses the command-line arguments
 *
 * @returns {object} - The parsed arguments
 */
function parseArgs () {
  // Configure the argument parser
  yargs
    .option("schema", {
      type: "boolean",
      default: true,
    })
    .option("spec", {
      type: "boolean",
      default: true,
    })
    .option("o", {
      alias: "outfile",
      type: "string",
      normalize: true,
    })
    .option("r", {
      alias: "dereference",
      type: "boolean",
    })
    .option("t", {
      alias: "type",
      type: "string",
      normalize: true,
      default: "json",
    })
    .option("f", {
      alias: "format",
      type: "number",
      default: 2,
    })
    .option("w", {
      alias: "wrap",
      type: "number",
      default: Infinity,
    })
    .option("d", {
      alias: "debug",
      type: "boolean",
    })
    .option("h", {
      alias: "help",
      type: "boolean",
    });

  // Show the version number on "--version" or "-v"
  yargs
    .version()
    .alias("v", "version");

  // Disable the default "--help" behavior
  yargs.help(false);

  // Parse the command-line arguments
  let args = yargs.argv;

  // Normalize the parsed arguments
  let parsed = {
    command: args._[0],
    file: args._[1],
    options: {
      schema: args.schema,
      spec: args.spec,
      outfile: args.outfile,
      dereference: args.dereference,
      format: args.format || 2,
      type: args.type || "json",
      wrap: args.wrap || Infinity,
      debug: args.debug,
      help: args.help,
    }
  };

  if (parsed.options.debug) {
    console.log(JSON.stringify(parsed, null, 2));
  }

  return parsed;
}


/**
 * Validates an API definition against the Swagger/OpenAPI schema and spec
 *
 * @param {string} file - The path of the file to validate
 * @param {object} options - Validation options
 * @param {boolean} options.schema - Whether to validate against the Swagger/OpenAPI schema
 * @param {boolean} options.spec - Whether to validate against the Swagger/OpenAPI specification
 */
async function validate (file, options) {
  try {
    await api.validate(file, options);
    console.log(file, "is valid");
  }
  catch (error) {
    errorHandler(error);
  }
}


/**
 * Bundles a multi-file API definition
 *
 * @param {string} file - The path of the file to validate
 * @param {object} options - Validation options
 */
async function bundle (file, options) {
  try {
    let bundled = await api.bundle(file, options);

    if (options.outfile) {
      console.log("Created %s from %s", options.outfile, file);
    }
    else {
      // Write the bundled API to stdout
      console.log(bundled);
    }
  }
  catch (error) {
    errorHandler(error);
  }
}


/**
 * Returns the help text for the specified command
 *
 * @param {string} [commandName] - The command to show help text for
 * @returns {string} - the help text
 */
function getHelpText (commandName) {
  let lines = helpText[commandName] || helpText.default;
  return lines.join("\n");
}


/**
 * Writes error information to stderr and exits with a non-zero code
 *
 * @param {Error} err
 */
function errorHandler (err) {
  let errorMessage = process.env.DEBUG ? err.stack : err.message;
  console.error(chalk.red(errorMessage));
  process.exit(1);
}
