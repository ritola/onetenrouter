module.exports = {
  isNoteOn: function (a) { return (a[0] & 0xF0) === 0x90 }
}
