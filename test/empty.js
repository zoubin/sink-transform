var sink = require('..')
var test = require('tap').test
var thr = require('through2')

test('empty', function(t) {
  t.plan(1)
  var trs = sink(function (body, done) {
    done()
  })
  trs.pipe(thr.obj(function (s, e, n) {
    n()
  }, function () {
    t.equal(1, 1)
  }))
  trs.end()
})

