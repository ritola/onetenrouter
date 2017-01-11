const midi = require('./lib/bacon-midi')
const R = require('ramda')

console.log('Input ports:', midi.input.ports())
console.log('Output ports:', midi.output.ports())

console.log('Opening input port 1: ' + midi.input.ports()[1])
var input = midi.input.open(1, { sysex: true })

console.log('Opening output port 1: ' + midi.output.ports()[1])
var output = midi.output.open(1)

var inStream = input.stream.map('.message')

inStream.log()

inStream
  .filter(R.equals([144, 109, 1])) // Play-button down
  .onValue(() => {
    output.send([0xF0, 0x00, 0x01, 0x60, 0x01, 0x00, 0xF7]) // Mode: C1 (C+S+C)
  })

inStream
  .filter(R.equals([144, 110, 1])) // Cue-button down
  .onValue(() => {
    output.send([0xF0, 0x00, 0x01, 0x60, 0x01, 0x01, 0xF7]) // Mode: S5 (B+S+S)
  })

inStream
  .filter(R.equals([144, 111, 1])) // Sync-button down
  .onValue(() => {
    output.send([0xF0, 0x00, 0x01, 0x60, 0x01, 0x02, 0xF7]) // Mode: S3 (S+S+B)
  })

inStream
  .filter(R.equals([144, 112, 1])) // Tap-button down
  .onValue(() => {
    output.send([0xF0, 0x00, 0x01, 0x60, 0x01, 0x03, 0xF7]) // Mode: S3 + S5 (S+S+S)
  })

inStream
  .filter(R.equals([144, 48, 1])) // Play-button down
  .onValue(() => {
    output.send([0xF0, 0x00, 0x01, 0x60, 0x01, 0x04, 0xF7]) // Mode: Buttons (B+S+B)
  })

inStream
  .filter(R.equals([144, 50, 1])) // Play-button down
  .onValue(() => {
    output.send([0xF0, 0x00, 0x01, 0x60, 0x10, channel, 0xF7]) // Compatibility mode
  })

const channel = 0 // midi channel

output.send([0xF0, 0x7E, channel, 0x06, 0x01, 0xF7])
// Turn off Stanton logo
output.send([0x90, 0x7A, 0x00])

// input.close()
