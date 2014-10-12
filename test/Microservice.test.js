

var assert = require('assert')
var Microservice = require('../Microservice.js')
var uuid = require('uuid')

describe('Microservice', function() {

  it('one single microservice', function(done) {
    var microservice = new Microservice()

    var microserviceCalled = false
    var uniqueResult;
    microservice.add({foo: 'bar'}, function(args, callback) {
      assert.ok(args)
      assert.equal(args.foo, 'bar')
      microserviceCalled = true
      uniqueResult = uuid.v4();
      callback(undefined, uniqueResult)
    })

    microservice.call({foo: 'bar'}, function(err, result) {
      assert.ok(!err, err)
      assert.ok(microserviceCalled)
      assert.equal(result, uniqueResult)
      done()
    })

  })

  it('one single microservice callback(err, undefined)', function(done) {
    var microservice = new Microservice()

    var microserviceCalled = false
    var uniqueResult;
    microservice.add({foo: 'bar'}, function(args, callback) {
      assert.ok(args)
      assert.equal(args.foo, 'bar')
      microserviceCalled = true
      uniqueResult = uuid.v4();
      callback(new Error(uniqueResult), undefined)
    })

    microservice.call({foo: 'bar'}, function(err, result) {
      assert.ok(err)
      assert.ok(microserviceCalled)
      assert.equal(err.message, uniqueResult)
      done()
    })

  })

  it('one single microservice throws error', function(done) {
    var microservice = new Microservice()

    var microserviceCalled = false
    var uniqueResult;
    microservice.add({foo: 'bar'}, function(args, callback) {
      assert.ok(args)
      assert.equal(args.foo, 'bar')
      microserviceCalled = true
      uniqueResult = uuid.v4();
      throw new Error(uniqueResult)
    })

    microservice.call({foo: 'bar'}, function(err, result) {
      assert.ok(err)
      assert.ok(microserviceCalled)
      assert.equal(err.message, uniqueResult)
      done()
    })

  })

  it('one single microservice - extra data', function(done) {
    var microservice = new Microservice()

    var microserviceCalled = false
    var uniqueResult;
    microservice.add({foo: 'bar'}, function(args, callback) {
      assert.ok(args)
      assert.equal(args.foo, 'bar')
      assert.equal(args.bar, 'foo')
      microserviceCalled = true
      uniqueResult = uuid.v4();
      callback(undefined, uniqueResult)
    })

    microservice.call({foo: 'bar', bar: 'foo'}, function(err, result) {
      assert.ok(!err, err)
      assert.ok(microserviceCalled)
      assert.equal(result, uniqueResult)
      done()
    })

  })

  it('three level single microservice', function(done) {
    var microservice = new Microservice()

    var nestedMicroservice1Called = false
    var nestedMicroservice2Called = false

    var result = {}
    microservice.add({foo: 'bar'}, function(args, callback) {
      assert.ok(args)
      assert.equal(args.foo, 'bar')
      result = {
          '1': 'ms1'
      }
      this.prior(args, callback)
    })
    microservice.add({foo: 'bar'}, function(args, callback) {
      assert.ok(args)
      assert.equal(args.foo, 'bar')
      result['2'] = 'ms2';
      nestedMicroservice1Called = true
      this.prior(args, callback)
    })
    microservice.add({foo: 'bar'}, function(args, callback) {
      assert.ok(args)
      assert.equal(args.foo, 'bar')
      nestedMicroservice2Called = true
      result['3'] = 'ms3';
      callback(undefined, result)
    })

    microservice.call({foo: 'bar'}, function(err, result) {
      assert.ok(!err, err)
      assert.ok(nestedMicroservice1Called)
      assert.ok(nestedMicroservice1Called)
      assert.equal(result['1'], 'ms1')
      assert.equal(result['2'], 'ms2')
      assert.equal(result['3'], 'ms3')
      done()
    })

  })

})
