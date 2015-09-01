var sink = require('..');
var test = require('tap').test;
var thr = require('through2');

test('sink string', function(t) {
  t.plan(1);
  var trs = sink({ encoding: 'string' }, function (body, done) {
    var self = this;
    process.nextTick(function () {
      self.push(body + '!');
      done();
    });
  });
  trs.pipe(thr.obj(function (s, e, n) {
    t.equal(s, 'helloworld!');
    n();
  }));
  trs.write('hello');
  trs.end('world');
});

