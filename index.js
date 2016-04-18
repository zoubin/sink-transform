var concat = require('concat-stream')
var Stream = require('readable-stream')
var Transform = Stream.Transform

exports = module.exports = sinkTr

exports.obj = function (tr) {
  return sinkTr({ encoding: 'object' }, tr)
}
exports.str = function (tr) {
  return sinkTr({ encoding: 'string' }, tr)
}

function sinkTr(opts, tr) {
  if (typeof opts === 'function') {
    tr = opts
    opts = {}
  }
  var sink
  var done
  if (typeof tr !== 'function') {
    tr = function (bufs, next) {
      this.push(bufs)
      next()
    }
  }

  function write(buf, enc, next) {
    if (!sink) {
      sink = concat(opts, function (data) {
        tr.call(stream, data, done)
      })
    }
    sink.write(buf)
    next()
  }
  function end(next) {
    if (!sink) {
      return next()
    }
    done = next
    sink.end()
  }

  var stream = Transform({ objectMode: true })
  stream._transform = write
  stream._flush = end
  return stream
}
