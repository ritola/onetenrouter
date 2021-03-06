const Bacon = require('baconjs')
const midi = require('midi')
const R = require('ramda')

const midiInput = _new(midi.input)
const midiOutput = _new(midi.input)

module.exports = {
  input: input(),
  output: output()
}

function input () {
  return {
    ports: R.partial(enumeratePorts, [midiInput]),
    open: R.partial(openInputPort, [midi.input]),
    openVirtual: R.partial(openVirtualInputPort, [midi.input])
  }
}

function output () {
  return {
    ports: R.partial(enumeratePorts, [midiOutput]),
    open: R.partial(openOutputPort, [midi.output]),
    openVirtual: R.partial(openVirtualOutputPort, [midi.output])
  }
}

function enumeratePorts (io) {
  var o = {}
  var portCount = io.getPortCount()
  for (var i = 0; i < portCount; i++) {
    o[i] = io.getPortName(i)
  }
//  io.openPort(0) // To suppress warning about callback
//  io.closePort() // To let application end if the IO is not opened
  return o
}

function openInputPort (Io, index, options) {
  const input = new Io()
  options = options || {}

  const stream = Bacon.fromEvent(input, 'message', transformMidiMessage)

  input.ignoreTypes(!options.sysex, !options.timing, !options.activeSensing)
  input.openPort(index)

  return {
    close: () => { input.closePort() },
    stream: stream
  }
}

function openVirtualInputPort (Io, name) {
  const input = new Io()

  const stream = Bacon.fromEvent(input, 'message', transformMidiMessage)

  input.openVirtualPort(name)

  return {
    close: () => { input.closePort() },
    stream: stream
  }
}

function transformMidiMessage (deltaTime, message) { return { deltaTime, message } }

function openOutputPort (Io, index) {
  const output = new Io()
  output.openPort(index)
  return {
    close: () => { output.closePort() },
    send: (message) => {
      sendArray(message)
    }
  }

  function sendArray (a) { output.sendMessage(a) }
}

function openVirtualOutputPort (Io, name) {
  const output = new Io()
  output.openVirtualPort(name)
  return {
    close: () => { output.closePort() },
    send: (message) => {
      sendArray(message)
    }
  }

  function sendArray (a) { output.sendMessage(a) }
}

function _new (Io) { return new Io() } // StandardJS compatibility
