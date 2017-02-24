const R = require('ramda')

module.exports = {
  translate: (a) => {
    return R.mergeAll([
      { data: a },
      translateNote(a)
    ])
  },
  isSpecificNote: (note) => R.propEq('key', note),
  isSpecificNoteOn: (note) => R.and(R.propEq('key', note), R.prop('noteOn')),
  isSpecificNoteOff: (note) => R.and(R.propEq('key', note), R.prop('noteOff'))
}

function translateNote (a) {
  const noteOn = noChannel(a)[0] === 0x90
  const noteOff = noChannel(a)[0] === 0x80

  if (noteOn || noteOff) {
    return {
      noteOn,
      noteOff,
      channel: a[0] & 0x0F,
      key: a[1],
      velocity: a[2]
    }
  }
}

function noChannel (a) { return R.concat([a[0] & 0xF0], R.tail(a)) }
