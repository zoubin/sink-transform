# sink-transform
[![version](https://img.shields.io/npm/v/sink-transform.svg)](https://www.npmjs.org/package/sink-transform)
[![status](https://travis-ci.org/zoubin/sink-transform.svg)](https://travis-ci.org/zoubin/sink-transform)
[![coverage](https://img.shields.io/coveralls/zoubin/sink-transform.svg)](https://coveralls.io/github/zoubin/sink-transform)
[![dependencies](https://david-dm.org/zoubin/sink-transform.svg)](https://david-dm.org/zoubin/sink-transform)
[![devDependencies](https://david-dm.org/zoubin/sink-transform/dev-status.svg)](https://david-dm.org/zoubin/sink-transform#info=devDependencies)

A wrapper for [concat-stream] to make a transform to process the concated result.

## Examples

### Concat objects
example/reverse.js:

```javascript
var sink = require('sink-transform')
var JSONStream = require('JSONStream')

var stream = sink.obj(function (rows, done) {
  for (var i = rows.length - 1; i >= 0; --i) {
    this.push(rows[i])
  }
  done()
})

stream.pipe(JSONStream.stringify()).pipe(process.stdout)

stream.write({ x:1 })
stream.write({ y:2 })
stream.write({ z:3 })
stream.end()

```

output:

```
⌘ node example/reverse.js
[
{"z":3}
,
{"y":2}
,
{"x":1}
]
```

### Concat strings

example/concat.js:

```javascript
var sink = require('sink-transform')
var fs = require('fs')

fs.createReadStream(__dirname + '/files/a.js')
  .pipe(sink.str(function (body, done) {
    console.log(body)
    done()
  }))

```

a.js:

```javascript
console.log('a')
```

output:

```
⌘ node example/concat.js
console.log('a')
```

## Usage

```javascript
var sink = require('sink-transform')
var stream = sink(opts, trs)
```

### stream = sink(opts={}, transformFn)

**opts**

Type: `Object`

Directly passsed to [concat-stream] as the first argument.

**transformFn**

Type: `Function`

Signature: `(concated, done) => {}`

Receives the concated result of [concat-stream],
and a callback to mark the end of the transform operation.

### stream = sink.obj(transformFn)
Same with `sink({ encoding: 'object' }, transformFn)`

### stream = sink.str(transformFn)
Same with `sink({ encoding: 'string' }, transformFn)`

[concat-stream]: https://www.npmjs.com/package/concat-stream
