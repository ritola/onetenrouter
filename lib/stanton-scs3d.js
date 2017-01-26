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
  var inStream = input.stream.map('.message')

  inStream.map(toHexString).log()

  const channel = 0 // midi channel

  return {
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

    leds: {
      logo: (color) => { sendNoteOn(0x7a, color) },
      deckA: (color) => { sendNoteOn(0x71, color) },
      deckB: (color) => { sendNoteOn(0x72, color) }
    },

    surface: {
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
        fx: noteAndLed(0x20),
        eq: noteAndLed(0x26),
        loop: noteAndLed(0x22),
        trig: noteAndLed(0x28),
        vinyl: noteAndLed(0x24),
        deck: noteAndLed(0x2A),
        setAll: (color) => { R.forEach((x) => { sendNoteOn(x, color) }, [0x20, 0x26, 0x22, 0x28, 0x24, 0x2A]) }
      },
      soft: {
        b11: noteAndLed(0x2c),
        b12: noteAndLed(0x2e),
        b13: noteAndLed(0x30),
        b14: noteAndLed(0x32),
        setAll: (color) => { R.forEach((x) => { sendNoteOn(x, color) }, [0x2c, 0x2e, 0x30, 0x32]) }
      },
      transport: {
        play: noteAndLed(0x6d),
        cue: noteAndLed(0x6e),
        sync: noteAndLed(0x6f),
        tap: noteAndLed(0x70),
        setAll: (color) => { R.forEach((x) => { sendNoteOn(x, color) }, [0x6d, 0x6e, 0x6f, 0x70]) }
      }
    },

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
