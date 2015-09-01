var concat = require('concat-stream');
var Stream = require('readable-stream');
var Transform = Stream.Transform;

module.exports = sinkTr;
module.exports.obj = function (tr) {
  return sinkTr({ encoding: 'object' }, tr);
};
module.exports.str = function (tr) {
  return sinkTr({ encoding: 'string' }, tr);
};

function sinkTr(opts, tr) {
  if (typeof opts === 'function') {
    tr = opts;
    opts = {};
  }
  var sink;
  var done;
  if (typeof tr !== 'function') {
    tr = function (bufs, cb) {
      bufs.forEach(function (buf) {
        this.push(buf);
      }, this);
      cb();
    };
  }

  var stream = Transform({ objectMode: true });
  stream._transform = function (buf, enc, next) {
    if (!sink) {
      sink = concat(opts, function (data) {
        tr.call(stream, data, done);
      });
    }
    sink.write(buf);
    next();
  };
  stream._flush = function (cb) {
    if (!sink) {
      cb();
      return;
    }
    done = cb;
    sink.end();
  };
  return stream;
}
