optimist = require 'optimist'
fs = require 'fs'
{exec} = require 'child_process'
color = require('ansi-color').set

argv = optimist.usage([
  ' usage: jasmine-phantom-node'
].join('\n'))
  .alias('p', 'port')
  .alias('u', 'url')
  .alias('t', 'timeout')
  .boolean('e')
  .argv

help = ->
  optimist.showHelp()
  process.exit()

class JasminePhantomNode
  @exec: (options) ->
    console.log options
    new @(options)

  options:
    port: argv.port or 9294
    url: argv.url or "/test"
    timeout: argv.timeout or 5000

  constructor: (options) ->
    @options[key] = value for key, value of options
    console.log @options
    @startPhantom()

  startPhantom: =>
    phantom = exec "phantomjs #{@phantomScript()} http://localhost:#{@options.port}#{@options.url} #{@options.timeout}", (err, stdout, stderr) =>
      if err
        console.log err
        throw err
      @processOutput(stdout)

  phantomScript: ->
    __dirname + "/phantomjs/phantom.js"

  processOutput: (json) =>
    results = JSON.parse(json)
    passedSuites = new Array
    failedSuites = new Array

    console.log @options

    @logSuites results['suites']

    @logFailed results['suites']

    @logStats results['stats']

    if results['passed']
      process.exit 0
    else if @options.e
      process.exit 1
    else
      process.exit 0

  logSuites: (suites, tabDepth = 0) ->
    for suite in suites
      outColor = if suite.passed then 'green' else 'red'
      output = @tabs(tabDepth) + suite.description
      console.log color(output, outColor)
      for spec in suite.specs
        outColor = if spec.passed then 'green' else 'red'
        output = @tabs(tabDepth + 1) + spec.description
        console.log color(output, outColor)
      if suite.suites
        @logSuites(suite.suites, tabDepth + 1)

  logFailed: (suites, description = []) ->
    for suite in suites
      if suite.passed is false
        for spec in suite.specs
          if spec.passed is false
            console.log "\n"
            console.log color(description.join(" ") + " " + spec.description,
                              "red")
            console.log color(spec.messages, "red")
        description.push suite.description
        @logFailed suite.suites, description

  tabs: (number) ->
    if number is 0
      return "\n"
    else
      tabs = new String
      [1..number].forEach ->
        tabs = tabs + "  "
      return tabs

  logStats: (stats) ->
    outColor = if stats['failures'] == 0 then 'green' else 'red'
    output = "Specs: #{stats['specs']}, Failures: #{stats['failures']}, Time: #{stats['time']}s"
    console.log "\n"
    console.log color(output, outColor)

module.exports = JasminePhantomNode