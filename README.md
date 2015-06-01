Swagger CLI
============================
#### Command-line tool to parse, validate, and host Swagger-based REST APIs

[![Build Status](https://img.shields.io/travis/BigstickCarpet/swagger-cli.svg)](https://travis-ci.org/BigstickCarpet/swagger-cli)
[![Coverage Status](https://img.shields.io/coveralls/BigstickCarpet/swagger-cli.svg)](https://coveralls.io/r/BigstickCarpet/swagger-cli)
[![Code Climate Score](https://img.shields.io/codeclimate/github/BigstickCarpet/swagger-cli.svg)](https://codeclimate.com/github/BigstickCarpet/swagger-cli)
[![Dependencies](https://img.shields.io/david/BigstickCarpet/swagger-cli.svg)](https://david-dm.org/BigstickCarpet/swagger-cli)
[![Inline docs](http://inch-ci.org/github/BigstickCarpet/swagger-cli.svg?branch=master&style=shields)](http://inch-ci.org/github/BigstickCarpet/swagger-cli)

[![npm](http://img.shields.io/npm/v/swagger-cli.svg)](https://www.npmjs.com/package/swagger-cli)
[![License](https://img.shields.io/npm/l/swagger-cli.svg)](LICENSE)

| Alpha Code!
|-------------------------------------
| Swagger CLI is still being written.  It's not ready to use yet.  Check back later, once we release v1.0.0


Features
--------------------------
* Parse and validate Swagger 2.0 APIs in __JSON or YAML__ format
* Supports multi-file APIs via `$ref` pointers
* Bundle multiple Swagger files into one combined Swagger file
* Built-in __HTTP server__ to serve your REST API &mdash; great for testing!
* __Fully-functional mocks__ for every operation in your API, including data persistence &mdash; great for POCs and demos!


Installation
--------------------------
Install using [npm](https://docs.npmjs.com/getting-started/what-is-npm).  Install it globally (using the `-g` flag) to run it from any terminal window.

```bash
npm install -g swagger-cli
```


Usage
--------------------------
```bash
swagger <command> [options] <filename>

Commands:
    validate        Parses and validates a Swagger file
    
    dereference     Dereferences all $ref pointers in a Swagger file
    
    bundle          Bundles multiple Swagger files into a single file
    
    serve           Serves a Swagger file via a built-in HTTP REST server
    
Options:
    -h, --help      Show help for any command
    -v, --version   Output the CLI version number
```


Contributing
--------------------------
I welcome any contributions, enhancements, and bug-fixes.  [File an issue](https://github.com/BigstickCarpet/swagger-cli/issues) on GitHub and [submit a pull request](https://github.com/BigstickCarpet/swagger-cli/pulls).

#### Building/Testing
To build/test the project locally on your computer:

1. __Clone this repo__<br>
`git clone https://github.com/BigstickCarpet/swagger-cli.git`

2. __Install dependencies__<br>
`npm install`

3. __Run the build script__<br>
`npm run build`

4. __Run the unit tests__<br>
`npm run mocha` (just the tests)<br>
`npm test` (tests + code coverage)


License
--------------------------
Swagger CLI is 100% free and open-source, under the [MIT license](LICENSE). Use it however you want.
