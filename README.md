
Microservice is a minimalist and lightweight microservice framework.

It only takes care of routing messages within your application to the right
microservices.

```
npm install --save microservice
```

Usage
=====

```
var Microservice = require('microservice')

var micro = new Microservice()

micro.add({cmd: 'log'}, function(args, callback) {
  console.log(JSON.stringify(args.data))
  callback(undefined, undefined)
})

micro.call({cmd: 'log', data: {hello: 'world'}}, function(err, callback) {
  // done
})
```
