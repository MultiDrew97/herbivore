import { encode } from '@herbivore/core/utils'
import { AuthenticationError } from '@herbivore/core/utils/errors'
import { baseAxiosOptions } from '@spec/helpers'
import { type AuthenticationMiddleware, ConfigError } from '@src'
import { type AuthenticatorFactory, BasicAuthMiddlewareFactory, TokenAuthMiddlewareFactory } from '@src/authenticators'
import { type AxiosRequestConfig } from 'axios'
import { Request, response, Response } from 'express'

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

function createRequest(type: string, auth: any) {
	const req = {
		headers: {},
	} as Request

	switch (type) {
		case 'basic':
			req.headers.authorization = `Basic ${encode(`${auth.username}:${auth.password}`)}`
			break
		case 'token':
			req.headers.authorization = auth
			break
		default:
			console.warn(`Authenticators - Valid: Unknown authentication type '${type}'`)
	}
	return req
}

const mockNext = vitest.fn((err) => err)

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
			validate: (token: string) => token == 'valid_token',
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

		expect(mockNext).toHaveBeenLastCalledWith()
	})

	test('Invalid', async () => {
		for (let invld of invalid) {
			authenticator(createRequest(type, invld), response, mockNext)

			expect(mockNext).toHaveBeenLastCalledWith(expect.any(AuthenticationError))
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
