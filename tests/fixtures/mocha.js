'use strict';

var fs     = require('fs'),
    path   = require('path'),
    helper = require('./helper');

/**
 * Mocha configuration
 */
beforeEach(function() {
  // Set the default timeouts for all tests
  this.currentTest.timeout(2000);
  this.currentTest.slow(100);
});

/**
 * Reset the .tmp directory before each test
 */
beforeEach(function() {
  if (!fs.existsSync(helper.tmpPath)) {
    // Make sure the .tmp directory exists
    fs.mkdirSync(helper.tmpPath);
  }
  else {
    // Make sure the .tmp directory is empty
    fs.readdirSync(helper.tmpPath).forEach(function(file) {
      fs.unlinkSync(path.join(helper.tmpPath, file));
    });
  }
});
