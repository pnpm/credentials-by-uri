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

test('reading always-auth', t => {
  t.deepEqual(credentialsByUri('http://registry.foobar.eu/', {
    registry: 'http://registry.foobar.eu/',
    '//registry.foobar.eu/:always-auth': 'true'
  }), {
    scope: '//registry.foobar.eu/',
    token: undefined,
    username: undefined,
    password: undefined,
    email: undefined,
    auth: undefined,
    alwaysAuth: true
  })
  t.deepEqual(credentialsByUri('http://registry.foobar.eu/', {
    registry: 'http://registry.foobar.eu/',
    '//registry.foobar.eu/:always-auth': 'false'
  }), {
    scope: '//registry.foobar.eu/',
    token: undefined,
    username: undefined,
    password: undefined,
    email: undefined,
    auth: undefined,
    alwaysAuth: false
  })
  t.deepEqual(credentialsByUri('http://registry.foobar.eu/', {
    registry: 'http://registry.foobar.eu/',
    'always-auth': 'true'
  }), {
    scope: '//registry.foobar.eu/',
    token: undefined,
    username: undefined,
    password: undefined,
    email: undefined,
    auth: undefined,
    alwaysAuth: true
  })
  t.deepEqual(credentialsByUri('http://registry.foobar.eu/', {
    registry: 'http://registry.foobar.eu/',
    'always-auth': 'false'
  }), {
    scope: '//registry.foobar.eu/',
    token: undefined,
    username: undefined,
    password: undefined,
    email: undefined,
    auth: undefined,
    alwaysAuth: false
  })
  t.end()
})

test('old-style _auth', t => {
  const auth = encodeBase64('foo:bar')
  t.deepEqual(credentialsByUri('http://registry.foobar.eu/', {
    registry: 'http://registry.foobar.eu/',
    username: 'foo',
    _auth: auth
  }), {
    scope: '//registry.foobar.eu/',
    token: undefined,
    username: 'foo',
    password: 'bar',
    email: undefined,
    auth,
    alwaysAuth: undefined
  })
  t.end()
})

test('email', t => {
  t.deepEqual(credentialsByUri('http://registry.foobar.eu/', {
    registry: 'http://registry.foobar.eu/',
    email: 'foo@bar.com'
  }), {
    scope: '//registry.foobar.eu/',
    token: undefined,
    username: undefined,
    password: undefined,
    email: 'foo@bar.com',
    auth: undefined,
    alwaysAuth: undefined
  })
  t.deepEqual(credentialsByUri('http://registry.foobar.eu/', {
    registry: 'http://registry.foobar.eu/',
    '//registry.foobar.eu/:email': 'foo@bar.com'
  }), {
    scope: '//registry.foobar.eu/',
    token: undefined,
    username: undefined,
    password: undefined,
    email: 'foo@bar.com',
    auth: undefined,
    alwaysAuth: undefined
  })
  t.end()
})

function encodeBase64 (string) {
  return safeBuffer.from(string, 'utf8').toString('base64')
}
