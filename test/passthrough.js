var sink = require('..');
var test = require('tap').test;
var thr = require('through2');

test('passthrough', function(t) {
  t.plan(2);
  var trs = sink();
  var i = 0;
  var expected = [
    { x: 1 },
    { x: 2 },
  ];
  trs.pipe(thr.obj(function (row, _, next) {
    t.same(row, expected[i++]);
    next();
  }));
  trs.push(expected[0]);
  trs.push(expected[1]);
  trs.push(null);
});

