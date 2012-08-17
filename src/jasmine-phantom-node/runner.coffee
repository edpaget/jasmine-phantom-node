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
  options:
    port: 9294
    url: "http://localhost:#{@port}/test"

  constructor: (options) ->
    options[key] = value for key, value of options

    phantom.create (ph) =>
      ph.createPage (page) =>
        page.open @options.url, (status) ->
          console.log "Opened?", status

module.exports = Runner