const Bacon = require('baconjs')
const R = require('ramda')

const { deckA, deckB } = require('../midi-map')

module.exports = function (controllers) {
  const surfacePresses = Bacon.mergeAll(R.map((c) => c.surface.circle.onPress, controllers))
  const circleStream = Bacon.repeatedly(50, R.range(0, 32)).takeUntil(surfacePresses)

  R.forEach((controller) => {
    controller.button.deck.ledOnPress(0x02, 0x01)
    controller.surface.circle.setMode()

    circleStream.onValue((x) => {
      const ring = (controller.index === 0) ? deckARing(x) : deckBRing(x)
      controller.surface.leds.setRingPosition(ring.position, ring.length)

      controller.led(deckA, flashDeckLed(controller.index, x, 0))
      controller.led(deckB, flashDeckLed(controller.index, x, 1))
    })

    controller.button.deck.onPress
      .filter('.noteOn')
      .onValue(() => { swap(controllers) })
  })(controllers)

  return circleStream.toPromise()

  function swap (controllers) {
    R.forEach((controller) => {
      controller.index = (controller.index) ? 0 : 1
    }, controllers)
  }
}

function flashDeckLed (index, counter, led) {
  return ((index === led) && (((counter >> 3) % 2) === index)) ? 1 : 0
}

function deckARing (index) {
  if (index < 1) return { position: 12, length: 1 }
  if (index < 16) return { position: 12 + index, length: 2 }
  if (index < 17) return { position: 27, length: 1 }
  return { position: 0, length: 0 }
}

function deckBRing (index) {
  if (index < 16) return { position: 0, length: 0 }
  if (index < 17) return { position: 3, length: 1 }
  if (index < 32) return { position: 36 - index, length: 2 }
  return { position: 4, length: 1 }
}
