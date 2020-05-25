Swagger/OpenAPI CLI
============================

[![Cross-Platform Compatibility](https://apitools.dev/img/badges/os-badges.svg)](https://github.com/APIDevTools/swagger-cli/actions)
[![Build Status](https://github.com/APIDevTools/swagger-cli/workflows/CI-CD/badge.svg?branch=master)](https://github.com/APIDevTools/swagger-cli/actions)

[![Dependencies](https://david-dm.org/APIDevTools/swagger-cli.svg)](https://david-dm.org/APIDevTools/swagger-cli)
[![Coverage Status](https://coveralls.io/repos/github/APIDevTools/swagger-cli/badge.svg?branch=master)](https://coveralls.io/github/APIDevTools/swagger-cli?branch=master)

[![npm](https://img.shields.io/npm/v/@apidevtools/swagger-cli.svg)](https://www.npmjs.com/package/@apidevtools/swagger-cli)
[![License](https://img.shields.io/npm/l/@apidevtools/swagger-cli.svg)](LICENSE)
[![Buy us a tree](https://img.shields.io/badge/Treeware-%F0%9F%8C%B3-lightgreen)](https://plant.treeware.earth/APIDevTools/swagger-cli)



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
Install using [npm](https://docs.npmjs.com/about-npm/):

```bash
npm install -g @apidevtools/swagger-cli
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

The `swagger-cli validate` command will validate your Swagger/OpenAPI definition against the [Swagger 2.0 schema](https://github.com/OAI/OpenAPI-Specification/blob/master/schemas/v2.0/schema.json) or [OpenAPI 3.0 Schema](https://github.com/OAI/OpenAPI-Specification/blob/master/schemas/v3.0/schema.json).  It also performs additional validations against the [specification](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md), which will catch some things that aren't covered by the schema, such as duplicate parameters, invalid MIME types, etc.

The command will exit with a non-zero code if the API is invalid.

```
swagger-cli validate [options] <file>

Options:
    --no-schema             Do NOT validate against the Swagger/OpenAPI JSON schema

    --no-spec               Do NOT validate against the Swagger/OpenAPI specification
```

#### Git pre-commit hook

There is a useful Python tool called [pre-commit](https://pre-commit.com/) that can be used to execute a wide suite of pre-commit checks. The `swagger-cli validate` command can be integrated as part of a git pre-commit hook by adding the following configuration to the `repos` entry of an existing `.pre-commit-config.yaml` file.

```
-   repo: https://github.com/APIDevTools/swagger-cli
    rev: v2.2.1
    hooks:
    - id: swagger-validation
      args: ["validate", "<path to root swagger>"]
```

The intention is to point to single root swagger that references multiple swagger definitions. The above hook will execute the `swagger-cli validation` against the root swagger anytime that a file matching the pattern `.*swagger.*\.(json|yaml|yml)` is modified. Any failures in this validation will prevent the git commit from being processed.

### Combine Multiple Files

The Swagger and OpenAPI specs allows you to split your API definition across multiple files using [`$ref` pointers](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#reference-object) to reference each file. You can use the `swagger-cli bundle` command to combine all of those referenced files into a single file, which is useful for distribution or interoperation with other tools.

By default, the `swagger-cli bundle` command tries to keep the output file size as small as possible, by only embedding each referenced file _once_.  If the same file is referenced multiple times, then any subsequent references are simply modified to point to the _single_ inlined copy of the file.  If you want to produce a bundled file without _any_ `$ref` pointers, then add the `--dereference` option.  This will result in a larger file size, since multiple references to the same file will result in that file being embedded multiple times.

If you don't specify the `--outfile` option, then the bundled API will be written to stdout, which means you can pipe it to other commands.

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
I welcome any contributions, enhancements, and bug-fixes.  [Open an issue](https://github.com/APIDevTools/swagger-cli/issues) on GitHub and [submit a pull request](https://github.com/APIDevTools/swagger-cli/pulls).

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

This package is [Treeware](http://treeware.earth). If you use it in production, then we ask that you [**buy the world a tree**](https://plant.treeware.earth/APIDevTools/swagger-cli) to thank us for our work. By contributing to the Treeware forest you’ll be creating employment for local families and restoring wildlife habitats.



Big Thanks To
--------------------------
Thanks to these awesome companies for their support of Open Source developers ❤

[![Travis CI](https://jstools.dev/img/badges/travis-ci.svg)](https://travis-ci.com)
[![SauceLabs](https://jstools.dev/img/badges/sauce-labs.svg)](https://saucelabs.com)
[![Coveralls](https://jstools.dev/img/badges/coveralls.svg)](https://coveralls.io)
