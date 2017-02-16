const midi = require('./lib/bacon-midi')
const router = require('./lib/scs3d/router.js')

console.log('Midi input ports:\n', midi.input.ports())
console.log('Midi output ports:\n', midi.output.ports())

router.run(midi)
