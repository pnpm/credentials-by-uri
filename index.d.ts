export = getCredentialsByURI

declare function getCredentialsByURI (config: Object, uri: string): {
  authHeaderValue: string | undefined,
  alwaysAuth: boolean | undefined
}
