'use strict'
const test = require('tape')
const path = require('path')
const credentialsByUri = require('.')
const safeBuffer = require('safe-buffer').Buffer

test('credentialsByUri()', t => {
  t.throws(() => credentialsByUri({}), /registry URL is required/)
  t.throws(() => credentialsByUri({}, 1), /registry URL is required/)

  t.deepEqual(credentialsByUri({
    registry: 'http://registry.foobar.eu/',
    '//registry.foobar.eu/:_authToken': 'simple-token'
  }, 'http://registry.foobar.eu/'), {
    authHeaderValue: 'Bearer simple-token'
  })

  t.deepEqual(credentialsByUri({
    registry: 'http://registry.foobar.eu/',
    '//registry.foobar.eu/:_password': encodeBase64('foobar'),
    '//registry.foobar.eu/:username': 'foobar'
  }, 'http://registry.foobar.eu/'), {
    authHeaderValue: 'Basic Zm9vYmFyOmZvb2Jhcg=='
  })

  t.deepEqual(credentialsByUri({
    registry: 'https://registry.npmjs.org/',
    '//registry.foobar.eu/artifactory/api/npm/:_authToken': 'simple-token'
  }, 'http://registry.foobar.eu/artifactory/api/npm/npm-local'), {
    authHeaderValue: 'Bearer simple-token'
  })

  t.end()
})

test('reading always-auth', t => {
  t.deepEqual(credentialsByUri({
    registry: 'http://registry.foobar.eu/',
    '//registry.foobar.eu/:always-auth': 'true'
  }, 'http://registry.foobar.eu/'), {
    alwaysAuth: true
  })
  t.deepEqual(credentialsByUri({
    registry: 'http://registry.foobar.eu/',
    '//registry.foobar.eu/:always-auth': 'false'
  }, 'http://registry.foobar.eu/'), {
    alwaysAuth: false
  })
  t.deepEqual(credentialsByUri({
    registry: 'http://registry.foobar.eu/',
    'always-auth': 'true'
  }, 'http://registry.hu/'), {})
  t.deepEqual(credentialsByUri({
    registry: 'http://registry.foobar.eu/',
    'always-auth': 'false'
  }, 'http://registry.foobar.eu/'), {
    alwaysAuth: false
  })
  t.end()
})

test('old-style _auth', t => {
  const auth = encodeBase64('foo:bar')
  t.deepEqual(credentialsByUri({
    registry: 'http://registry.foobar.eu/',
    username: 'foo',
    _auth: auth
  }, 'http://registry.foobar.eu/'), {
    authHeaderValue: `Basic ${auth}`
  })
  t.deepEqual(credentialsByUri({
    registry: 'http://registry.foobar.eu/',
    _auth: auth
  }, 'http://registry.hu/'), {
  }, 'the default old-style auth token should not be returned for non-default registry')

  t.deepEqual(credentialsByUri({
    registry: 'http://registry.foobar.eu/',
    '//registry.foobar.eu/:_auth': auth
  }, 'http://registry.foobar.eu/'), {
    authHeaderValue: `Basic ${auth}`
  })
  t.deepEqual(credentialsByUri({
    registry: 'http://registry.foobar.eu/',
    '//registry.foobar.eu/:_auth': auth
  }, 'http://registry.hu/'), {
  }, 'the default old-style auth token should not be returned for non-default registry')
  t.end()
})

test('username/password for the default registry', t => {
  const auth = encodeBase64('foo:bar')
  t.deepEqual(credentialsByUri({
    registry: 'http://registry.foobar.eu/',
    username: 'foo',
    _password: 'bar'
  }, 'http://registry.foobar.eu/'), {
    authHeaderValue: `Basic ${auth}`
  })
  t.deepEqual(credentialsByUri({
    registry: 'http://registry.foobar.eu/',
    username: 'foo',
    _password: 'bar'
  }, 'http://registry.hu/'), {
  }, 'username/password should not be returned for non-default registry')
  t.end()
})

test('tokenHelper', t => {
  t.deepEqual(credentialsByUri({
    registry: 'http://registry.foobar.eu/'
  }, 'http://registry.foobar.eu/', {
    tokenHelper: path.join(__dirname, 'test-exec.js')
  }), {
    authHeaderValue: 'Bearer token-from-spawn'
  })
  t.deepEqual(credentialsByUri({
    registry: 'http://registry.foobar.eu/'
  }, 'http://registry.hu/', {
    '//registry.hu/:tokenHelper': path.join(__dirname, 'test-exec.js')
  }), {
    authHeaderValue: 'Bearer token-from-spawn'
  })
  t.throws(() => {
    credentialsByUri({
      registry: 'http://registry.foobar.eu/'
    }, 'http://registry.foobar.eu/', {
      tokenHelper: path.join(__dirname, 'test-exec-error.js')
    })
  }, 'a process exiting with non-zero should throw')
  t.throws(() => {
    credentialsByUri({
      registry: 'http://registry.foobar.eu/'
    }, 'http://registry.foobar.eu/', {
      tokenHelper: './test-exec.js'
    })
  }, 'token helpers must be absolute paths')
  t.throws(() => {
    credentialsByUri({
      registry: 'http://registry.foobar.eu/'
    }, 'http://registry.foobar.eu/', {
      tokenHelper: path.join(__dirname, 'test-exec.js') + ' arg1'
    })
  }, 'token helpers must be absolute paths, without arguments')
  t.end()
})

function encodeBase64 (string) {
  return safeBuffer.from(string, 'utf8').toString('base64')
}
