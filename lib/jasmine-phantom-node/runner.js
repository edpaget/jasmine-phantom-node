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

    JasminePhantomNode.prototype.currenSpecId = -1;

    JasminePhantomNode.prototype.logs = {};

    JasminePhantomNode.prototype.errors = {};

    JasminePhantomNode.prototype.options = {
      port: argv.port || 9294,
      url: argv.url || "test",
      timeout: argv.timeout || 5000
    };

    function JasminePhantomNode(options) {
      var key, value;
      for (key in options) {
        value = options[key];
        this.options[key] = value;
      }
      this.startPhantom();
    }

    JasminePhantomNode.prototype.startPhantom = function() {
      var _this = this;
      return phantom.create(function(ph) {
        return ph.createPage(function(page) {
          var specsReady;
          console.log("Opening ", "http://localhost:" + _this.options.port + "/" + _this.options.url);
          page.onError = _this.onError;
          page.onConsoleMesage = _this.onConsoleMessage;
          page.onInitialize = _this.onInitialized;
          page.open("http://localhost:" + _this.options.port + "/" + _this.options.url, function(status) {
            return page.onLoadFinished = function() {
              var done;
              if (status !== 'success') {
                console.log("Unable to open page");
                return phantom.exit(1);
              } else {
                done = function() {
                  return phantom.exit();
                };
                return this.waitFor(specsReady, done, this.options.timeout);
              }
            };
          });
          return specsReady = function() {
            return page.evaluate(function() {
              return window.resultReceived;
            });
          };
        });
      });
    };

    JasminePhantomNode.prototype.onError = function(msg, trace) {
      var _base, _name;
      if (this.currentSpecId && this.currentSpecID !== -1) {
        (_base = this.errors)[_name = this.currentSpecId] || (_base[_name] = []);
        return this.errors[this.currentSpecId].push({
          msg: msg,
          trace: trace
        });
      }
    };

    JasminePhantomNode.prototype.onConsoleMessage = function(msg, line, source) {
      var result;
      if (/^RUNNER_END$/.test(msg)) {
        result = page.evaluate(function() {
          return window.reporter.runnerResult;
        });
        consoe.log(JSON.stringify(new Result(result, this.logs, this.errors, this.options).process()));
        return page.evalute(function() {
          return window.resultReceived = true;
        });
      } else if (/^SPEC_START: (\d+)$/.test(msg)) {
        this.currentSpecId = Number(RegExp.$1);
        return this.logs[this.currentSpecId] = [];
      } else {
        if (this.currentSpecId !== -1) {
          return this.logs[currentSpectId].push(msg);
        }
      }
    };

    JasminePhantomNode.prototype.onIntialized = function() {
      page.injectJs('phantomjs/lib/console.js');
      page.injectJs('phantomjs/lib/reporter.js');
      page.injectJs('phantomjs/lib/result/js');
      return page.evaluate(function() {
        return window.onload = function() {
          window.resultReceived = false;
          window.reporter = new ConsoleReporter();
          return jasmine.getEnv().addReporter(window.reporter);
        };
      });
    };

    JasminePhantomNode.prototype.waitFor = function(test, ready, timeout) {
      var condition, interval, start, wait;
      if (timeout == null) {
        timeout = 5000;
      }
      start = new Date().getTime();
      condition = false;
      wait = function() {
        var error, text;
        if ((new Date().getTime() - start < timeout) && !condition) {
          return condition = test();
        } else {
          if (!condition) {
            text = page.evaluate(function() {
              var _ref;
              return (_ref = document.getElementsByTagName('body')[0]) != null ? _ref.innerText : void 0;
            });
            if (text) {
              error = "Timeout waiting for the Jasmine rest results!\n\n" + text;
              return console.log(JSON.stringify({
                error: error
              }));
            } else {
              console.log(JSON.stringify({
                error: 'Timeout waiting for the Jasmine test results!'
              }));
              return phantom.exit(1);
            }
          } else {
            ready();
            return clearInterval(interval);
          }
        }
      };
      return interval = setInterval(wait, 250);
    };

    return JasminePhantomNode;

  })();

  module.exports = JasminePhantomNode;

}).call(this);
