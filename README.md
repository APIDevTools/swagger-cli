Swagger 2.0 CLI
============================

[![Build Status](https://api.travis-ci.org/BigstickCarpet/swagger-cli.svg)](https://travis-ci.org/BigstickCarpet/swagger-cli)
[![Dependencies](https://david-dm.org/BigstickCarpet/swagger-cli.svg)](https://david-dm.org/BigstickCarpet/swagger-cli)
[![Coverage Status](https://coveralls.io/repos/BigstickCarpet/swagger-cli/badge.svg?branch=master&service=github)](https://coveralls.io/r/BigstickCarpet/swagger-cli)
[![Code Climate Score](https://codeclimate.com/github/BigstickCarpet/swagger-cli/badges/gpa.svg)](https://codeclimate.com/github/BigstickCarpet/swagger-cli)
[![Codacy Score](https://www.codacy.com/project/badge/b20026f43c2d4a149088ba0ad2ab6355)](https://www.codacy.com/public/jamesmessinger/swagger-cli)
[![Inline docs](http://inch-ci.org/github/BigstickCarpet/swagger-cli.svg?branch=master&style=shields)](http://inch-ci.org/github/BigstickCarpet/swagger-cli)

[![npm](http://img.shields.io/npm/v/swagger-cli.svg)](https://www.npmjs.com/package/swagger-cli)
[![License](https://img.shields.io/npm/l/swagger-cli.svg)](LICENSE)


Features
--------------------------
- Validate Swagger 2.0 APIs in **JSON or YAML** format
- Supports multi-file APIs via `$ref` pointers
- Bundle multiple Swagger files into one combined Swagger file
- Built-in **HTTP server** to serve your REST API &mdash; great for testing!


Installation
--------------------------
Install using [npm](https://docs.npmjs.com/getting-started/what-is-npm):

```bash
npm install -g swagger-cli
```


Usage
--------------------------

```bash
swagger <command> [options] <filename>

Commands:
    validate                        Validates a Swagger API against the Swagger 2.0 schema and spec

    bundle                          Bundles a multi-file Swagger API into a single file

    serve                           Serves a Swagger API via the built-in HTTP REST server

Options:
    -h, --help                      Show help for any command
    -V, --version                   Output the CLI version number
```


### Validate an API

The `swagger validate` command will validate your Swagger API against the [Swagger 2.0 schema](https://github.com/reverb/swagger-spec/blob/master/schemas/v2.0/schema.json) _and_ the [Swagger 2.0 spec](https://github.com/reverb/swagger-spec/blob/master/versions/2.0.md) to make sure it is fully compliant.  The command will exit with a non-zero code if the API is invalid.

```bash
swagger validate [options] <filename>

Options:
    --no-schema                     Do NOT validate against the Swagger 2.0 schema

    --no-spec                       Do NOT validate against the Swagger 2.0 spec
```


### Combine Multiple Files

You can split your Swagger API into multiple files for maintainability reasons, and use [`$ref` pointers](https://github.com/swagger-api/swagger-spec/blob/master/versions/2.0.md#reference-object) to reference each file. The `swagger bundle` command will combine all of those referenced files into a single file, which is useful for distribution or for use with tools that don't support `$ref` pointers.

To reduce file size, each referenced file is only included _once_ in the final file.  Any other references to that file are replaced with _internal_ `$ref` pointers.  However, you can also choose to _fully dereference_ the API so there will be _no_ `$ref` pointers in the resulting file.  This results in a much larger file, but is useful if your other tools don't support `$ref` pointers.

If you don't specify the `--output-file` option, then the bundled API will be written to stdout, so means you can pipe it to other commands.

```bash
swagger bundle [options] <filename>

Options:
    -o, --output-file <filename>    The output file

    -d, --dereference               Fully dereference all $ref pointers
```


### HTTP REST Server

The `swagger serve` command uses [Swagger Server](https://github.com/BigstickCarpet/swagger-server) to serve the REST API.  Swagger Server automatically provides mock implementations for every operation defined in your Swagger API, including data persistence.  You can replace or supplement the mock implementations via [Express middleware](http://expressjs.com/guide/using-middleware.html).

By default, Swagger Server uses an [in-memory data store](https://github.com/BigstickCarpet/swagger-express-middleware/blob/master/docs/exports/MemoryDataStore.md), which means no data will be persisted after the server shuts down. This is great for testing and CI purposes, but if you want to keep data across sessions, then use the `--json` option, which will persist the REST resources as [JSON files](https://github.com/BigstickCarpet/swagger-express-middleware/blob/master/docs/exports/FileDataStore.md).

> NOTE: Swagger Server is still in development, so some functionality is not fully complete yet.

```bash
swagger serve [options] <filename>

Options:
    -p, --port <port>               The server port number or socket name

    -j, --json <basedir>            Store REST resources as JSON files under the given directory
```


Contributing
--------------------------
I welcome any contributions, enhancements, and bug-fixes.  [File an issue](https://github.com/BigstickCarpet/swagger-cli/issues) on GitHub and [submit a pull request](https://github.com/BigstickCarpet/swagger-cli/pulls).

#### Building/Testing
To build/test the project locally on your computer:

1. **Clone this repo**<br>
`git clone https://github.com/bigstickcarpet/swagger-cli.git`

2. **Install dependencies**<br>
`npm install`

3. **Run the build script**<br>
`npm run build`

4. **Run the unit tests**<br>
`npm run mocha` (just the tests)<br>
`npm test` (tests + code coverage)


License
--------------------------
Swagger CLI is 100% free and open-source, under the [MIT license](LICENSE). Use it however you want.
