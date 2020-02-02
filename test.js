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
    token: 'simple-token'
  })

  t.deepEqual(credentialsByUri('http://registry.foobar.eu/', {
    registry: 'http://registry.foobar.eu/',
    '//registry.foobar.eu/:_password': encodeBase64('foobar'),
    '//registry.foobar.eu/:username': 'foobar'
  }), {
    password: 'foobar',
    username: 'foobar',
    _auth: 'Zm9vYmFyOmZvb2Jhcg=='
  })

  t.end()
})

test('reading always-auth', t => {
  t.deepEqual(credentialsByUri('http://registry.foobar.eu/', {
    registry: 'http://registry.foobar.eu/',
    '//registry.foobar.eu/:always-auth': 'true'
  }), {
    alwaysAuth: true
  })
  t.deepEqual(credentialsByUri('http://registry.foobar.eu/', {
    registry: 'http://registry.foobar.eu/',
    '//registry.foobar.eu/:always-auth': 'false'
  }), {
    alwaysAuth: false
  })
  t.deepEqual(credentialsByUri('http://registry.hu/', {
    registry: 'http://registry.foobar.eu/',
    'always-auth': 'true'
  }), {
  })
  t.deepEqual(credentialsByUri('http://registry.foobar.eu/', {
    registry: 'http://registry.foobar.eu/',
    'always-auth': 'false'
  }), {
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
    _auth: auth
  })
  t.deepEqual(credentialsByUri('http://registry.hu/', {
    registry: 'http://registry.foobar.eu/',
    _auth: auth
  }), {
  }, 'the default old-style auth token should not be returned for non-default registry')

  t.deepEqual(credentialsByUri('http://registry.foobar.eu/', {
    registry: 'http://registry.foobar.eu/',
    '//registry.foobar.eu/:_auth': auth
  }), {
    _auth: auth
  })
  t.deepEqual(credentialsByUri('http://registry.hu/', {
    registry: 'http://registry.foobar.eu/',
    '//registry.foobar.eu/:_auth': auth
  }), {
  }, 'the default old-style auth token should not be returned for non-default registry')
  t.end()
})

test('username/password for the default registry', t => {
  const auth = encodeBase64('foo:bar')
  t.deepEqual(credentialsByUri('http://registry.foobar.eu/', {
    registry: 'http://registry.foobar.eu/',
    username: 'foo',
    _password: 'bar'
  }), {
    username: 'foo',
    password: 'bar',
    _auth: auth
  })
  t.deepEqual(credentialsByUri('http://registry.hu/', {
    registry: 'http://registry.foobar.eu/',
    username: 'foo',
    _password: 'bar'
  }), {
  }, 'username/password should not be returned for non-default registry')
  t.end()
})

function encodeBase64 (string) {
  return safeBuffer.from(string, 'utf8').toString('base64')
}
