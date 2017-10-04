export = getCredentialsByURI

declare function getCredentialsByURI (uri: string, config: Object): {
  scope: string,
  token: string | undefined,
  password: string | undefined,
  username: string | undefined,
  email: string | undefined,
  auth: string | undefined,
  alwaysAuth: string | undefined
}
