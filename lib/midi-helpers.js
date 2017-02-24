const R = require('ramda')

module.exports = {
  // Sending
  noteOn,
  noteOff,
  ch: (x) => x - 1, // translate channel 1 - 16 to midi message channel
  note: notes(),
  // Utilities
  log: (a) => console.log(toHexString(a))
}

function noteOn (channel, key, velocity) { return [ 0x90 + channel, key, velocity || 100 ] }
function noteOff (channel, key, velocity) { return [ 0x80 + channel, key, velocity || 0 ] }

function notes () {
  return {
    c8: 108
  }
}

function lpad2zero (s) { return R.pipe(R.split(''), R.prepend('0'), R.takeLast(2), R.join(''))(s) }
function toHexString (a) {
  return R.pipe(
    R.map((i) => '0x' + lpad2zero(i.toString(16).toUpperCase())),
    R.join(', ')
  )(a)
}
