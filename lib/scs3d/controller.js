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

module.exports = {
  init: function (index, input, output) {
    const inStream = input.stream.map('.message')
    inStream.map(toHexString).log()

    const midiChannel = 0

    return {
      index,
      led: (led, index) => { sendNoteOn(led.key, led.colors[index]) },
      leds: (leds, index) => { R.forEach((led) => sendNoteOn(led.key, led.colors[index]), leds) },

      version: () => {
        const promise = inStream
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
        fx: noteAndLed(midi.fx.key),
        eq: noteAndLed(midi.eq.key),
        loop: noteAndLed(midi.loop.key),
        trig: noteAndLed(midi.trig.key),
        vinyl: noteAndLed(midi.vinyl.key),
        deck: noteAndLed(midi.deck.key),
        b11: noteAndLed(midi.b11.key),
        b12: noteAndLed(midi.b12.key),
        b13: noteAndLed(midi.b13.key),
        b14: noteAndLed(midi.b14.key),
        play: noteAndLed(midi.play.key),
        cue: noteAndLed(midi.cue.key),
        sync: noteAndLed(midi.sync.key),
        tap: noteAndLed(midi.tap.key)
      },

      sendNoteOn,
      sendCC
    }

    function noteAndLed (key) {
      const stream = onSpecificNote(key)
      const setLed = (color) => sendNoteOn(key, color)
      const ledOnPress = (up, down) => {
        setLed(up)
        stream.filter(isSpecificNoteOn(key)).onValue(() => { setLed(down) })
        stream.filter(isSpeficicNoteOff(key)).onValue(() => { setLed(up) })
      }
      return { stream, setLed, ledOnPress }
    }

    function noVelocity (a) { return R.take(2)(a) }

    function onSpecificNote (key) { return inStream.filter(R.either(isSpeficicNoteOff(key), isSpecificNoteOn(key))) }
    function isSpecificNoteOn (key) { return R.pipe(noVelocity, R.equals([0x90 + midiChannel, key])) }
    function isSpeficicNoteOff (key) { return R.pipe(noVelocity, R.equals([0x80 + midiChannel, key])) }
    function sendCC (controller, value) { output.send([0xB0 + midiChannel, controller, value]) }
    function sendNoteOn (key, value) { output.send([0x90 + midiChannel, key, value]) }

    function setRingBlack () { R.forEach((x) => (sendNoteOn(x.key, 0)), midi.ring) }
    function setRingPosition (position, length, noReset) {
      if (!noReset) setRingBlack()
      if (length <= 0) return
      sendNoteOn(midi.ring[position % midi.ring.length].key, 1)
      setRingPosition(position - 1, length - 1, true)
    }

    function toHexString (a) {
      return R.pipe(
        R.map((i) => '0x' + lpad2zero(i.toString(16).toUpperCase())),
        R.join(', ')
      )(a)
    }
    function lpad2zero (s) { return R.pipe(R.split(''), R.prepend('0'), R.takeLast(2), R.join(''))(s) }
    function toDate (y, m, d) { return y + '-' + lpad2zero('' + m) + '-' + lpad2zero('' + d) }
  },
  isValidControllerName: (name) => { return name.startsWith('SCS.3d') }
}
