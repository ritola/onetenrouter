const Bacon = require('baconjs')
const R = require('ramda')

const { note, ch, noteOn, noteOff } = require('../../midi-helpers')
const { play, cue, sync, tap } = require('../midi-map')
const { translate } = require('../../midi-translated')

module.exports = function (controllers, virtual) {
  R.forEach((controller) => {
    controller.leds([play, cue, sync, tap], 0)
  })(controllers)

  const playPresses = Bacon.mergeAll(R.map((c) => c.button.play.onPress, controllers))

  playPresses.onValue((x) => {
    const message = x.noteOn ? noteOn : noteOff
    virtual.output.send(message(ch(8 + x.index), note.c8))
  })

  virtual.input.stream.map('.message').map(translate)
    .filter(R.propEq('key', note.c8))
    .map((x) => R.assoc('controller', x.channel - ch(8), x))
    .map((x) => R.assoc('color', x.velocity ? 1 : 0, x))
    .onValue((x) => {
      const controller = R.head(R.filter(controllerIndex(x.controller))(controllers))
      controller.led(play, x.color)
    })
}

function controllerIndex (i) { return (c) => c.index === i }
