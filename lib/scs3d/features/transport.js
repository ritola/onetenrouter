const Bacon = require('baconjs')
const R = require('ramda')

const { note, ch, isNoteOn, noteOn, noteOff, isSpecificNote, translate } = require('../../midi-helpers')
const { play, cue, sync, tap } = require('../midi-map')

module.exports = function (controllers, virtual) {
  R.forEach((controller) => {
    controller.leds([play, cue, sync, tap], 0)
  })(controllers)

  const playPresses = Bacon.mergeAll(R.map((c) => c.button.play.onPress.map(mapPress, c.index), controllers))

  playPresses.onValue((o) => {
    const message = isNoteOn(o.midi) ? noteOn : noteOff
    virtual.output.send(message(ch(8 + o.index), note.c8))
  })

  virtual.input.stream.map('.message')
    .filter(isSpecificNote(note.c8)) // TODO Use translated values here
    .map(translate)
    .map((x) => R.assoc('controller', x.channel - ch(8), x))
    .map((x) => R.assoc('color', x.velocity ? 1 : 0, x))
    .onValue((x) => {
      const controller = R.head(R.filter(controllerIndex(x.controller))(controllers))
      controller.led(play, x.color)
    })
}

function mapPress (index, midi) {
  return { index, midi }
}

function controllerIndex (i) { return (c) => c.index === i }
