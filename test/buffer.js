var sink = require('..');
var test = require('tap').test;
var concat = require('concat-stream');
var thr = require('through2');

test('sink buffer', function(t) {
  t.plan(1);
  var trs = sink(function (body, done) {
    var self = this;
    process.nextTick(function () {
      self.push(Buffer(body.toString('utf8') + '!'));
      done();
    });
  });
  trs.pipe(toUpperCase())
    .pipe(concat(function (body) {
      t.equal(body.toString('utf8'), 'HELLOWORLD!');
    }));
  trs.write(Buffer('hello'));
  trs.end(Buffer('world'));
});

function toUpperCase() {
  return thr.obj(function (buf, enc, next) {
    next(null, Buffer(buf.toString('utf8').toUpperCase()));
  });
}
