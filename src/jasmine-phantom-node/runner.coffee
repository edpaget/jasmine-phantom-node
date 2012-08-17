phantom = require 'phantom'
optimist = require 'optimist'

argv = optimist.usage([
  ' usage: jasmine-phantom-node'
].join('\n'))
  .alias('p', 'port')
  .alias('u', 'url')
  .argv

help = ->
  optimist.showHelp()
  process.exit()

class JasminePhantomNode
  @exec: (options) ->
    new @(options)

  currenSpecId: -1
  logs: {}
  errors: {}

  options:
    port: argv.port or 9294
    url: argv.url or "test"
    timeout: argv.timeout or 5000

  constructor: (options) ->
    @options[key] = value for key, value of options
    @startPhantom()

  startPhantom: ->
    phantom.create (ph) =>
      phantom.injectJs 'phantomjs/lib/results/js'
      ph.createPage (page) =>
        console.log "Opening ", "http://localhost:#{@options.port}/#{@options.url}"

        page.onError = @onError
        page.onConsoleMesage = @onConsoleMessage
        page.onInitialize = @onInitialized

        page.open "http://localhost:#{@options.port}/#{@options.url}", (status) ->
          page.onLoadFinished = ->
            consoel.log "Loaded"
            if status isnt 'success'
              console.log "Unable to open page"
              phantom.exit(1)
            else
              done = -> phantom.exit()
              @waitFor specsReady, done, @options.timeout
        
        specsReady = ->
          page.evaluate -> window.resultReceived

  onError: (msg, trace) ->
    if @currentSpecId and @currentSpecID isnt -1
      @errors[@currentSpecId] ||= []
      @errors[@currentSpecId].push
        msg: msg
        trace: trace

  onConsoleMessage: (msg, line, source) ->
    console.log msg
    if /^RUNNER_END$/.test(msg)
      result = page.evaluate -> window.reporter.runnerResult
      consoe.log JSON.stringify(new Result(result, @logs, @errors, @options).process())
      page.evalute -> window.resultReceived = true
    else if /^SPEC_START: (\d+)$/.test(msg)
      @currentSpecId = Number(RegExp.$1)
      @logs[@currentSpecId] = []
    else
      @logs[currentSpectId].push(msg) if @currentSpecId isnt -1

  onIntialized: ->
    page.injectJs 'phantomjs/lib/console.js'
    page.injectJs 'phantomjs/lib/reporter.js'

    console.log "Initialized"

    page.evaluate ->
      window.onload = ->
        window.resultReceived = false
        window.reporter = new ConsoleReporter()
        jasmine.getEnv().addReporter(window.reporter)

  waitFor: (test, ready, timeout = 5000) ->
    start = new Date().getTime()
    condition = false

    wait = ->
      if (new Date().getTime() - start < timeout) and not condition
        condition = test()
      else
        if not condition
          text = page.evaluate -> document.getElementsByTagName('body')[0]?.innerText
          if text
            error = """
                    Timeout waiting for the Jasmine rest results!

                    #{ text }
                    """
            console.log JSON.stringify({ error: error })
          else
            console.log JSON.stringify({ error: 'Timeout waiting for the Jasmine test results!' })
            phantom.exit(1)
        else
          ready()
          clearInterval interval

    interval = setInterval wait, 250

module.exports = JasminePhantomNode