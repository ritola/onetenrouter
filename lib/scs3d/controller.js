/*
  Controller gives context between midi message and controller.

  Parameters:
  - input: opened bacon-midi stream
  - output: opened bacon-midi stream

  const midi = require('./bacon-midi')
  controller.init(
    midi.input.open(1, { sysex: true }),
    midi.output.open(1)
  )
*/

const R = require('ramda')

const midi = require('./midi-map')
const midiHelpers = require('../midi-helpers')
const { translate, isSpecificNote, isSpecificNoteOn, isSpecificNoteOff } = require('../midi-translated')

module.exports = {
  init: function (index, input, output) {
    const inStream = input.stream
      .map('.message')
      .doAction(midiHelpers.log)
      .map(translate)
      .map(R.assoc('index', index))

    const midiChannel = 0

    return {
      index,
      led: (led, index) => { sendNoteOn(led.key, led.colors[index]) },
      leds: (leds, index) => { R.forEach((led) => sendNoteOn(led.key, led.colors[index]), leds) },

      version: () => {
        const promise = inStream.map('.data')
          .filter(R.and(R.pipe(R.take(12),
            R.equals([0xF0, 0x7E, 0x00, 0x06, 0x02, 0x00, 0x01, 0x60, 0x2C, 0x01, 0x01, 0x00])),
            R.pipe(R.takeLast(1), R.equals([0xF7]))))
          .map(R.drop(12))
          .map((a) => { return { version: a[0], date: toDate(2008 + a[1], a[2], a[3]) } })
          .firstToPromise()

        output.send([0xF0, 0x7E, midiChannel, 0x06, 0x01, 0xF7])

        return promise
      },

      extinguishAllLeds: () => { sendCC(0x7B, 0x00) },

      surface: {
        circle: {
          setMode: () => { output.send([0xF0, 0x00, 0x01, 0x60, 0x01, 0x00, 0xF7]) },
          onPress: onSpecificNote(1)
        },
        setSlidersMode: () => { output.send([0xF0, 0x00, 0x01, 0x60, 0x01, 0x03, 0xF7]) },
        setButtonsMode: () => { output.send([0xF0, 0x00, 0x01, 0x60, 0x01, 0x04, 0xF7]) },
        setButtonsLeftMode: () => { output.send([0xF0, 0x00, 0x01, 0x60, 0x01, 0x01, 0xF7]) },
        setButtonsRightMode: () => { output.send([0xF0, 0x00, 0x01, 0x60, 0x01, 0x02, 0xF7]) },
        setCompatibilityMode: () => { output.send([0xF0, 0x00, 0x01, 0x60, 0x10, midiChannel, 0xF7]) },
        leds: {
          setRingPosition: setRingPosition,
          setRingLeft: (color) => { R.forEach((x) => (sendNoteOn(x, color)), R.range(0x5e, 0x63 + 1)) },
          setRingRight: (color) => { R.forEach((x) => (sendNoteOn(x, color)), R.range(0x66, 0x6b + 1)) },
          setRingAll: (color) => { R.forEach((x) => (sendNoteOn(x, color)), R.range(0x5d, 0x6c + 1)) },
          setRingBlack: setRingBlack
        }
      },

      button: {
        fx: noteAndLed(midi.fx),
        eq: noteAndLed(midi.eq),
        loop: noteAndLed(midi.loop),
        trig: noteAndLed(midi.trig),
        vinyl: noteAndLed(midi.vinyl),
        deck: noteAndLed(midi.deck),
        b11: noteAndLed(midi.b11),
        b12: noteAndLed(midi.b12),
        b13: noteAndLed(midi.b13),
        b14: noteAndLed(midi.b14),
        play: noteAndLed(midi.play),
        cue: noteAndLed(midi.cue),
        sync: noteAndLed(midi.sync),
        tap: noteAndLed(midi.tap)
      },

      sendNoteOn,
      sendCC
    }

    function noteAndLed (led) {
      const onPress = onSpecificNote(led.key)
      const setLed = (color) => { sendNoteOn(led.key, led.colors[color]) }
      const ledOnPress = (up, down) => {
        setLed(up)
        onPress.filter(isSpecificNoteOn(led.key)).onValue(() => { setLed(down) })
        onPress.filter(isSpecificNoteOff(led.key)).onValue(() => { setLed(up) })
      }
      return { onPress, setLed, ledOnPress }
    }

    function onSpecificNote (key) { return inStream.filter(isSpecificNote(key)) }

    function sendCC (controller, value) { output.send([0xB0 + midiChannel, controller, value]) }
    function sendNoteOn (key, value) { output.send([0x90 + midiChannel, key, value]) }

    function setRingBlack () { R.forEach((x) => (sendNoteOn(x.key, 0)), midi.ring) }
    function setRingPosition (position, length, noReset) {
      if (!noReset) setRingBlack()
      if (length <= 0) return
      sendNoteOn(midi.ring[position % midi.ring.length].key, 1)
      setRingPosition(position - 1, length - 1, true)
    }

    function lpad2zero (s) { return R.pipe(R.split(''), R.prepend('0'), R.takeLast(2), R.join(''))(s) }
    function toDate (y, m, d) { return y + '-' + lpad2zero('' + m) + '-' + lpad2zero('' + d) }
  },
  isValidControllerName: (name) => { return name.startsWith('SCS.3d') }
}
