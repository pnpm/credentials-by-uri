export = getCredentialsByURI

declare function getCredentialsByURI (config: Object, uri: string, userConfig?: Object): {
  authHeaderValue: string | undefined,
  alwaysAuth: boolean | undefined
}
