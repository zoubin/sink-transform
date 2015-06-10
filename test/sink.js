var sink = require('..');
var test = require('tape');
var concat = require('concat-stream');
var thr = require('through2');

test('sink empty', function(t) {
    t.plan(1);
    var trs = sink(function (body, done) {
        done();
    });
    trs.pipe(thr.obj(function (s, e, n) {
        n();
    }, function () {
        t.equal(1, 1);
    }));
    trs.end();
});

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

test('sink object', function(t) {
    t.plan(1);
    var trs = sink({ encoding: 'object' }, function (body, done) {
        var self = this;
        process.nextTick(function () {
            body.concat('!').forEach(function (s) {
                self.push(s);
            });
            done();
        });
    });
    trs.pipe(concat({ encoding: 'object' }, function (body) {
        t.same(body, ['hello', 'world', '!']);
    }));
    trs.write('hello');
    trs.end('world');
});

function toUpperCase() {
    return thr.obj(function (buf, enc, next) {
        next(null, Buffer(buf.toString('utf8').toUpperCase()));
    });
}
