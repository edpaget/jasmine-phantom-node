phantom = require 'phantom'

class JasminePhantomNode
  options:
    port: 9294
    url: "http://localhost:#{@port}/test"

  constructor: (options) ->
    options[key] = value for key, value of options

    phantom.create 