(function() {
  var JasminePhantomNode, argv, exec, help, optimist, spawn, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  optimist = require('optimist');

  _ref = require('child_process'), spawn = _ref.spawn, exec = _ref.exec;

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
      return phantom = exec("phantomjs " + this.phantomScript + " http://localhost:" + this.options.port + "/" + this.options.url + " " + this.options.timeout, function(err, stdout, stderr) {
        if (err) {
          console.log(err);
          throw err;
        }
        return _this.processOutput(stdout);
      });
    };

    JasminePhantomNode.prototype.phantomScript = "lib/jasmine-phantom-node/phantomjs/phantom.js";

    JasminePhantomNode.prototype.processOutput = function(json) {
      var results;
      results = JSON.parse(json);
      if (results['passed']) {
        return process.exit(0);
      } else {
        return process.exit(1);
      }
    };

    return JasminePhantomNode;

  })();

  module.exports = JasminePhantomNode;

}).call(this);
