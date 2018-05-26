/* global fs:false fetch:false */
const pify = require('pify')
const Buffer = require('buffer/').Buffer

async function readOrFetch (p) {
  if (this.hasOwnProperty('readFile')) {
    return new Buffer(await pify(this.readFile)(p))
  } else if (typeof fs !== 'undefined' && fs instanceof Object && fs.hasOwnProperty('readFile')) {
    return new Buffer(await pify(fs.readFile)(p))
  } else {
    if (typeof require !== 'undefined') {
      try {
        return new Buffer(await pify(require('fs').readFile)(p))
      } catch (e) {
        // keep trying
      }
    }
  }
  if (typeof fetch === 'function') {
    const response = await fetch(p)
    if (response.ok) {
      return new Buffer(await response.arrayBuffer())
    }
  }
  throw new Error('Neither fs nor fetch available in environment.')
}

module.exports = readOrFetch
