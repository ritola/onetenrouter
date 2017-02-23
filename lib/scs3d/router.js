const Promise = require('bluebird')
const R = require('ramda')

const controller = require('./controller')
const intro = require('./features/intro')
const deckSelectAB = require('./features/deck-select-ab')
const reset = require('./features/reset')

const features = [
  require('./features/transport')
]

module.exports = {
  run: (midi) => {
    const controllers = initControllers(midi)
    const virtual = initVirtual(midi, 'Oneten Router')

    Promise.try(() => controllers)
      .each((c) => c.version)
      .map(intro)
      .tap(deckSelectAB)
      .each(reset)
      .then(() => startFeatures(controllers, virtual))
  }
}

function startFeatures (controllers, virtual) {
  R.map((feature) => feature(controllers, virtual))(features)
}

function initControllers (midi) {
  const scsInputs = R.filter(controller.isValidControllerName, midi.input.ports())
  const scsOutputs = R.filter(controller.isValidControllerName, midi.output.ports())

  return R.addIndex(R.map)((a, i) => {
    return controller.init(i,
      midi.input.open(parseInt(a[0]), { sysex: true }),
      midi.output.open(parseInt(a[1]))
    )
  })(R.zip(R.keys(scsInputs), R.keys(scsOutputs)))
}

function initVirtual (midi, name) {
  return {
    input: midi.input.openVirtual(name),
    output: midi.output.openVirtual(name)
  }
}
