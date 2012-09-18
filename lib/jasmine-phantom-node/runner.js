(function() {
  var JasminePhantomNode, argv, color, exec, fs, help, optimist,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  optimist = require('optimist');

  fs = require('fs');

  exec = require('child_process').exec;

  color = require('ansi-color').set;

  argv = optimist.usage([' usage: jasmine-phantom-node'].join('\n')).alias('p', 'port').alias('u', 'url').alias('t', 'timeout').alias('e', 'exit-on-failure').boolean('e').argv;

  help = function() {
    optimist.showHelp();
    return process.exit();
  };

  JasminePhantomNode = (function() {

    JasminePhantomNode.exec = function(options) {
      console.log(options);
      return new this(options);
    };

    JasminePhantomNode.prototype.options = {
      port: argv.port || 9294,
      url: argv.url || "/test",
      timeout: argv.timeout || 5000
    };

    function JasminePhantomNode(options) {
      this.processOutput = __bind(this.processOutput, this);

      this.startPhantom = __bind(this.startPhantom, this);

      var key, value;
      for (key in options) {
        value = options[key];
        this.options[key] = value;
      }
      console.log(this.options);
      this.startPhantom();
    }

    JasminePhantomNode.prototype.startPhantom = function() {
      var phantom,
        _this = this;
      return phantom = exec("phantomjs " + (this.phantomScript()) + " http://localhost:" + this.options.port + this.options.url + " " + this.options.timeout, function(err, stdout, stderr) {
        if (err) {
          console.log(err);
          throw err;
        }
        return _this.processOutput(stdout);
      });
    };

    JasminePhantomNode.prototype.phantomScript = function() {
      return __dirname + "/phantomjs/phantom.js";
    };

    JasminePhantomNode.prototype.processOutput = function(json) {
      var failedSuites, passedSuites, results;
      results = JSON.parse(json);
      passedSuites = new Array;
      failedSuites = new Array;
      console.log(this.options);
      this.logSuites(results['suites']);
      this.logFailed(results['suites']);
      this.logStats(results['stats']);
      if (results['passed']) {
        return process.exit(0);
      } else if (this.options.e) {
        return process.exit(1);
      } else {
        return process.exit(0);
      }
    };

    JasminePhantomNode.prototype.logSuites = function(suites, tabDepth) {
      var outColor, output, spec, suite, _i, _j, _len, _len1, _ref, _results;
      if (tabDepth == null) {
        tabDepth = 0;
      }
      _results = [];
      for (_i = 0, _len = suites.length; _i < _len; _i++) {
        suite = suites[_i];
        outColor = suite.passed ? 'green' : 'red';
        output = this.tabs(tabDepth) + suite.description;
        console.log(color(output, outColor));
        _ref = suite.specs;
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          spec = _ref[_j];
          outColor = spec.passed ? 'green' : 'red';
          output = this.tabs(tabDepth + 1) + spec.description;
          console.log(color(output, outColor));
        }
        if (suite.suites) {
          _results.push(this.logSuites(suite.suites, tabDepth + 1));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    JasminePhantomNode.prototype.logFailed = function(suites, description) {
      var spec, suite, _i, _j, _len, _len1, _ref, _results;
      if (description == null) {
        description = [];
      }
      _results = [];
      for (_i = 0, _len = suites.length; _i < _len; _i++) {
        suite = suites[_i];
        if (suite.passed === false) {
          _ref = suite.specs;
          for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
            spec = _ref[_j];
            if (spec.passed === false) {
              console.log("\n");
              console.log(color(description.join(" ") + " " + spec.description, "red"));
              console.log(color(spec.messages, "red"));
            }
          }
          description.push(suite.description);
          _results.push(this.logFailed(suite.suites, description));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    JasminePhantomNode.prototype.tabs = function(number) {
      var tabs, _i, _results;
      if (number === 0) {
        return "\n";
      } else {
        tabs = new String;
        (function() {
          _results = [];
          for (var _i = 1; 1 <= number ? _i <= number : _i >= number; 1 <= number ? _i++ : _i--){ _results.push(_i); }
          return _results;
        }).apply(this).forEach(function() {
          return tabs = tabs + "  ";
        });
        return tabs;
      }
    };

    JasminePhantomNode.prototype.logStats = function(stats) {
      var outColor, output;
      outColor = stats['failures'] === 0 ? 'green' : 'red';
      output = "Specs: " + stats['specs'] + ", Failures: " + stats['failures'] + ", Time: " + stats['time'] + "s";
      console.log("\n");
      return console.log(color(output, outColor));
    };

    return JasminePhantomNode;

  })();

  module.exports = JasminePhantomNode;

}).call(this);
