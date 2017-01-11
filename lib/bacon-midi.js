const midi = require('midi')
const R = require('ramda')

module.exports = {
  input: input(),
  output: output()
}

function input () {
  return {
    ports: R.partial(enumeratePorts, [midi.input]),
    open: R.partial(openPort, [midi.input])
  }
}

function output () {
  return {
    ports: R.partial(enumeratePorts, [midi.output])
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

function openPort (Io, index) {
  const io = new Io()
  io.openPort(index)
  return {
    close: () => { io.closePort() }
  }
}
