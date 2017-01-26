const midi = require('./lib/bacon-midi')
const Scs3d = require('./lib/stanton-scs3d')

console.log('Input ports:', midi.input.ports())
console.log('Output ports:', midi.output.ports())

console.log('Using input port 1: ' + midi.input.ports()[1])
console.log('Using output port 1: ' + midi.output.ports()[1])

const scs3d = Scs3d(
  midi.input.open(1, { sysex: true }),
  midi.output.open(1)
)

scs3d.version.query()
scs3d.version.stream.log('Stanton SCS.3d')

scs3d.version.stream.onValue(reset)

function reset () {
  scs3d.leds.logo(0x00)
  scs3d.extinguishAllLeds()
  scs3d.leds.deckA(0x00)
  scs3d.leds.deckB(0x00)
  scs3d.surface.leds.setAllBlack()
  scs3d.surface.leds.setCircleAll(0x00)
  scs3d.button.mode.fx.ledOnPress(0x02, 0x01)
  scs3d.button.mode.eq.ledOnPress(0x02, 0x01)
  scs3d.button.mode.loop.ledOnPress(0x02, 0x01)
  scs3d.button.mode.trig.ledOnPress(0x02, 0x01)
  scs3d.button.mode.vinyl.ledOnPress(0x02, 0x01)
  scs3d.button.mode.deck.ledOnPress(0x02, 0x01)
  scs3d.button.soft.b11.ledOnPress(0x02, 0x01)
  scs3d.button.soft.b12.ledOnPress(0x02, 0x01)
  scs3d.button.soft.b13.ledOnPress(0x02, 0x01)
  scs3d.button.soft.b14.ledOnPress(0x02, 0x01)
  scs3d.button.transport.play.ledOnPress(0x00, 0x01)
  scs3d.button.transport.cue.ledOnPress(0x00, 0x01)
  scs3d.button.transport.sync.ledOnPress(0x00, 0x01)
  scs3d.button.transport.tap.ledOnPress(0x00, 0x01)
  scs3d.leds.logo(0x01)
  scs3d.test()
}

scs3d.button.transport.play.stream.onValue(() => { scs3d.surface.mode.setCircle() })
scs3d.button.transport.cue.stream.onValue(() => { scs3d.surface.mode.setSliders() })
scs3d.button.transport.sync.stream.onValue(() => { scs3d.surface.mode.setButtons() })
scs3d.button.transport.tap.stream.onValue(() => { scs3d.button.mode.setAll(0x02) })
