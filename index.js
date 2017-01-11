var midi = require('./lib/bacon-midi')

console.log(midi.input.ports())
console.log('Opening port 1: ' + midi.input.ports()[1])

var input = midi.input.open(1)
input.stream.log()

// input.close()
