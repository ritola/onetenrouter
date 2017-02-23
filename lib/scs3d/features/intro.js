const Bacon = require('baconjs')
const R = require('ramda')

const positions = ledPositions()

module.exports = function (controller) {
  const ledsOnY = (y) => { return R.values(R.filter(R.propEq('y', y), positions)) }
  const setLedOnY = (y, color) => {
    R.forEach((button) => { if (button.key) controller.sendNoteOn(button.key, color) }, ledsOnY(y))
  }

  const setSliderLedOnY = (y) => {
    R.forEach((button) => { if (button.cc) controller.sendCC(button.cc, button.value) }, ledsOnY(y))
  }

  const introStream = Bacon.sequentially(3, R.range(1, 250))

  introStream.onValue((y) => {
    setLedOnY(y, 1)
    setLedOnY(y - 50, 0)
    setSliderLedOnY(y)
  })

  return introStream.mapEnd(R.always(controller)).toPromise()
}

function ledPositions () {
  return {
    // leds
    stanton: { key: 0x7a, x: 59, y: 11 },
    gain: { x: 15, y: 11 },
    pitchRed: { key: 0x3d, x: 103, y: 11 },
    pitchBlue: { key: 0x3e, x: 103, y: 11 },
    deckA: { key: 0x71, x: 27, y: 11 },
    deckB: { key: 0x72, x: 90, y: 11 },
    // buttons
    fx: { key: 0x20, x: 43, y: 20 },
    eq: { key: 0x26, x: 74, y: 20 },
    loop: { key: 0x22, x: 43, y: 36 },
    trig: { key: 0x28, x: 74, y: 36 },
    vinyl: { key: 0x24, x: 43, y: 44 },
    deck: { key: 0x2a, x: 74, y: 44 },
    b11: { key: 0x2c, x: 15, y: 38 },
    b12: { key: 0x2e, x: 103, y: 38 },
    b13: { key: 0x30, x: 15, y: 162 },
    b14: { key: 0x32, x: 103, y: 162 },
    play: { key: 0x6d, x: 19, y: 191 },
    cue: { key: 0x6e, x: 46, y: 191 },
    sync: { key: 0x6f, x: 71, y: 191 },
    tap: { key: 0x70, x: 98, y: 191 },
    // surface
    ring01: { key: 0x5d, x: 49, y: 173 },
    ring02: { key: 0x5e, x: 31, y: 164 },
    ring03: { key: 0x5f, x: 16, y: 150 },
    ring04: { key: 0x60, x: 9, y: 131 },
    ring05: { key: 0x61, x: 9, y: 111 },
    ring06: { key: 0x62, x: 16, y: 92 },
    ring07: { key: 0x63, x: 31, y: 79 },
    ring08: { key: 0x64, x: 49, y: 71 },
    ring09: { key: 0x65, x: 69, y: 71 },
    ring10: { key: 0x66, x: 88, y: 79 },
    ring11: { key: 0x67, x: 101, y: 92 },
    ring12: { key: 0x68, x: 110, y: 111 },
    ring13: { key: 0x69, x: 110, y: 131 },
    ring14: { key: 0x6a, x: 101, y: 150 },
    ring15: { key: 0x6b, x: 88, y: 164 },
    ring16: { key: 0x6c, x: 69, y: 173 },
    surfaceL1: { key: 0x48, x: 34, y: 94 },
    surfaceL2: { key: 0x49, x: 34, y: 104 },
    surfaceL3: { key: 0x4a, x: 34, y: 113 },
    surfaceL4: { key: 0x4b, x: 34, y: 122 },
    surfaceL5: { key: 0x4c, x: 34, y: 132 },
    surfaceL6: { key: 0x4d, x: 34, y: 141 },
    surfaceL7: { key: 0x4e, x: 34, y: 151 },
    surfaceR1: { key: 0x4f, x: 84, y: 94 },
    surfaceR2: { key: 0x50, x: 84, y: 104 },
    surfaceR3: { key: 0x51, x: 84, y: 113 },
    surfaceR4: { key: 0x52, x: 84, y: 122 },
    surfaceR5: { key: 0x53, x: 84, y: 132 },
    surfaceR6: { key: 0x54, x: 84, y: 141 },
    surfaceR7: { key: 0x55, x: 84, y: 151 },
    surfaceM1: { key: 0x56, x: 59, y: 94 },
    surfaceM2: { key: 0x57, x: 59, y: 104 },
    surfaceM3: { key: 0x58, x: 59, y: 113 },
    surfaceM4: { key: 0x59, x: 59, y: 122 },
    surfaceM5: { key: 0x5a, x: 59, y: 132 },
    surfaceM6: { key: 0x5b, x: 59, y: 141 },
    surfaceM7: { key: 0x5c, x: 59, y: 151 },
    // sliders
    gain0: { cc: 0x07, value: 0, x: 23, y: 64 },
    gain1: { cc: 0x07, value: 1, x: 23, y: 59 },
    gain2: { cc: 0x07, value: 2, x: 23, y: 54 },
    gain3: { cc: 0x07, value: 3, x: 23, y: 48 },
    gain4: { cc: 0x07, value: 4, x: 23, y: 43 },
    gain5: { cc: 0x07, value: 5, x: 23, y: 38 },
    gain6: { cc: 0x07, value: 6, x: 23, y: 32 },
    gain7: { cc: 0x07, value: 7, x: 23, y: 27 },
    gain8: { cc: 0x07, value: 8, x: 23, y: 21 },
    gain9: { cc: 0x07, value: 9, x: 23, y: 16 },
    pitch0: { cc: 0x03, value: 0, x: 94, y: 64 },
    pitch1: { cc: 0x03, value: 1, x: 94, y: 59 },
    pitch2: { cc: 0x03, value: 2, x: 94, y: 54 },
    pitch3: { cc: 0x03, value: 3, x: 94, y: 48 },
    pitch4: { cc: 0x03, value: 4, x: 94, y: 43 },
    pitch5: { cc: 0x03, value: 5, x: 94, y: 38 },
    pitch6: { cc: 0x03, value: 6, x: 94, y: 32 },
    pitch7: { cc: 0x03, value: 7, x: 94, y: 27 },
    pitch8: { cc: 0x03, value: 8, x: 94, y: 21 },
    pitch9: { cc: 0x03, value: 9, x: 94, y: 16 }
  }
}
