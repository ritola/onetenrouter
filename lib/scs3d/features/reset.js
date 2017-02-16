module.exports = function (scs3d) {
  scs3d.leds.deckA(0x00)
  scs3d.leds.deckB(0x00)
  scs3d.surface.leds.setAllBlack()
  scs3d.surface.leds.setCircleAll(0x00)
  scs3d.button.mode.setAll(2)
  scs3d.button.mode.deck.ledOnPress(0x02, 0x01)
  scs3d.button.soft.b11.ledOnPress(0x02, 0x01)
  scs3d.button.soft.b12.ledOnPress(0x02, 0x01)
  scs3d.button.soft.b13.ledOnPress(0x02, 0x01)
  scs3d.button.soft.b14.ledOnPress(0x02, 0x01)
  scs3d.button.transport.play.ledOnPress(0x00, 0x01)
  scs3d.button.transport.cue.ledOnPress(0x00, 0x01)
  scs3d.button.transport.sync.ledOnPress(0x00, 0x01)
  scs3d.button.transport.tap.ledOnPress(0x00, 0x01)
  scs3d.leds.pitchBlue(0x01)
  scs3d.leds.stanton(0x01)

  scs3d.button.mode.vinyl.stream.onValue(() => {
    scs3d.button.mode.setAll(2)
    scs3d.button.mode.vinyl.setLed(1)
    scs3d.surface.mode.setCircle()
  })
  scs3d.button.mode.eq.stream.onValue(() => {
    scs3d.button.mode.setAll(2)
    scs3d.button.mode.eq.setLed(1)
    scs3d.surface.mode.setSliders()
  })
  scs3d.button.mode.fx.stream.onValue(() => {
    scs3d.button.mode.setAll(2)
    scs3d.button.mode.fx.setLed(1)
    scs3d.surface.mode.setSliders()
  })
  scs3d.button.mode.trig.stream.onValue(() => {
    scs3d.button.mode.setAll(2)
    scs3d.button.mode.trig.setLed(1)
    scs3d.surface.mode.setButtons()
  })
  scs3d.button.mode.loop.stream.onValue(() => {
    scs3d.button.mode.setAll(2)
    scs3d.button.mode.loop.setLed(1)
    scs3d.surface.mode.setButtons()
  })
}
