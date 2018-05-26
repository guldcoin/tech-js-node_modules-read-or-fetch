/* global describe:false it:false */
const assert = require('chai').assert
const pify = require('pify')
const fs = require('fs')
const pfs = pify(fs)
const readOrFetch = require('./read-or-fetch.js')

describe('readOrFetch', () => {
  it('gets a file using dynamically required node fs', async () => {
    var data = await readOrFetch('./package.json')
    assert.exists(data)
    assert.equal(JSON.parse(data.toString('utf8')).name, 'read-or-fetch')
  })
  it('gets a file using fs from global scope', async () => {
    global.fs = fs
    var data = await readOrFetch('./package.json')
    assert.exists(data)
    assert.equal(JSON.parse(data.toString('utf8')).name, 'read-or-fetch')
  })
  it('works with already pified fs', async () => {
    global.fs = pfs
    var data = await readOrFetch('./package.json')
    assert.exists(data)
    assert.equal(JSON.parse(data.toString('utf8')).name, 'read-or-fetch')
  })
  it('works when extended onto fs', async () => {
    global.fs = null
    pfs.readOrFetch = readOrFetch // .bind(pfs)
    var data = await pfs.readOrFetch('./package.json')
    assert.exists(data)
    assert.equal(JSON.parse(data.toString('utf8')).name, 'read-or-fetch')
  })
})
