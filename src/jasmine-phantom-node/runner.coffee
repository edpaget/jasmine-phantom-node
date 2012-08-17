optimist = require 'optimist'
{exec} = require 'child_process'
color = require('ansi-color').set

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

  options:
    port: argv.port or 9294
    url: argv.url or "test"
    timeout: argv.timeout or 5000

  constructor: (options) ->
    @options[key] = value for key, value of options
    @startPhantom()

  startPhantom: =>
    phantom = exec "phantomjs #{@phantomScript} http://localhost:#{@options.port}/#{@options.url} #{@options.timeout}", (err, stdout, stderr) =>
      if err
        console.log err
        throw err
      @processOutput(stdout)

  phantomScript: "lib/jasmine-phantom-node/phantomjs/phantom.js"

  processOutput: (json) ->
    results = JSON.parse(json)
    passedSuites = new Array
    failedSuites = new Array
    for suite in results['suites']
      if suite['passed']
        passedSuites << suite
      else
        failedSuites << suite
    
    @logPassed passedSuites
    @logFailed failedSuites
    @logStats results['stats']

    if results['passed']
      process.exit 0
    else
      process.exit 1

  logPassed: (specs) ->
    console.log

  logFailed: (specs) ->
  logStats: (stats) ->
    outColor = if stats['failures'] == 0 then 'green' else 'red'
    output = "Specs: #{stats['specs']}, Failures: #{stats['failures']}, Time: #{stats['time']}"
    console.log color(output, outColor)

module.exports = JasminePhantomNode