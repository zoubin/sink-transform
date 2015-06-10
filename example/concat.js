var sink = require('..');
var fs = require('fs');

fs.createReadStream(__dirname + '/files/a.js')
    .pipe(sink.str(function (body, done) {
        console.log(body);
        done();
    }));

