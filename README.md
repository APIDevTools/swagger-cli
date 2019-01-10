Swagger/OpenAPI CLI
============================

[![Cross-Platform Compatibility](https://apidevtools.org/img/os-badges.svg)](https://travis-ci.com/APIDevTools/swagger-cli)
[![Build Status](https://api.travis-ci.com/APIDevTools/swagger-cli.svg?branch=master)](https://travis-ci.com/APIDevTools/swagger-cli)
[![Coverage Status](https://coveralls.io/repos/github/APIDevTools/swagger-cli/badge.svg?branch=master)](https://coveralls.io/github/APIDevTools/swagger-cli?branch=master)


[![npm](https://img.shields.io/npm/v/swagger-cli.svg)](https://www.npmjs.com/package/swagger-cli)
[![Dependencies](https://david-dm.org/APIDevTools/swagger-cli.svg)](https://david-dm.org/APIDevTools/swagger-cli)
[![License](https://img.shields.io/npm/l/swagger-cli.svg)](LICENSE)


Features
--------------------------
- Validate Swagger/OpenAPI files in **JSON or YAML** format
- Supports multi-file API definitions via `$ref` pointers
- Bundle multiple Swagger/OpenAPI files into one combined file


Related Projects
--------------------------
- [Swagger Parser](https://github.com/APIDevTools/swagger-parser)
- [Swagger Express Middleware](https://github.com/APIDevTools/swagger-express-middleware)


Installation
--------------------------
Install using [npm](https://docs.npmjs.com/getting-started/what-is-npm):

```bash
npm install -g swagger-cli
```


Usage
--------------------------

```
swagger-cli <command> [options] <file>

Commands:
    validate                Validates an API definition in Swagger 2.0 or OpenAPI 3.0 format

    bundle                  Bundles a multi-file API definition into a single file

Options:
    -h, --help              Show help for any command
    -v, --version           Output the CLI version number
    -d, --debug [filter]    Show debug output, optionally filtered (e.g. "*", "swagger:*", etc.)
```


### Validate an API

The `swagger-cli validate` command will validate your Swagger/OpenAPI definition against the [Swagger 2.0 schema](https://github.com/reverb/swagger-spec/blob/master/schemas/v2.0/schema.json) or [OpenAPI 3.0 Schema](https://github.com/kogosoftwarellc/open-api/blob/master/packages/openapi-schema-validation/schema/openapi-3.0.json).  It also performs additional validations against the [specification](https://github.com/swagger-api/swagger-spec/blob/master/versions/2.0.md), which will catch some things that aren't covered by the schema, such as duplicate parameters, invalid MIME types, etc.

The command will exit with a non-zero code if the API is invalid.

```
swagger-cli validate [options] <file>

Options:
    --no-schema             Do NOT validate against the Swagger/OpenAPI JSON schema

    --no-spec               Do NOT validate against the Swagger/OpenAPI specification
```


### Combine Multiple Files

The Swagger and OpenAPI specs allows you to split your API definition across multiple files using [`$ref` pointers](https://github.com/swagger-api/swagger-spec/blob/master/versions/2.0.md#reference-object) to reference each file. You can use the `swagger-cli bundle` command to combine all of those referenced files into a single file, which is useful for distribution or interoperation with other tools.

By default, the `swagger-cli bundle` command tries to keep the output file size as small as possible, by only embedding each referenced file _once_.  If the same file is referenced multiple times, then any subsequent references are simply modified to point to the _single_ inlined copy of the file.  If you want to produce a bundled file without _any_ `$ref` pointers, then add the `--dereference` option.  This will result in a larger file size, since multiple references to the same file will result in that file being embedded multiple times.

If you don't specify the `--output-file` option, then the bundled API will be written to stdout, which means you can pipe it to other commands.

The result of this method by default is written as JSON. It can be changed to YAML with the `--type` option, by passing the `yaml` value.

```
swagger-cli bundle [options] <file>

Options:
    -o, --outfile <file>        The output file

    -r, --dereference           Fully dereference all $ref pointers

    -f, --format <spaces>       Formats the output using the given number of spaces
                                (the default is 2 spaces)

    -t, --type <filetype>       Defines the output file type. The valid values are: json, yaml
                                (the default is JSON)

    -w, --wrap <column>         Set the line length for YAML strings
                                (the default is no wrapping)
```


Contributing
--------------------------
I welcome any contributions, enhancements, and bug-fixes.  [File an issue](https://github.com/APIDevTools/swagger-cli/issues) on GitHub and [submit a pull request](https://github.com/APIDevTools/swagger-cli/pulls).

#### Building/Testing
To build/test the project locally on your computer:

1. **Clone this repo**<br>
`git clone https://github.com/APIDevTools/swagger-cli.git`

2. **Install dependencies**<br>
`npm install`

3. **Run the tests**<br>
`npm test`


License
--------------------------
Swagger CLI is 100% free and open-source, under the [MIT license](LICENSE). Use it however you want.

Big Thanks To
--------------------------
Thanks to these awesome companies for their support of Open Source developers ❤

[![Travis CI](https://jsdevtools.org/img/badges/travis-ci.svg)](https://travis-ci.com)
[![SauceLabs](https://jsdevtools.org/img/badges/sauce-labs.svg)](https://saucelabs.com)
[![Coveralls](https://jsdevtools.org/img/badges/coveralls.svg)](https://coveralls.io)
