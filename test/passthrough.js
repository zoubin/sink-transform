var sink = require('..')
var test = require('tap').test
var thr = require('through2')

test('obj', function(t) {
  t.plan(1)
  var trs = sink.obj()
  var i = 0
  var expected = [
    { x: 1 },
    { x: 2 },
  ]
  trs.pipe(thr.obj(function (row, _, next) {
    t.same(row, expected)
    next()
  }))
  trs.write(expected[0])
  trs.write(expected[1])
  trs.end()
})

test('string', function(t) {
  t.plan(1)
  var trs = sink.str()
  var i = 0
  trs.pipe(thr.obj(function (row, _, next) {
    t.same(row, 'ab')
    next()
  }))
  trs.write('a')
  trs.write('b')
  trs.end()
})

test('buffer', function(t) {
  t.plan(1)
  var trs = sink()
  var i = 0
  trs.pipe(thr.obj(function (buf, _, next) {
    t.same(buf.toString(), 'ab')
    next()
  }))
  trs.write('a')
  trs.write('b')
  trs.end()
})

