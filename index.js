var concat = require('concat-stream');
var Transform = require('readable-stream').Transform;

module.exports = sink;

module.exports.obj = function (tr) {
    return sink({ encoding: 'object' }, tr);
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
        done = cb;
        sink.end();
    };

    return stream;
}
