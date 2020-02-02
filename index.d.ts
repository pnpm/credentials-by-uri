export = getCredentialsByURI

declare function getCredentialsByURI (uri: string, config: Object): {
  authHeaderValue: string | undefined,
  alwaysAuth: boolean | undefined
}
