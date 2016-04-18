var sink = require('..')
var JSONStream = require('JSONStream')

var stream = sink.obj(function (rows, done) {
  for (var i = rows.length - 1; i >= 0; --i) {
    this.push(rows[i])
  }
  done()
})

stream.pipe(JSONStream.stringify()).pipe(process.stdout)

stream.write({ x: 1 })
stream.write({ y: 2 })
stream.write({ z: 3 })
stream.end()
