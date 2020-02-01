'use strict'
const assert = require('assert')

const toNerfDart = require('nerf-dart')

module.exports = getCredentialsByURI

function getCredentialsByURI (uri, config) {
  assert(uri && typeof uri === 'string', 'registry URL is required')
  const nerfed = toNerfDart(uri)
  const defnerf = toNerfDart(config.registry)

  // hidden class micro-optimization
  const c = {
    scope: nerfed,
    token: undefined,
    password: undefined,
    username: undefined,
    email: undefined,
    auth: undefined,
    alwaysAuth: undefined
  }

  // used to override scope matching for tokens as well as legacy auth
  if (config[`${nerfed}:always-auth`] !== undefined) {
    const val = config[`${nerfed}:always-auth`]
    c.alwaysAuth = val === 'false' ? false : !!val
  } else if (config['always-auth'] !== undefined) {
    c.alwaysAuth = config['always-auth']
  }

  if (config[`${nerfed}:_authToken`]) {
    c.token = config[`${nerfed}:_authToken`]
    // the bearer token is enough, don't confuse things
    return c
  }

  // Handle the old-style _auth=<base64> style for the default
  // registry, if set.
  let {
    _auth: authDef,
    username: userDef,
    _password: passDef
  } = config
  if (authDef && !(userDef && passDef)) {
    authDef = Buffer.from(authDef, 'base64').toString()
    authDef = authDef.split(':')
    userDef = authDef.shift()
    passDef = authDef.join(':')
  }

  if (config[`${nerfed}:_password`]) {
    c.password = Buffer.from(config[`${nerfed}:_password`], 'base64').toString('utf8')
  } else if (nerfed === defnerf && passDef) {
    c.password = passDef
  }

  if (config[`${nerfed}:username`]) {
    c.username = config[`${nerfed}:username`]
  } else if (nerfed === defnerf && userDef) {
    c.username = userDef
  }

  if (config[`${nerfed}:email`]) {
    c.email = config[`${nerfed}:email`]
  } else if (config.email) {
    c.email = config.email
  }

  if (c.username && c.password) {
    c.auth = Buffer.from(`${c.username}:${c.password}`).toString('base64')
  }

  return c
}
