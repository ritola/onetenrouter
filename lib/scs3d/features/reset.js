const { deckA, deckB, pitchBlue, stanton,
        fx, eq, loop, trig, vinyl, deck,
        b11, b12, b13, b14
      } = require('../midi-map')

module.exports = function (controller) {
  controller.led(deckA, controller.index === 0 ? 1 : 0)
  controller.led(deckB, controller.index === 1 ? 1 : 0)

  controller.leds([pitchBlue, stanton], 1)
  controller.leds([fx, eq, loop, trig, vinyl, deck], 0)
  controller.leds([b11, b12, b13, b14], 0)
  controller.surface.leds.setRingBlack()
}
