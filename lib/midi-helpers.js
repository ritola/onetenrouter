const R = require('ramda')

module.exports = {
  isNoteOn: function (a) { return (a[0] & 0xF0) === 0x90 },
  log: function (a) { console.log(toHexString(a)) }
}

function lpad2zero (s) { return R.pipe(R.split(''), R.prepend('0'), R.takeLast(2), R.join(''))(s) }
function toHexString (a) {
  return R.pipe(
    R.map((i) => '0x' + lpad2zero(i.toString(16).toUpperCase())),
    R.join(', ')
  )(a)
}
