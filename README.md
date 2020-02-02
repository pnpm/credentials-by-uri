# credentials-by-uri

[![npm version](https://img.shields.io/npm/v/credentials-by-uri.svg)](https://www.npmjs.com/package/credentials-by-uri)
[![Status](https://travis-ci.org/pnpm/credentials-by-uri.svg?branch=master)](https://travis-ci.org/pnpm/credentials-by-uri "See test builds")

> Gets credentials for URI from npm configs

## Install

```
pnpm add credentials-by-uri
```

## Usage

```js
const credentialsByUri = require('credentials-by-uri')

console.log(credentialsByUri())
> { authHeaderValue: 'Bearer f23jj93f32dsaf==', alwaysAuth: false }
```

## Related

* [registry-auth-token](https://github.com/rexxars/registry-auth-token) - Get the auth token set for an npm registry

## License

[MIT](https://github.com/pnpm/credentials-by-uri/blob/master/LICENSE)
