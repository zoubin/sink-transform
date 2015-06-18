var concat = require('concat-stream');
var Stream = require('readable-stream');
var Transform = Stream.Transform;

module.exports = sink;
module.exports.Through = Stream.PassThrough;

module.exports.obj = function (tr) {
    return sink({ encoding: 'object' }, tr);
};

module.exports.str = function (tr) {
    return sink({ encoding: 'string' }, tr);
};

function sink(opts, tr) {
    if (typeof opts === 'function') {
        tr = opts;
        opts = {};
    }
    var sink;
    var done;

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
            return cb();
        }
        done = cb;
        sink.end();
    };

    return stream;
}
