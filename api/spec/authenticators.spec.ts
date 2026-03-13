import { encode } from '@herbivore/core/utils'
import { AuthenticationError, AuthorizationError } from '@herbivore/core/utils/errors'
import { baseAxiosOptions } from '@spec/helpers'
import { type AuthenticationMiddleware, ConfigError } from '@src'
import { type AuthenticatorFactory, BasicAuthMiddlewareFactory, TokenAuthMiddlewareFactory } from '@src/authenticators'
import { type AxiosRequestConfig } from 'axios'
import { request, type Request, Response, response } from 'express'
import jwt from 'jsonwebtoken'

type AuthenticatorTestConfig<T> = {
	valid: T
	invalid: Array<T>
}

type BasicAuthTestConfig = {
	type: 'basic'
}

type TokenAuthTestConfig = {
	type: 'token'
}

type AuthenticationTestConfig<T = any> = { authenticator: AuthenticationMiddleware } & AuthenticatorTestConfig<T> &
	(BasicAuthTestConfig | TokenAuthTestConfig)

type AuthenticatorConfigTestConfig<T = any> = {
	factory: AuthenticatorFactory<T>
} & AuthenticatorTestConfig<T> &
	(BasicAuthTestConfig | TokenAuthTestConfig)

function getOpts(type: string, auth: any) {
	const opts: AxiosRequestConfig = { ...baseAxiosOptions }
	switch (type) {
		case 'basic':
			opts.withCredentials = true
			opts.auth = auth
			break
		case 'token':
			opts.headers = {
				...opts.headers,
				Authorization: auth,
			}
			break
		default:
			console.warn(`Authenticators - Valid: Unknown authentication type '${type}'`)
	}
	return opts
}

type AuthType = 'token' | 'basic'
function createRequest(type: AuthType, auth: any, path?: string) {
	const req = {
		path,
		headers: {},
	} as Request

	switch (type) {
		case 'basic':
			req.headers.authorization = `Basic ${encode(`${auth.username}:${auth.password}`)}`
			break
		case 'token':
			req.headers.authorization = `Bearer ${auth}`
			break
		default:
			console.warn(`Authenticators - Valid: Unknown authentication type '${type}'`)
	}
	return req
}

const mockNext = vitest.fn((err) => console.error(err?.message))
const tokenGenPath = '/token/create'

describe.each<AuthenticationTestConfig>([
	{
		type: 'basic',
		authenticator: BasicAuthMiddlewareFactory({
			encrypted: false,
			credentials: {
				username: 'user_good',
				password: 'pass_good',
			},
		}),
		valid: {
			username: 'user_good',
			password: 'pass_good',
		},
		invalid: [
			{
				username: 'user_good',
				password: 'pass_bad',
			},
			{
				username: 'user_good',
				password: 'pass_bad',
			},
			{
				username: 'user_bad',
				password: 'pass_good',
			},
		],
	},
	{
		type: 'token',
		authenticator: TokenAuthMiddlewareFactory({
			genPath: tokenGenPath,
			validate: (token: string) => token == 'valid_token',
			genToken: (_, res, __) => {
				res.json({ token: 'valid_token' })
			},
		}),
		valid: 'valid_token',
		invalid: ['test', 'invalid_token', '431'],
	},
])('Proper Authentications', ({ type, authenticator, valid, invalid }) => {
	afterEach(() => {
		mockNext.mockClear()
	})

	test('Valid', async () => {
		authenticator(createRequest(type, valid), response, mockNext)
		expect(mockNext).lastCalledWith()
	})

	test('Invalid', async () => {
		for (let invld of invalid) {
			authenticator(createRequest(type, invld), response, mockNext)

			expect(mockNext).lastCalledWith(expect.any(AuthenticationError))
		}
	})
})

describe.each<AuthenticatorConfigTestConfig>([
	{
		type: 'basic',
		factory: BasicAuthMiddlewareFactory,
		valid: {
			encrypted: false,
			credentials: {
				username: 'user_good',
				password: 'pass_good',
			},
		},
		invalid: [
			{
				encrypted: true,
				credentials: {
					username: 'user_good',
					password: 'pass_good',
				},
			},
		],
	},
])('Valid Authenticator Configs', ({ factory, valid, invalid }) => {
	test('Valid', () => {
		expect(() => factory(valid)).not.toThrow()
	})
	test('Invalid', () => {
		for (let invld of invalid) {
			console.debug('Current Invalid: ', invld)
			expect(() => factory(invld)).toThrow(ConfigError)
		}
	})
})

describe('Token Generation', () => {
	const secret = 'test_secret'
	const validToken = 'valid_token'
	const token = jwt.sign(validToken, secret)

	const res = {
		json: (obj: any) => console.debug(obj),
	} as Response
	const jsonSpy = vi.spyOn(res, 'json')

	const auth = TokenAuthMiddlewareFactory({
		genPath: tokenGenPath,
		validate: (tkn: string) => tkn == token,
		genToken: (req, res, next) => {
			try {
				if (!req.headers.authorization) throw new AuthenticationError('No authorization provided')

				const auth = req.headers.authorization

				if (!/Bearer\s.+/.test(auth)) throw new AuthenticationError('Improper authorization protocol')

				const tkn = auth.split(/\s/)[1]
				if (tkn != validToken) throw new AuthorizationError('Incorrect token provided')

				res.json({ token })
			} catch (err) {
				next(err)
			}
		},
	})

	afterEach(() => {
		mockNext.mockClear()
		jsonSpy.mockClear()
	})

	test('Valid', () => {
		auth(createRequest('token', validToken, tokenGenPath), res, mockNext)

		expect(jsonSpy).toBeCalledWith({ token })
		expect(mockNext).not.toBeCalled()
	})

	test('Invalid', () => {
		// Incorrect auth type
		const basicAuth = {
			username: 'user_bad',
			password: 'pass_bad',
		}
		auth(createRequest('basic', basicAuth, tokenGenPath), response, mockNext)
		const typ = mockNext.mock.lastCall!
		expect(typ[0]).toBeInstanceOf(AuthenticationError)
		expect(typ[0].message).toStrictEqual(expect.stringContaining('protocol'))
		expect(jsonSpy).not.toBeCalled()

		// No auth present
		auth(
			{
				path: tokenGenPath,
				headers: {},
			} as Request,
			response,
			mockNext,
		)
		const none = mockNext.mock.lastCall!
		expect(none[0]).toBeInstanceOf(AuthenticationError)
		expect(none[0].message).toStrictEqual(expect.stringContaining('auth'))
		expect(jsonSpy).not.toBeCalled()

		// Incorrect token
		const invalidToken = 'invalid_token'
		auth(createRequest('token', invalidToken, tokenGenPath), res, mockNext)
		const invld = mockNext.mock.lastCall!
		expect(invld[0]).toBeInstanceOf(AuthorizationError)
		expect(invld[0].message).toStrictEqual(expect.stringContaining('token'))
		expect(jsonSpy).not.toBeCalled()
	})
})
