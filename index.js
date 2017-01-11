var midi = require('./lib/bacon-midi')

var input = midi.input.open(0)
console.log(midi.input.ports())
input.close()
