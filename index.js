'use strict'
const assert = require('assert')

const toNerfDart = require('nerf-dart')

module.exports = getCredentialsByURI

function getCredentialsByURI (uri, config) {
  assert(uri && typeof uri === 'string', 'registry URL is required')
  const nerfed = toNerfDart(uri)
  const defnerf = toNerfDart(config.registry)

  const creds = getScopedCredentials(nerfed, `${nerfed}:`, config)
  if (nerfed !== defnerf) return creds

  return {
    ...getScopedCredentials(nerfed, '', config),
    ...creds
  }
}

function getScopedCredentials (nerfed, scope, config) {
  // hidden class micro-optimization
  const c = {}

  // used to override scope matching for tokens as well as legacy auth
  if (config[`${scope}always-auth`] !== undefined) {
    const val = config[`${scope}always-auth`]
    c.alwaysAuth = val === 'false' ? false : !!val
  }

  // Check for bearer token
  if (config[`${scope}_authToken`]) {
    c.token = config[`${scope}_authToken`]
    return c
  }

  // Check for basic auth token
  if (config[`${scope}_auth`]) {
    c._auth = config[`${scope}_auth`]
    return c
  }

  // Check for username/password auth
  if (config[`${scope}username`]) {
    c.username = config[`${scope}username`]
  }
  if (config[`${scope}_password`]) {
    if (scope === '') {
      c.password = config[`${scope}_password`]
    } else {
      c.password = Buffer.from(config[`${scope}_password`], 'base64').toString('utf8')
    }
  }

  if (c.username && c.password) {
    c._auth = Buffer.from(`${c.username}:${c.password}`).toString('base64')
  }

  return c
}
