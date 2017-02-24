const Bacon = require('baconjs')
const R = require('ramda')

const { note, ch, noteOn, noteOff } = require('../../midi-helpers')
const { play, cue, sync, tap } = require('../midi-map')
const { translate } = require('../../midi-translated')

module.exports = function (controllers, virtual) {
  R.forEach((controller) => {
    controller.leds([play, cue], 0)
    controller.button.sync.ledOnPress(0, 1)
    controller.button.tap.ledOnPress(0, 1)
  })(controllers)

  const playPresses = Bacon.mergeAll(R.map((c) => c.button.play.onPress, controllers))
  const cuePresses = Bacon.mergeAll(R.map((c) => c.button.cue.onPress, controllers))
  const syncPresses = Bacon.mergeAll(R.map((c) => c.button.sync.onPress, controllers)).filter(R.prop('noteOn'))

  playPresses.onValue((x) => {
    const message = x.noteOn ? noteOn : noteOff
    virtual.output.send(message(ch(8 + x.index), note.c8))
  })

  cuePresses.onValue((x) => {
    const message = x.noteOn ? noteOn : noteOff
    virtual.output.send(message(ch(8 + x.index), note.aX7))
  })

  syncPresses.onValue((x) => virtual.output.send(noteOn(ch(8 + x.index), note.d8)))

  const traktorStream = virtual.input.stream.map('.message').map(translate)

  traktorStream
    .filter(R.propEq('key', note.c8))
    .map((x) => R.assoc('controller', x.channel - ch(8), x))
    .map((x) => R.assoc('color', x.velocity ? 1 : 0, x))
    .onValue((x) => {
      const controller = R.head(R.filter(controllerIndex(x.controller))(controllers))
      controller.led(play, x.color)
    })

  traktorStream
    .filter(R.propEq('key', note.aX7))
    .map((x) => R.assoc('controller', x.channel - ch(8), x))
    .map((x) => R.assoc('color', x.velocity ? 1 : 0, x))
    .onValue((x) => {
      const controller = R.head(R.filter(controllerIndex(x.controller))(controllers))
      controller.led(cue, x.color)
    })

}

function controllerIndex (i) { return (c) => c.index === i }
