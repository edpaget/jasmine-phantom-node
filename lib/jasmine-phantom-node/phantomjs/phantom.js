(function() {
  var currentSpecId, errors, logs, options, page, specsReady, waitFor;

  phantom.injectJs('lib/result.js');

  options = {
    url: phantom.args[0] || 'http://127.0.0.1:9294/test',
    timeout: parseInt(phantom.args[1] || 5000)
  };

  page = require('webpage').create();

  currentSpecId = -1;

  logs = {};

  errors = {};

  page.onError = function(msg, trace) {
    if (currentSpecId && currentSpecId !== -1) {
      errors[currentSpecId] || (errors[currentSpecId] = []);
      return errors[currentSpecId].push({
        msg: msg,
        trace: trace
      });
    }
  };

  page.onConsoleMessage = function(msg, line, source) {
    var result;
    if (/^RUNNER_END$/.test(msg)) {
      result = page.evaluate(function() {
        return window.reporter.runnerResult;
      });
      console.log(JSON.stringify(new Result(result, logs, errors, options).process()));
      return page.evaluate(function() {
        return window.resultReceived = true;
      });
    } else if (/^SPEC_START: (\d+)$/.test(msg)) {
      currentSpecId = Number(RegExp.$1);
      return logs[currentSpecId] = [];
    } else {
      if (currentSpecId !== -1) {
        return logs[currentSpecId].push(msg);
      }
    }
  };

  page.onInitialized = function() {
    page.injectJs('lib/console.js');
    page.injectJs('lib/reporter.js');
    return page.evaluate(function() {
      return window.onload = function() {
        var key;
        window.resultReceived = false;
        window.reporter = new ConsoleReporter();
        jasmine.getEnv().addReporter(window.reporter);
        if (window.hasOwnProperty('specs')) {
          for (key in specs.modules) {
            specs(key);
          }
        }
        return jasmine.getEnv().execute();
      };
    });
  };

  page.open(options.url, function(status) {
    var done;
    page.onLoadFinished = function() {};
    if (status !== 'success') {
      console.log(JSON.stringify({
        error: "Unable to access Jasmine specs at " + options.url
      }));
      return phantom.exit();
    } else {
      done = function() {
        return phantom.exit();
      };
      return waitFor(specsReady, done, options.timeout);
    }
  });

  specsReady = function() {
    return page.evaluate(function() {
      return window.resultReceived;
    });
  };

  waitFor = function(test, ready, timeout) {
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
            error = "Timeout waiting for the Jasmine test results!\n\n" + text;
            console.log(JSON.stringify({
              error: error
            }));
          } else {
            console.log(JSON.stringify({
              error: 'Timeout waiting for the Jasmine test results!'
            }));
          }
          return phantom.exit(1);
        } else {
          ready();
          return clearInterval(interval);
        }
      }
    };
    return interval = setInterval(wait, 250);
  };

}).call(this);
