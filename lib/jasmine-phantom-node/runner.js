(function() {
  var JasminePhantomNode, argv, help, optimist, phantom;

  phantom = require('phantom');

  optimist = require('optimist');

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
      url: argv.url || "test"
    };

    function JasminePhantomNode(options) {
      var key, value;
      for (key in options) {
        value = options[key];
        options[key] = value;
      }
      this.startPhantom();
    }

    JasminePhantomNode.prototype.startPhantom = function() {
      var _this = this;
      return phantom.create(function(ph) {
        return ph.createPage(function(page) {
          console.log("Opening ", "http://localhost:" + _this.options.port + "/" + _this.options.url);
          return page.open("http://localhost:" + _this.options.port + "/" + _this.options.url, function(status) {
            console.log("Opened?", status);
            return ph.exit();
          });
        });
      });
    };

    return JasminePhantomNode;

  })();

  module.exports = JasminePhantomNode;

}).call(this);
