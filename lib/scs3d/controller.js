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
const midi = getMidiMap()

module.exports = {
  init: function (input, output) {
    const inStream = input.stream.map('.message')
    inStream.map(toHexString).log()

    const midiChannel = 0

    return {
      led: (led, index) => { sendNoteOn(led.key, led.colors[index]) },

      version: {
        query: () => { output.send([0xF0, 0x7E, midiChannel, 0x06, 0x01, 0xF7]) },
        stream: inStream
            .filter(R.and(R.pipe(R.take(12),
              R.equals([0xF0, 0x7E, 0x00, 0x06, 0x02, 0x00, 0x01, 0x60, 0x2C, 0x01, 0x01, 0x00])),
              R.pipe(R.takeLast(1), R.equals([0xF7]))))
            .map(R.drop(12))
            .map((a) => { return { version: a[0], date: toDate(2008 + a[1], a[2], a[3]) } })
      },

      extinguishAllLeds: () => { sendCC(0x7B, 0x00) },

      leds: {
        stanton: (color) => { sendNoteOn(midi.leds.stanton.key, color) },
        deckA: (color) => { sendNoteOn(midi.leds.deckA.key, color) },
        deckB: (color) => { sendNoteOn(midi.leds.deckA.key, color) },
        pitchRed: (color) => { sendNoteOn(midi.leds.pitchRed.key, color) },
        pitchBlue: (color) => { sendNoteOn(midi.leds.pitchBlue.key, color) }
      },

      surface: {
        mode: {
          setCircle: () => { output.send([0xF0, 0x00, 0x01, 0x60, 0x01, 0x00, 0xF7]) },
          setSliders: () => { output.send([0xF0, 0x00, 0x01, 0x60, 0x01, 0x03, 0xF7]) },
          setButtons: () => { output.send([0xF0, 0x00, 0x01, 0x60, 0x01, 0x04, 0xF7]) },
          setButtonsLeft: () => { output.send([0xF0, 0x00, 0x01, 0x60, 0x01, 0x01, 0xF7]) },
          setButtonsRight: () => { output.send([0xF0, 0x00, 0x01, 0x60, 0x01, 0x02, 0xF7]) },
          setCompatibility: () => { output.send([0xF0, 0x00, 0x01, 0x60, 0x10, midiChannel, 0xF7]) }
        },
        leds: {
          setCircleLeft: (color) => { R.forEach((x) => (sendNoteOn(x, color)), R.range(0x66, 0x6b + 1)) },
          setCircleRight: (color) => { R.forEach((x) => (sendNoteOn(x, color)), R.range(0x5e, 0x63 + 1)) },
          setCircleAll: (color) => { R.forEach((x) => (sendNoteOn(x, color)), R.range(0x5d, 0x6c + 1)) },
          setAllBlack: () => { R.forEach((x) => (sendNoteOn(x, 0x40)), R.range(0x48, 0x5c + 1)) }
        }
      },

      button: {
        mode: {
          fx: noteAndLed(midi.buttons.mode.fx.key),
          eq: noteAndLed(midi.buttons.mode.eq.key),
          loop: noteAndLed(midi.buttons.mode.loop.key),
          trig: noteAndLed(midi.buttons.mode.trig.key),
          vinyl: noteAndLed(midi.buttons.mode.vinyl.key),
          deck: noteAndLed(midi.buttons.mode.deck.key),
          setAll: (color) => { R.forEach((x) => { sendNoteOn(x, color) }, [0x20, 0x26, 0x22, 0x28, 0x24, 0x2A]) }
        },
        soft: {
          b11: noteAndLed(midi.buttons.soft.b11.key),
          b12: noteAndLed(midi.buttons.soft.b12.key),
          b13: noteAndLed(midi.buttons.soft.b13.key),
          b14: noteAndLed(midi.buttons.soft.b14.key),
          setAll: (color) => { R.forEach((x) => { sendNoteOn(x, color) }, [0x2c, 0x2e, 0x30, 0x32]) }
        },
        transport: {
          play: noteAndLed(midi.buttons.transport.play.key),
          cue: noteAndLed(midi.buttons.transport.cue.key),
          sync: noteAndLed(midi.buttons.transport.sync.key),
          tap: noteAndLed(midi.buttons.transport.tap.key),
          setAll: (color) => { R.forEach((x) => { sendNoteOn(x, color) }, [0x6d, 0x6e, 0x6f, 0x70]) }
        }
      },

      sendNoteOn: sendNoteOn,
      sendCC: sendCC,

      test: () => {
      }
    }

    function noteAndLed (key) {
      const stream = inStream.filter(R.either(isNoteOff(key), isNoteOn(key)))
      const setLed = (color) => sendNoteOn(key, color)
      const ledOnPress = (up, down) => {
        setLed(up)
        stream.filter(isNoteOn(key)).onValue(() => { setLed(down) })
        stream.filter(isNoteOff(key)).onValue(() => { setLed(up) })
      }
      return { stream, setLed, ledOnPress }
    }

    function noVelocity (a) { return R.take(2)(a) }

    function isNoteOn (key) { return R.pipe(noVelocity, R.equals([0x90 + midiChannel, key])) }
    function isNoteOff (key) { return R.pipe(noVelocity, R.equals([0x80 + midiChannel, key])) }
    function sendCC (controller, value) { output.send([0xB0 + midiChannel, controller, value]) }
    function sendNoteOn (key, value) { output.send([0x90 + midiChannel, key, value]) }

    function toHexString (a) {
      return R.pipe(
        R.map((i) => '0x' + lpad2zero(i.toString(16).toUpperCase())),
        R.join(', ')
      )(a)
    }
    function lpad2zero (s) { return R.pipe(R.split(''), R.prepend('0'), R.takeLast(2), R.join(''))(s) }
    function toDate (y, m, d) { return y + '-' + lpad2zero('' + m) + '-' + lpad2zero('' + d) }
  },
  isValidController: (name) => { return name.startsWith('SCS.3d') }
}

function getMidiMap () {
  return {
    leds: {
      stanton: { key: 0x7a, colors: [0, 1] },
      gain: { colors: [2] },
      pitchRed: { key: 0x3d, colors: [0, 1] },
      pitchBlue: { key: 0x3e, colors: [0, 1] },
      deckA: { key: 0x71, colors: [0, 1] },
      deckB: { key: 0x72, colors: [0, 1] }
    },

    buttons: {
      mode: {
        fx: { key: 0x20, colors: [0, 1, 2, 3] },
        eq: { key: 0x26, colors: [0, 1, 2, 3] },
        loop: { key: 0x22, colors: [0, 1, 2, 3] },
        trig: { key: 0x28, colors: [0, 1, 2, 3] },
        vinyl: { key: 0x24, colors: [0, 1, 2, 3] },
        deck: { key: 0x2a, colors: [0, 1, 2, 3] }
      },
      soft: {
        b11: { key: 0x2c, colors: [0, 1, 2, 3] },
        b12: { key: 0x2e, colors: [0, 1, 2, 3] },
        b13: { key: 0x30, colors: [0, 1, 2, 3] },
        b14: { key: 0x32, colors: [0, 1, 2, 3] }
      },
      transport: {
        play: { key: 0x6d, colors: [0, 1] },
        cue: { key: 0x6e, colors: [0, 1] },
        sync: { key: 0x6f, colors: [0, 1] },
        tap: { key: 0x70, colors: [0, 1] }
      }
    },

    surface: {
      ring: [
        { key: 0x5d, colors: [0, 1] },
        { key: 0x5e, colors: [0, 1] },
        { key: 0x5f, colors: [0, 1] },
        { key: 0x60, colors: [0, 1] },
        { key: 0x61, colors: [0, 1] },
        { key: 0x62, colors: [0, 1] },
        { key: 0x63, colors: [0, 1] },
        { key: 0x64, colors: [0, 1] },
        { key: 0x65, colors: [0, 1] },
        { key: 0x66, colors: [0, 1] },
        { key: 0x67, colors: [0, 1] },
        { key: 0x68, colors: [0, 1] },
        { key: 0x69, colors: [0, 1] },
        { key: 0x6a, colors: [0, 1] },
        { key: 0x6b, colors: [0, 1] },
        { key: 0x6c, colors: [0, 1] }
      ],
      leds: [
        { key: 0x48, colors: [0, 1] },
        { key: 0x49, colors: [0, 1] },
        { key: 0x4a, colors: [0, 1] },
        { key: 0x4b, colors: [0, 1] },
        { key: 0x4c, colors: [0, 1] },
        { key: 0x4d, colors: [0, 1] },
        { key: 0x4e, colors: [0, 1] },
        { key: 0x4f, colors: [0, 1] },
        { key: 0x50, colors: [0, 1] },
        { key: 0x51, colors: [0, 1] },
        { key: 0x52, colors: [0, 1] },
        { key: 0x53, colors: [0, 1] },
        { key: 0x54, colors: [0, 1] },
        { key: 0x55, colors: [0, 1] },
        { key: 0x56, colors: [0, 1] },
        { key: 0x57, colors: [0, 1] },
        { key: 0x58, colors: [0, 1] },
        { key: 0x59, colors: [0, 1] },
        { key: 0x5a, colors: [0, 1] },
        { key: 0x5b, colors: [0, 1] },
        { key: 0x5c, colors: [0, 1] }
      ]
    },

    slider: {
      single: {
        gain: [
          { cc: 0x07, value: 0 },
          { cc: 0x07, value: 1 },
          { cc: 0x07, value: 2 },
          { cc: 0x07, value: 3 },
          { cc: 0x07, value: 4 },
          { cc: 0x07, value: 5 },
          { cc: 0x07, value: 6 },
          { cc: 0x07, value: 7 },
          { cc: 0x07, value: 8 },
          { cc: 0x07, value: 9 }
        ],
        pitch: [
          { cc: 0x03, value: 0 },
          { cc: 0x03, value: 1 },
          { cc: 0x03, value: 2 },
          { cc: 0x03, value: 3 },
          { cc: 0x03, value: 4 },
          { cc: 0x03, value: 5 },
          { cc: 0x03, value: 6 },
          { cc: 0x03, value: 7 },
          { cc: 0x03, value: 8 },
          { cc: 0x03, value: 9 }
        ]
      },
      plusMinus: {
        gain: [
          { cc: 0x07, value: 21 },
          { cc: 0x07, value: 22 },
          { cc: 0x07, value: 23 },
          { cc: 0x07, value: 24 },
          { cc: 0x07, value: 25 },
          { cc: 0x07, value: 26 },
          { cc: 0x07, value: 27 },
          { cc: 0x07, value: 28 },
          { cc: 0x07, value: 29 }
        ],
        pitch: [
          { cc: 0x03, value: 21 },
          { cc: 0x03, value: 22 },
          { cc: 0x03, value: 23 },
          { cc: 0x03, value: 24 },
          { cc: 0x03, value: 25 },
          { cc: 0x03, value: 26 },
          { cc: 0x03, value: 27 },
          { cc: 0x03, value: 28 },
          { cc: 0x03, value: 29 }
        ]
      },
      up: {
        gain: [
          { cc: 0x07, value: 40 },
          { cc: 0x07, value: 41 },
          { cc: 0x07, value: 42 },
          { cc: 0x07, value: 43 },
          { cc: 0x07, value: 44 },
          { cc: 0x07, value: 45 },
          { cc: 0x07, value: 46 },
          { cc: 0x07, value: 47 },
          { cc: 0x07, value: 48 },
          { cc: 0x07, value: 49 }
        ],
        pitch: [
          { cc: 0x03, value: 40 },
          { cc: 0x03, value: 41 },
          { cc: 0x03, value: 42 },
          { cc: 0x03, value: 43 },
          { cc: 0x03, value: 44 },
          { cc: 0x03, value: 45 },
          { cc: 0x03, value: 46 },
          { cc: 0x03, value: 47 },
          { cc: 0x03, value: 48 },
          { cc: 0x03, value: 49 }
        ]
      },
      out: {
        gain: [
          { cc: 0x07, value: 60 },
          { cc: 0x07, value: 61 },
          { cc: 0x07, value: 62 },
          { cc: 0x07, value: 63 },
          { cc: 0x07, value: 64 },
          { cc: 0x07, value: 65 }
        ],
        pitch: [
          { cc: 0x03, value: 60 },
          { cc: 0x03, value: 61 },
          { cc: 0x03, value: 62 },
          { cc: 0x03, value: 63 },
          { cc: 0x03, value: 64 },
          { cc: 0x03, value: 65 }
        ]
      }
    }

  }
}
