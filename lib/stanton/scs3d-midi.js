module.exports = {
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
