import { AxiosRequestConfig } from 'axios'
import { Server } from 'http'
import { constants } from 'http2'
import { callAPI, createTestServer } from '../../jest.helpers'
import { AuthenticationMiddleware, ConfigError } from '../src'
import { AuthenticatorFactory, BasicAuthMiddlewareFactory, TokenAuthMiddlewareFactory } from '../src/authenticators'
import { prefix, TestController } from './jest.helpers'

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
	const opts: AxiosRequestConfig = {}
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
	let server: Server
	beforeAll((done) => {
		server = createTestServer(
			{
				authenticator,
				paths: [TestController],
			},
			done
		)
	})

	afterAll((done) => {
		server.close(done)
	})

	test('Valid', async () => {
		await expect(callAPI(prefix, getOpts(type, valid))).resolves.toMatchResponse({
			status: constants.HTTP_STATUS_OK,
		})
	})

	test('Invalid', async () => {
		for (let invld of invalid) {
			await expect(callAPI(prefix, getOpts(type, invld))).rejects.toMatchResponse({
				status: constants.HTTP_STATUS_UNAUTHORIZED,
			})
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
