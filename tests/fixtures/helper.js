'use strict';

var fs     = require('fs'),
    path   = require('path'),
    expect = require('chai').expect;

exports.tmpPath = path.join(__dirname, '..', '.tmp');

exports.run = function()

/**
 * Runs bump with the given arguments, against the given JSON manifest.
 * Then verifies that the manifest is modified as expected.
 *
 * @param {string} args - The args to run bump with
 * @param {object} initialJSON - The initial contents of the manifest file
 * @param {object} finalJSON - The expected contents of the manifest file after bump runs
 */
function bump(args, initialJSON, finalJSON) {
  // Initialize the manifest files
  var manifests = ['package.json', 'bower.json', 'component.json'];
  manifests.forEach(function(manifest) {
    var filePath = path.join(tmpPath, manifest);
    var data = initialJSON ? JSON.stringify(initialJSON, null, 2) : '';
    fs.writeFileSync(filePath, data);
  });

  // Modify the PATH environment variable so bump will execute our fake `git`
  var binPath = path.join(__dirname, 'bin');
  fs.chmodSync(path.join(binPath, 'git'), '0777');
  var env = _.clone(process.env);
  env.PATH = binPath + path.delimiter + env.PATH;

  // Run bump
  var bump = path.resolve(__dirname, '..', '..', 'bin', 'bump.js');
  args = [bump].concat(args.split(' '));
  var output = spawnSync('node', args, {cwd: tmpPath, env: env});

  // Check for errors
  if (output.error) {
    throw output.error;
  }
  else if (output.status) {
    throw new Error(util.format('Bump failed with error code %d.\n%s',
      output.status, output.stderr || output.stdout));
  }

  var stdout = output.stdout.toString();

  // The files that should have been modified
  var modifiedFiles = args.indexOf('--grep') === -1 ? manifests : manifests.concat(files);

  modifiedFiles.forEach(function(file) {
    if (file !== 'script.js') {
      // Check the console output
      var expectedOutput = util.format('Updated %s to %s\n', file, finalJSON.version);
      if (_.isEmpty(finalJSON)) {
        expect(stdout).not.to.contain(expectedOutput);
      }
      else {
        expect(stdout).to.contain(expectedOutput);
      }
    }

    // Check the file contents
    var filePath = path.join(tmpPath, file);
    var contents = fs.readFileSync(filePath, {encoding: 'utf8'});

    if (manifests.indexOf(file) >= 0) {
      var json = JSON.parse(contents);
      expect(json).to.deep.equal(finalJSON);
    }
    else {
      expect(contents).not.to.contain('1.2.3');
    }
  });
}

/**
 * Verifies that git was run with the expected arguments.
 *
 * @param {string[]} expected - An array of strings. Each string contains the arguments for a singlee git command.
 */
function git(expected) {
  var gitPath = path.join(__dirname, '.tmp', 'git.txt');
  var git = fs.readFileSync(gitPath, {encoding: 'utf8'});
  git = git.trim().split('\n');

  var length = Math.max(git.length, expected.length);
  for (var i = 0; i < length; i++) {
    expect(git[i]).to.equal(expected[i]);
  }
}
