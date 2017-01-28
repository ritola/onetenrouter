const Bacon = require('baconjs')
const midi = require('./lib/bacon-midi')
const R = require('ramda')
const scs = require('./lib/stanton/scs3d')

console.log('Midi input ports:\n', midi.input.ports())
console.log('Midi output ports:\n', midi.output.ports())

const scsInputs = R.filter(scs.isValidController, midi.input.ports())
const scsOutputs = R.filter(scs.isValidController, midi.output.ports())

console.log(scsInputs)

const scs3ds =
  R.map((indexes) => {
    return scs.init(
      midi.input.open(parseInt(indexes[0]), { sysex: true }),
      midi.output.open(parseInt(indexes[1]))
    )
  })((R.zip(R.keys(scsInputs), R.keys(scsOutputs))))

R.forEach((scs3d) => {
  scs3d.version.query()
  scs3d.version.stream.log('Stanton SCS.3d')
  scs3d.version.stream.onValue(reset)

  function reset () {
    const ledsOnY = (y) => { return R.values(R.filter(R.propEq('y', y), scs3d.ledPositions)) }
    const setLedOnY = (y, color) => {
      R.forEach((button) => { if (button.key) scs3d.sendNoteOn(button.key, color) }, ledsOnY(y))
    }

    const setSliderLedOnY = (y) => {
      R.forEach((button) => { if (button.cc) scs3d.sendCC(button.cc, button.value) }, ledsOnY(y))
    }

    const intro = Bacon.sequentially(3, R.range(1, 250))

    intro.onValue((y) => {
      setLedOnY(y, 1)
      setLedOnY(y - 50, 0)
      setSliderLedOnY(y)
    })

    intro.onEnd(() => {
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
    })

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
})(scs3ds)
