const Bacon = require('baconjs')
const R = require('ramda')

const { isNoteOn } = require('../../midi-helpers')

module.exports = function (controllers) {
  const circleStream = Bacon.repeatedly(50, R.range(0, 32))

  init()(controllers)

  return R.forEach((controller) => {
    controller.button.mode.deck.ledOnPress(0x02, 0x01)

    circleStream.onValue((x) => {
      const a = (controller.index == 0) ? deckA(x) : deckB(x)
      controller.surface.leds.setRingPosition(a.position, a.length)
    })

    controller.button.mode.deck.stream
      .filter(isNoteOn)
      .onValue(() => { swap(controllers) })
  })(controllers)

  function init() {
    return R.forEach((controller) => {
      controller.led(controller.midi.deckA, (controller.index == 0) ? 1 : 0)
      controller.led(controller.midi.deckB, (controller.index == 1) ? 1 : 0)
    })
  }

  function swap(controllers) {
    R.forEach((controller) => {
      controller.index = (controller.index) ? 0 : 1
    })(controllers)
    init()(controllers)
  }
}

function deckA (index) {
  if (index < 1) return { position: 12, length: 1 }
  if (index < 16) return { position: 12 + index, length: 2 }
  if (index < 17) return { position: 27, length: 1 }
  return { position: 0, length: 0 }
}

function deckB (index) {
  if (index < 16) return { position: 0, length: 0 }
  if (index < 17) return { position: 3, length: 1 }
  if (index < 32) return { position: 36 - index, length: 2 }
  return { position: 4, length: 1 }
}
