'use strict';

/**
 * Mocha configuration
 */
beforeEach(function() {
  // Set the default timeouts for all tests
  this.currentTest.timeout(2000);
  this.currentTest.slow(100);
});
