# credentials-by-uri

[![npm version](https://img.shields.io/npm/v/credentials-by-uri.svg)](https://www.npmjs.com/package/credentials-by-uri)
[![Status](https://travis-ci.org/pnpm/credentials-by-uri.svg?branch=master)](https://travis-ci.org/pnpm/credentials-by-uri "See test builds")

> Gets credentials for URI from npm configs

Taken from npm: https://github.com/npm/npm/blob/24ec9f2dd4dcd4f25622dff3a502d4e86a025c0d/lib/config/get-credentials-by-uri.js.

## Install

Install it via npm.

```
npm install credentials-by-uri
```

## Usage

```js
const credentialsByUri = require('credentials-by-uri')

console.log(credentialsByUri())
```

## Related

* [registry-auth-token](https://github.com/rexxars/registry-auth-token) - Get the auth token set for an npm registry

## License

[MIT](https://github.com/pnpm/credentials-by-uri/blob/master/LICENSE)
