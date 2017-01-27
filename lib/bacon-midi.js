const Bacon = require('baconjs')
const midi = require('midi')
const R = require('ramda')

const MidiInput = midi.input
const MidiOutput = midi.output

const midiInput = new MidiInput()
const midiOutput = new MidiOutput()

module.exports = {
  input: input(),
  output: output()
}

function input () {
  return {
    ports: R.partial(enumeratePorts, [midiInput]),
    open: R.partial(openInputPort, [midiInput])
  }
}

function output () {
  return {
    ports: R.partial(enumeratePorts, [midiOutput]),
    open: R.partial(openOutputPort, [midiOutput])
  }
}

function enumeratePorts (io) {
  var a = []
  var portCount = io.getPortCount()
  for (var i = 0; i < portCount; i++) {
    a.push(io.getPortName(i))
  }
//  io.openPort(0) // To suppress warning about callback
//  io.closePort() // To let application end if the IO is not opened
  return a
}

function openInputPort (input, index, options) {
  options = options || {}

  const stream = Bacon.fromEvent(input, 'message', transformMidiMessage)

  input.ignoreTypes(!options.sysex, !options.timing, !options.activeSensing)
  input.openPort(index)

  return {
    close: () => { input.closePort() },
    stream: stream
  }

  function transformMidiMessage (deltaTime, message) { return { deltaTime, message } }
}

function openOutputPort (output, index) {
  output.openPort(index)
  return {
    send: (message) => {
      sendArray(message)
    }
  }

  function sendArray (a) { output.sendMessage(a) }
}
