// Router initializes functions

const R = require('ramda')
const controller = require('./controller')
const intro = require('./features/intro')
const reset = require('./features/reset')

module.exports = {
  run: (midi) => {
    const scsInputs = R.filter(controller.isValidController, midi.input.ports())
    const scsOutputs = R.filter(controller.isValidController, midi.output.ports())

    const scs3ds =
      R.map((indexes) => {
        return controller.init(
          midi.input.open(parseInt(indexes[0]), { sysex: true }),
          midi.output.open(parseInt(indexes[1]))
        )
      })((R.zip(R.keys(scsInputs), R.keys(scsOutputs))))

    R.forEach((scs3d) => {
      scs3d.version.query()
      scs3d.version.stream
        .log('Stanton SCS.3d')
        .map(() => intro.run(scs3d))
        .onValue((introStream) => introStream.onEnd(() => reset(scs3d)))
    })(scs3ds)
  }
}
