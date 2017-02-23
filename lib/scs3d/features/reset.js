const { deckA, deckB, pitchBlue, stanton,
        fx, eq, loop, trig, vinyl, deck
      } = require('../midi-map')

module.exports = function (controller) {
  controller.led(deckA, controller.index === 0 ? 1 : 0)
  controller.led(deckB, controller.index === 1 ? 1 : 0)
  controller.leds([pitchBlue, stanton], 1)

  controller.leds([fx, eq, loop, trig, vinyl, deck], 0)

  controller.surface.leds.setRingBlack()
  controller.button.b11.ledOnPress(0x02, 0x01)
  controller.button.b12.ledOnPress(0x02, 0x01)
  controller.button.b13.ledOnPress(0x02, 0x01)
  controller.button.b14.ledOnPress(0x02, 0x01)
  controller.button.play.ledOnPress(0x00, 0x01)
  controller.button.cue.ledOnPress(0x00, 0x01)
  controller.button.sync.ledOnPress(0x00, 0x01)
  controller.button.tap.ledOnPress(0x00, 0x01)
}
