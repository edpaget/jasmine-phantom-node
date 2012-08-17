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

  options:
    port: argv.port or 9294
    url: argv.url or "test"

  constructor: (options) ->
    options[key] = value for key, value of options
    @startPhantom()

  startPhantom: ->
    phantom.create (ph) =>
      ph.createPage (page) =>
        console.log "Opening ", "http://localhost:#{@options.port}/#{@options.url}"
        page.open "http://localhost:#{@options.port}/#{@options.url}", (status) ->
          console.log "Opened?", status
          ph.exit()

module.exports = JasminePhantomNode