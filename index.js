const Bacon = require('baconjs')
const midi = require('./lib/bacon-midi')
const R = require('ramda')
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
  scs3d.led(scs3d.leds.stanton, 1)
  scs3d.extinguishAllLeds()

  const buttonsAndLeds = R.mergeAll(R.concat(
    [scs3d.buttons.mode, scs3d.buttons.soft, scs3d.buttons.transport, scs3d.leds],
    [R.concat(scs3d.surface.ring, scs3d.surface.leds)]))
  const ledsOnY = (y) => { return R.values(R.filter(R.propEq('y', y), buttonsAndLeds)) }

  const setLedOnY = (y, color) => {
    R.forEach((button) => { scs3d.sendNoteOn(button.key, (color) ? R.last(button.colors) : 0) }, ledsOnY(y))
  }

  const sliders = R.concat(scs3d.sliderXY.gain, scs3d.sliderXY.pitch)
  const sliderLedsOnY = (y) => { return R.values(R.filter(R.propEq('y', y), sliders)) }

  const setSliderLedOnY = (y) => {
    R.forEach((controller) => { scs3d.sendCC(controller.cc, controller.value) }, sliderLedsOnY(y))
  }

  Bacon.repeatedly(5, R.range(1, 250)).onValue((y) => {
    setLedOnY(y, true)
    setLedOnY(y - 50, false)
    setSliderLedOnY(y - 10)
  })

  const loopThrough = (led) => {
    Bacon.repeatedly(300, led.colors).onValue(
        (c) => { console.log(c); scs3d.sendNoteOn(led.key, c) }
      )
  }

  const loopThroughCC = (controller) => {
    Bacon.repeatedly(100, R.range(0, 2)).onValue(
        (c) => { console.log(c); scs3d.sendCC(controller, c) }
      )
  }

//  loopThroughCC(0x07)

 // loopThrough(scs3d.surface.ring[0])

/*
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
*/
}

scs3d.button.transport.play.stream.onValue(() => { scs3d.surface_.mode.setCircle() })
scs3d.button.transport.cue.stream.onValue(() => { scs3d.surface_.mode.setSliders() })
scs3d.button.transport.sync.stream.onValue(() => { scs3d.surface_.mode.setButtons() })
scs3d.button.transport.tap.stream.onValue(() => { scs3d.button.mode.setAll(0x02) })
