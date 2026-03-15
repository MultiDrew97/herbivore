import { decode } from '@herbivore/core/utils'
import { ArgumentError, AuthenticationError } from '@herbivore/core/utils/errors'
import { IAuth } from '@herbivore/core/utils/interfaces'
import { AuthenticationMiddleware, ConfigError } from '@src'
import { RequestHandler } from 'express'
import { IncomingHttpHeaders } from 'http2'

type AuthType = 'basic' | 'token'
type Auth = IAuth | string
export type AuthenticatorFactory<T> = (cfg: T) => AuthenticationMiddleware
function getAuth(type: AuthType, headers: IncomingHttpHeaders): Auth {
	if (!headers.authorization) throw new AuthenticationError('No auth provided')

	switch (type) {
		case 'basic':
			console.debug('Provided Header: ', headers.authorization)
			if (!/Basic\s.+/.test(headers.authorization))
				throw new AuthenticationError(`Improper authentication provided`)

			const [username, password] = decode(headers.authorization.split(/\s/)[1]).split(':')

			return { username, password }
		case 'token':
			if (!/Bearer\s.+/.test(headers.authorization))
				throw new AuthenticationError(`Improper authentication provided`)

			return headers.authorization.split(/\s/)[1]
		default:
			throw new ArgumentError(`Unknown auth type '${type}'`)
	}
}

type UnencryptedBasicAuthConfig = {
	encrypted: false
}

type EncryptedBasicAuthConfig = {
	encrypted: true
	encrypt: (value: string, salt?: string) => string
}

/**
 * The config for creating a credential based authenticator middleware
 */
export type BasicAuthConfig = (UnencryptedBasicAuthConfig | EncryptedBasicAuthConfig) & {
	credentials: IAuth
}
/**
 * A factory for creating a new credentials based authenticor middleware.
 *
 * If a failed authentication attempt occurs, it will call the provided error handler and respond accordingly
 * @param cfg The config for the authenticator
 * @returns The authentication middleware that handles credential authentication
 *
 * @see {@link BasicAuthConfig}
 *
 * @throws ConfigError
 */
export const BasicAuthMiddlewareFactory: AuthenticatorFactory<BasicAuthConfig> = (
	cfg: BasicAuthConfig,
): AuthenticationMiddleware => {
	console.info('Validating basic config...')
	console.debug('Invalid? ', cfg.encrypted && !cfg.encrypt)
	if (cfg.encrypted && !cfg.encrypt) {
		throw new ConfigError('BasicAuthMiddleware - Must provide encrypt function if credentials are encrypted')
	}
	console.info('Valid basic config')

	function validatePassword(password: string) {
		if (cfg.encrypted && !cfg.encrypt)
			throw new ConfigError('Must provide an encryption function when using encrypt')

		return cfg.encrypted
			? cfg.encrypt(password, cfg.credentials.salt) == cfg.credentials.password
			: password == cfg.credentials.password
	}

	return (req, _, next) => {
		try {
			console.info('Validating request with credential based authentication...')
			console.debug('Provided config: ', cfg)
			const { username, password } = getAuth('basic', req.headers) as IAuth

			console.debug('Provided Username: ', username)
			console.debug('Config Username: ', cfg.credentials.username)
			console.debug('Correct? ', username == cfg.credentials.username)

			if (username != cfg.credentials.username) throw new AuthenticationError('Invalid username provided')

			if (!password || !validatePassword(password)) throw new AuthenticationError('Invalid password provided')

			next()
		} catch (err: any) {
			console.error(`BasicAuthenticator - ${err.message}`)
			next(err)
		}
	}
}

/**
 * The config for creating a token based authenticator middleware
 */
export type TokenAuthConfig = {
	genPath?: string
	genToken?: RequestHandler
	validate: (token: string) => boolean
}
/**
 * A factory for creating a new token based authenticor middleware.
 *
 *  If a failed authentication attempt occurs, it will call the provided error handler and respond accordingly
 * @param cfg The config for the authenticator
 * @returns The authentication middleware that handles token based authentication
 *
 * @see {@link TokenAuthConfig}
 *
 * @throws ConfigError
 */
export function TokenAuthMiddlewareFactory(cfg: TokenAuthConfig): AuthenticationMiddleware {
	console.info('Validating token config...')
	if (cfg.genPath && !cfg.genToken)
		throw new ConfigError(
			'Must provide a middleware function to handle generating a token if providing a token generation path',
		)
	if (cfg.genToken && !cfg.genPath)
		throw new ConfigError(
			'Must provide a token generation path if providing a token generation middleware function',
		)
	// Run config validation for this authenticator
	console.info('Valid token config')

	return (req, res, next) => {
		try {
			if (cfg.genPath && req.path == cfg.genPath) {
				console.debug('Token generation path reached')
				cfg.genToken && cfg.genToken(req, res, next)
				return
			}

			console.info('Validating request with token based authentication...')

			const token = getAuth('token', req.headers) as string

			if (!cfg.validate(token)) throw new AuthenticationError('Invalid token provided')

			next()
		} catch (err: any) {
			console.error(`TokenAuthenticator - ${err.message}`)
			next(err)
		}
	}
}
