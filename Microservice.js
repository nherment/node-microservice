
var patrun = require('patrun')
var _ = require('lodash')

function Microservice() {

  var stacks = patrun()

  this.add = function(pattern, action) {
    var existing = stacks.find(pattern)
    if(existing) {
      if(_.isEqual(pattern, existing.pattern)) {
        existing.actions.push(action)
      }
    } else {
      var stackEntry = {
        pattern: pattern,
        actions: [action]
      }
      stacks.add(pattern, stackEntry)
    }
  }

  this.call = function(args, callback) {
    var callStack = generateCallStack(stacks, args, callback)
    callStack.run()
  }

  this.use = function(path) {
    require(path)(this)
  }
}


function generateCallStack(stacks, args, callback) {
  var actions = listActions(stacks, args)

  var executor = {}
  var executorsChain = executor
  for(var i = 0 ; i < actions.length ; i++) {
    executor.downstream = {}
    executor.func = actions[i]
    executor = executor.downstream
  }

  executor = executorsChain

  function executeNextChainItem(args, callback) {
    var prior = function(args, localcb) {
      if(typeof localcb !== 'function') {
        throw new Error('callback should be a function')
      }
      executor = executor.downstream
      executeNextChainItem(args, localcb)
    }
    if(executor.func) {
      try {
        executor.func.call({prior: prior}, args, callback)
      } catch(err) {
        callback(err, undefined)
      }
    }
  }

  return {
    run: function() {
      executeNextChainItem(args, callback)
    }
  }

}

function listActions(stacks, args) {

  var callStack = []
  var argsSpecificStack = stacks.find(args)
  for(var i = 0 ; i < argsSpecificStack.actions.length ; i++) {
    var action = argsSpecificStack.actions[i]
    if(_.isFunction(action)) {
      callStack.push(action)
    } else {
      callStack = callStack.concat(listActions(action, args))
    }
  }
  return callStack
}

module.exports = Microservice
