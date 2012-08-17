(function() {
  var JasminePhantomNode, argv, color, exec, fs, help, optimist,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  optimist = require('optimist');

  fs = require('fs');

  exec = require('child_process').exec;

  color = require('ansi-color').set;

  argv = optimist.usage([' usage: jasmine-phantom-node'].join('\n')).alias('p', 'port').alias('u', 'url').argv;

  help = function() {
    optimist.showHelp();
    return process.exit();
  };

  JasminePhantomNode = (function() {

    JasminePhantomNode.exec = function(options) {
      return new this(options);
    };

    JasminePhantomNode.prototype.options = {
      port: argv.port || 9294,
      url: argv.url || "test",
      timeout: argv.timeout || 5000
    };

    function JasminePhantomNode(options) {
      this.startPhantom = __bind(this.startPhantom, this);

      var key, value;
      for (key in options) {
        value = options[key];
        this.options[key] = value;
      }
      this.startPhantom();
    }

    JasminePhantomNode.prototype.startPhantom = function() {
      var phantom,
        _this = this;
      return phantom = exec("phantomjs " + (this.phantomScript()) + " http://localhost:" + this.options.port + "/" + this.options.url + " " + this.options.timeout, function(err, stdout, stderr) {
        if (err) {
          console.log(err);
          throw err;
        }
        return _this.processOutput(stdout);
      });
    };

    JasminePhantomNode.prototype.phantomScript = function() {
      return fs.realpathSync("lib/jasmine-phantom-node/phantomjs/phantom.js");
    };

    JasminePhantomNode.prototype.processOutput = function(json) {
      var failedSuites, passedSuites, results, suite, _i, _len, _ref;
      results = JSON.parse(json);
      passedSuites = new Array;
      failedSuites = new Array;
      _ref = results['suites'];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        suite = _ref[_i];
        if (suite['passed']) {
          passedSuites << suite;
        } else {
          failedSuites << suite;
        }
      }
      this.logPassed(passedSuites);
      this.logFailed(failedSuites);
      this.logStats(results['stats']);
      if (results['passed']) {
        return process.exit(0);
      } else {
        return process.exit(1);
      }
    };

    JasminePhantomNode.prototype.logPassed = function(specs) {
      return console.log;
    };

    JasminePhantomNode.prototype.logFailed = function(specs) {};

    JasminePhantomNode.prototype.logStats = function(stats) {
      var outColor, output;
      outColor = stats['failures'] === 0 ? 'green' : 'red';
      output = "Specs: " + stats['specs'] + ", Failures: " + stats['failures'] + ", Time: " + stats['time'];
      return console.log(color(output, outColor));
    };

    return JasminePhantomNode;

  })();

  module.exports = JasminePhantomNode;

}).call(this);
