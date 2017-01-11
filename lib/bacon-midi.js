const Bacon = require('baconjs')
const midi = require('midi')
const R = require('ramda')

module.exports = {
  input: input(),
  output: output()
}

function input () {
  return {
    ports: R.partial(enumeratePorts, [midi.input]),
    open: R.partial(openInputPort, [midi.input])
  }
}

function output () {
  return {
    ports: R.partial(enumeratePorts, [midi.output]),
    open: R.partial(openOutputPort, [midi.output])
  }
}

function enumeratePorts (Io) {
  const io = new Io()
  var a = []
  var portCount = io.getPortCount()
  for (var i = 0; i < portCount; i++) {
    a.push(io.getPortName(i))
  }
  io.openPort(0) // To suppress warning about callback
  io.closePort() // To let application end if the IO is not opened
  return a
}

function openInputPort (Io, index, options) {
  options = options || {}

  const input = new Io()
  const stream = Bacon.fromEvent(input, 'message', transformMidiMessage)

  input.ignoreTypes(!options.sysex, !options.timing, !options.activeSensing)
  input.openPort(index)

  return {
    close: () => { input.closePort() },
    stream: stream
  }

  function transformMidiMessage (deltaTime, message) { return { deltaTime, message } }
}

function openOutputPort (Io, index) {
  const output = new Io()
  output.openPort(index)
  return {
    send: (message) => {
      sendArray(message)
    }
  }

  function sendArray (a) { output.sendMessage(a) }
}
