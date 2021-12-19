'use strict'
const assert = require('assert')
const toNerfDart = require('nerf-dart')
const { spawnSync } = require('child_process')
const path = require('path')
const fs = require('fs')

module.exports = function getCredentialsByURI (config, uri, userConfig) {
  assert(uri && typeof uri === 'string', 'registry URL is required')
  const nerfed = toNerfDart(uri)
  const defnerf = toNerfDart(config.registry)

  const creds = getScopedCredentials(nerfed, `${nerfed}:`, config, userConfig)
  if (nerfed !== defnerf) return creds

  return {
    ...getScopedCredentials(nerfed, '', config, userConfig),
    ...creds
  }
}

function getScopedCredentials (nerfed, scope, config, userConfig) {
  // hidden class micro-optimization
  const c = {}

  // used to override scope matching for tokens as well as legacy auth
  if (config[`${scope}always-auth`] !== undefined) {
    const val = config[`${scope}always-auth`]
    c.alwaysAuth = val === 'false' ? false : !!val
  }

  if (userConfig && userConfig[`${scope}tokenHelper`]) {
    const helper = userConfig[`${scope}tokenHelper`]
    if (!path.isAbsolute(helper) || !fs.existsSync(helper)) {
      throw new Error(`${scope}tokenHelper must be an absolute path, without arguments`)
    }

    const spawnResult = spawnSync(helper, { shell: true })

    if (spawnResult.status !== 0) {
      throw new Error(`Error running ${helper} as a token helper, configured as ${scope}tokenHelper. Exit code ${spawnResult.status}`)
    }
    c.authHeaderValue = spawnResult.stdout.toString('utf8').trimEnd()
    return c
  }

  // Check for bearer token
  if (config[`${scope}_authToken`]) {
    c.authHeaderValue = `Bearer ${config[`${scope}_authToken`]}`
    return c
  }

  // Check for basic auth token
  if (config[`${scope}_auth`]) {
    c.authHeaderValue = `Basic ${config[`${scope}_auth`]}`
    return c
  }

  // Check for username/password auth
  let username, password
  if (config[`${scope}username`]) {
    username = config[`${scope}username`]
  }
  if (config[`${scope}_password`]) {
    if (scope === '') {
      password = config[`${scope}_password`]
    } else {
      password = Buffer.from(config[`${scope}_password`], 'base64').toString('utf8')
    }
  }

  if (username && password) {
    c.authHeaderValue = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
  }

  return c
}
