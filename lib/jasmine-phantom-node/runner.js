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

    JasminePhantomNode.prototype.options = {
      port: 9294,
      url: "http://localhost:" + JasminePhantomNode.port + "/test"
    };

    function JasminePhantomNode(options) {
      var key, value,
        _this = this;
      for (key in options) {
        value = options[key];
        options[key] = value;
      }
      phantom.create(function(ph) {
        return ph.createPage(function(page) {
          return page.open(_this.options.url, function(status) {
            return console.log("Opened?", status);
          });
        });
      });
    }

    return JasminePhantomNode;

  })();

  module.exports = Runner;

}).call(this);
