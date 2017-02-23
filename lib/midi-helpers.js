const R = require('ramda')

module.exports = {
  // Receiving
  isNoteOn: (a) => noChannel(a)[0] === 0x90,
  isSpecificNote,
  isSpecificNoteOn,
  isSpecificNoteOff,
  translate,
  // Sending
  noteOn,
  noteOff,
  ch: (x) => x - 1, // translate channel 1 - 16 to midi message channel
  note: notes(),
  // Utilities
  log: (a) => console.log(toHexString(a))
}

function translate (a) {
  return {
    noteOn: noChannel(a)[0] === 0x90,
    noteOff: noChannel(a)[0] === 0x80,
    channel: a[0] & 0x0F,
    key: a[1],
    velocity: a[2],
    midi: a
  }
}
function isSpecificNote (key) { return R.either(isSpecificNoteOff(key), isSpecificNoteOn(key)) }
function isSpecificNoteOn (key) { return R.pipe(noChannel, noVelocity, R.equals([0x90, key])) }
function isSpecificNoteOff (key) { return R.pipe(noChannel, noVelocity, R.equals([0x80, key])) }

function noteOn (channel, key, velocity) { return [ 0x90 + channel, key, velocity || 100 ] }
function noteOff (channel, key, velocity) { return [ 0x80 + channel, key, velocity || 0 ] }

function notes () {
  return {
    c8: 108
  }
}

function noVelocity (a) { return R.take(2)(a) }
function noChannel (a) { return R.concat([a[0] & 0xF0], R.tail(a)) }

function lpad2zero (s) { return R.pipe(R.split(''), R.prepend('0'), R.takeLast(2), R.join(''))(s) }
function toHexString (a) {
  return R.pipe(
    R.map((i) => '0x' + lpad2zero(i.toString(16).toUpperCase())),
    R.join(', ')
  )(a)
}
