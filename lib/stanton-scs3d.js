const R = require('ramda')

/*
  Parameters:
  - input: opened bacon-midi stream
  - output: opened bacon-midi stream

   const midi = require('./bacon-midi')
   stanton-scs3d(
    midi.input.open(1, { sysex: true }),
    midi.output.open(1)
  )
*/

module.exports = function (input, output) {
  const inStream = input.stream.map('.message')

  const leds = {
    stanton: { key: 0x7a, colors: [0, 1], x: 59, y: 11 },
    gain: { colors: [2], x: 15, y: 11 },
    pitchRed: { key: 0x3d, colors: [0, 1], x: 103, y: 11 },
    pitchBlue: { key: 0x3e, colors: [0, 1], x: 103, y: 11 },
    deckA: { key: 0x71, colors: [0, 1], x: 27, y: 11 },
    deckB: { key: 0x72, colors: [0, 1], x: 90, y: 11 }
  }

  const surface = {
    ring: [
      { key: 0x5d, colors: [0, 1], x: 49, y: 173 },
      { key: 0x5e, colors: [0, 1], x: 31, y: 164 },
      { key: 0x5f, colors: [0, 1], x: 16, y: 150 },
      { key: 0x60, colors: [0, 1], x: 9, y: 131 },
      { key: 0x61, colors: [0, 1], x: 9, y: 111 },
      { key: 0x62, colors: [0, 1], x: 16, y: 92 },
      { key: 0x63, colors: [0, 1], x: 31, y: 79 },
      { key: 0x64, colors: [0, 1], x: 49, y: 71 },
      { key: 0x65, colors: [0, 1], x: 69, y: 71 },
      { key: 0x66, colors: [0, 1], x: 88, y: 79 },
      { key: 0x67, colors: [0, 1], x: 101, y: 92 },
      { key: 0x68, colors: [0, 1], x: 110, y: 111 },
      { key: 0x69, colors: [0, 1], x: 110, y: 131 },
      { key: 0x6a, colors: [0, 1], x: 101, y: 150 },
      { key: 0x6b, colors: [0, 1], x: 88, y: 164 },
      { key: 0x6c, colors: [0, 1], x: 69, y: 173 }
    ],
    leds: [
      { key: 0x48, colors: [0, 1], x: 34, y: 94 },
      { key: 0x49, colors: [0, 1], x: 34, y: 104 },
      { key: 0x4a, colors: [0, 1], x: 34, y: 113 },
      { key: 0x4b, colors: [0, 1], x: 34, y: 122 },
      { key: 0x4c, colors: [0, 1], x: 34, y: 132 },
      { key: 0x4d, colors: [0, 1], x: 34, y: 141 },
      { key: 0x4e, colors: [0, 1], x: 34, y: 151 },
      { key: 0x4f, colors: [0, 1], x: 84, y: 94 },
      { key: 0x50, colors: [0, 1], x: 84, y: 104 },
      { key: 0x51, colors: [0, 1], x: 84, y: 113 },
      { key: 0x52, colors: [0, 1], x: 84, y: 122 },
      { key: 0x53, colors: [0, 1], x: 84, y: 132 },
      { key: 0x54, colors: [0, 1], x: 84, y: 141 },
      { key: 0x55, colors: [0, 1], x: 84, y: 151 },
      { key: 0x56, colors: [0, 1], x: 59, y: 94 },
      { key: 0x57, colors: [0, 1], x: 59, y: 104 },
      { key: 0x58, colors: [0, 1], x: 59, y: 113 },
      { key: 0x59, colors: [0, 1], x: 59, y: 122 },
      { key: 0x5a, colors: [0, 1], x: 59, y: 132 },
      { key: 0x5b, colors: [0, 1], x: 59, y: 141 },
      { key: 0x5c, colors: [0, 1], x: 59, y: 151 }
    ]
  }

  const sliderXY = {
    gain: [
      { cc: 0x07, value: 0, x: 23, y: 64 },
      { cc: 0x07, value: 1, x: 23, y: 59 },
      { cc: 0x07, value: 2, x: 23, y: 54 },
      { cc: 0x07, value: 3, x: 23, y: 48 },
      { cc: 0x07, value: 4, x: 23, y: 43 },
      { cc: 0x07, value: 5, x: 23, y: 38 },
      { cc: 0x07, value: 6, x: 23, y: 32 },
      { cc: 0x07, value: 7, x: 23, y: 27 },
      { cc: 0x07, value: 8, x: 23, y: 21 },
      { cc: 0x07, value: 9, x: 23, y: 16 }
    ],
    pitch: [
      { cc: 0x03, value: 0, x: 94, y: 64 },
      { cc: 0x03, value: 1, x: 94, y: 59 },
      { cc: 0x03, value: 2, x: 94, y: 54 },
      { cc: 0x03, value: 3, x: 94, y: 48 },
      { cc: 0x03, value: 4, x: 94, y: 43 },
      { cc: 0x03, value: 5, x: 94, y: 38 },
      { cc: 0x03, value: 6, x: 94, y: 32 },
      { cc: 0x03, value: 7, x: 94, y: 27 },
      { cc: 0x03, value: 8, x: 94, y: 21 },
      { cc: 0x03, value: 9, x: 94, y: 16 }
    ]
  }

  const buttons = {
    mode: {
      fx: { key: 0x20, colors: [0, 1, 2, 3], x: 43, y: 20 },
      eq: { key: 0x26, colors: [0, 1, 2, 3], x: 74, y: 20 },
      loop: { key: 0x22, colors: [0, 1, 2, 3], x: 43, y: 36 },
      trig: { key: 0x28, colors: [0, 1, 2, 3], x: 74, y: 36 },
      vinyl: { key: 0x24, colors: [0, 1, 2, 3], x: 43, y: 44 },
      deck: { key: 0x2A, colors: [0, 1, 2, 3], x: 74, y: 44 }
    },
    soft: {
      b11: { key: 0x2c, colors: [0, 1, 2, 3], x: 15, y: 38 },
      b12: { key: 0x2e, colors: [0, 1, 2, 3], x: 103, y: 38 },
      b13: { key: 0x30, colors: [0, 1, 2, 3], x: 15, y: 162 },
      b14: { key: 0x32, colors: [0, 1, 2, 3], x: 103, y: 162 }
    },
    transport: {
      play: { key: 0x6d, colors: [0, 1], x: 19, y: 191 },
      cue: { key: 0x6e, colors: [0, 1], x: 46, y: 191 },
      sync: { key: 0x6f, colors: [0, 1], x: 71, y: 191 },
      tap: { key: 0x70, colors: [0, 1], x: 98, y: 191 }
    }
  }

  inStream.map(toHexString).log()

  const channel = 0 // midi channel

  return {
    buttons: buttons,
    leds: leds,
    surface: surface,
    sliderXY: sliderXY,

    led: (led, index) => { sendNoteOn(led.key, led.colors[index]) },

    version: {
      query: () => { output.send([0xF0, 0x7E, channel, 0x06, 0x01, 0xF7]) },
      stream: inStream
          .filter(R.and(R.pipe(R.take(12),
            R.equals([0xF0, 0x7E, 0x00, 0x06, 0x02, 0x00, 0x01, 0x60, 0x2C, 0x01, 0x01, 0x00])),
            R.pipe(R.takeLast(1), R.equals([0xF7]))))
          .map(R.drop(12))
          .map((a) => { return { version: a[0], date: toDate(2008 + a[1], a[2], a[3]) } })
    },

    extinguishAllLeds: () => { sendCC(0x7B, 0x00) },

    leds_: {
      logo: (color) => { sendNoteOn(leds.stanton.key, color) },
      deckA: (color) => { sendNoteOn(leds.deckA.key, color) },
      deckB: (color) => { sendNoteOn(leds.deckA.key, color) }
    },

    surface_: {
      mode: {
        setCircle: () => { output.send([0xF0, 0x00, 0x01, 0x60, 0x01, 0x00, 0xF7]) },
        setSliders: () => { output.send([0xF0, 0x00, 0x01, 0x60, 0x01, 0x03, 0xF7]) },
        setButtons: () => { output.send([0xF0, 0x00, 0x01, 0x60, 0x01, 0x04, 0xF7]) },
        setButtonsLeft: () => { output.send([0xF0, 0x00, 0x01, 0x60, 0x01, 0x01, 0xF7]) },
        setButtonsRight: () => { output.send([0xF0, 0x00, 0x01, 0x60, 0x01, 0x02, 0xF7]) },
        setCompatibility: () => { output.send([0xF0, 0x00, 0x01, 0x60, 0x10, channel, 0xF7]) }
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
        fx: noteAndLed(buttons.mode.fx.key),
        eq: noteAndLed(buttons.mode.eq.key),
        loop: noteAndLed(buttons.mode.loop.key),
        trig: noteAndLed(buttons.mode.trig.key),
        vinyl: noteAndLed(buttons.mode.vinyl.key),
        deck: noteAndLed(buttons.mode.deck.key),
        setAll: (color) => { R.forEach((x) => { sendNoteOn(x, color) }, [0x20, 0x26, 0x22, 0x28, 0x24, 0x2A]) }
      },
      soft: {
        b11: noteAndLed(buttons.soft.b11.key),
        b12: noteAndLed(buttons.soft.b12.key),
        b13: noteAndLed(buttons.soft.b13.key),
        b14: noteAndLed(buttons.soft.b14.key),
        setAll: (color) => { R.forEach((x) => { sendNoteOn(x, color) }, [0x2c, 0x2e, 0x30, 0x32]) }
      },
      transport: {
        play: noteAndLed(buttons.transport.play.key),
        cue: noteAndLed(buttons.transport.cue.key),
        sync: noteAndLed(buttons.transport.sync.key),
        tap: noteAndLed(buttons.transport.tap.key),
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

  function isNoteOn (key) { return R.pipe(noVelocity, R.equals([0x90 + channel, key])) }
  function isNoteOff (key) { return R.pipe(noVelocity, R.equals([0x80 + channel, key])) }
  function sendCC (controller, value) { output.send([0xB0 + channel, controller, value]) }
  function sendNoteOn (key, value) { output.send([0x90 + channel, key, value]) }

  function toHexString (a) {
    return R.pipe(
      R.map((i) => '0x' + lpad2zero(i.toString(16).toUpperCase())),
      R.join(', ')
    )(a)
  }
  function lpad2zero (s) { return R.pipe(R.split(''), R.prepend('0'), R.takeLast(2), R.join(''))(s) }
  function toDate (y, m, d) { return y + '-' + lpad2zero('' + m) + '-' + lpad2zero('' + d) }
}
