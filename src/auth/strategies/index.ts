import { BackendStrategy } from './backendStrategy'
import { OidcStrategy } from './oidcStrategy'
import type { AuthMode, AuthStrategy } from './types'

let instance: AuthStrategy | null = null

function resolveMode(): AuthMode {
  const raw = import.meta.env.VITE_AUTH_MODE
  return raw === 'oidc' ? 'oidc' : 'backend'
}

export function getAuthStrategy(): AuthStrategy {
  if (!instance) {
    instance = resolveMode() === 'oidc' ? new OidcStrategy() : new BackendStrategy()
  }
  return instance
}

export function getAuthMode(): AuthMode {
  return resolveMode()
}

export type { AuthStrategy, AuthMode } from './types'
export { OidcStrategy } from './oidcStrategy'
