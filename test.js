'use strict'
const test = require('tape')
const credentialsByUri = require('.')
const safeBuffer = require('safe-buffer').Buffer

test('credentialsByUri()', t => {
  t.throws(() => credentialsByUri(), /registry URL is required/)
  t.throws(() => credentialsByUri(1), /registry URL is required/)

  t.deepEqual(credentialsByUri('http://registry.foobar.eu/', {
    registry: 'http://registry.foobar.eu/',
    '//registry.foobar.eu/:_authToken': 'simple-token'
  }), {
    scope: '//registry.foobar.eu/',
    token: 'simple-token',
    username: undefined,
    password: undefined,
    email: undefined,
    auth: undefined,
    alwaysAuth: undefined
  })

  t.deepEqual(credentialsByUri('http://registry.foobar.eu/', {
    registry: 'http://registry.foobar.eu/',
    '//registry.foobar.eu/:_password': encodeBase64('foobar'),
    '//registry.foobar.eu/:username': 'foobar'
  }), {
    scope: '//registry.foobar.eu/',
    token: undefined,
    password: 'foobar',
    username: 'foobar',
    email: undefined,
    auth: 'Zm9vYmFyOmZvb2Jhcg==',
    alwaysAuth: undefined
  })

  t.end()
})

function encodeBase64 (string) {
  return safeBuffer.from(string, 'utf8').toString('base64')
}
