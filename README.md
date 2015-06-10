# sink-transform
Wrapper for [concat-stream](https://www.npmjs.com/package/concat-stream) to make a transform

## Usage

```javascript
var sink = require('sink-transform');
var stream = sink(opts, trs);
```

### stream = sink(opts={}, transformFn)

* **opts**: *Object* Will be directly passsed to [concat-stream](https://www.npmjs.com/package/concat-stream)
* **transformFn** *Function* Receives the result of [concat-stream](https://www.npmjs.com/package/concat-stream), and a callback to mark the end of the transform operation.

### stream = sink.obj(transformFn)
Same with `sink({ encoding: 'object' }, transformFn)`

## Example

**example/reverse.js**:

```javascript
var sink = require('sink-transform');
var JSONStream = require('JSONStream');

var stream = sink.obj(function (rows, done) {
    for (var i = rows.length - 1; i >= 0; --i) {
        this.push(rows[i]);
    }
    done();
});

stream.pipe(JSONStream.stringify()).pipe(process.stdout);

stream.write({ x:1 });
stream.write({ y:2 });
stream.write({ z:3 });
stream.end();

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
