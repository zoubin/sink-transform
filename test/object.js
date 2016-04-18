var sink = require('..')
var test = require('tap').test
var concat = require('concat-stream')

test('sink object', function(t) {
  t.plan(1)
  var trs = sink({ encoding: 'object' }, function (body, done) {
    var self = this
    process.nextTick(function () {
      body.concat('!').forEach(function (s) {
        self.push(s)
      })
      done()
    })
  })
  trs.pipe(concat({ encoding: 'object' }, function (body) {
    t.same(body, ['hello', 'world', '!'])
  }))
  trs.write('hello')
  trs.end('world')
})

