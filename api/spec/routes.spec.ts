import { callAPI, opts, prefix, TestController } from '@spec/helpers'
import { PREFIX, ROUTE_OPTIONS, ROUTES } from '@src/routes'
import { constants } from 'http2'

describe('Route Decorators', () => {
	test('Controller', () => {
		expect(Reflect.getMetadata(PREFIX, TestController)).toBe(prefix)
		expect(Reflect.getMetadata(ROUTE_OPTIONS, TestController)).toMatchObject(opts)
	})

	test('Route', () => {
		const routes = Reflect.getMetadata(ROUTES, TestController)
		expect(routes).toMatchObject(
			expect.arrayContaining([
				expect.objectContaining({
					path: '/',
				}),
			])
		)

		expect(routes).toMatchObject(
			expect.arrayContaining([
				expect.objectContaining({
					path: '/:name',
				}),
			])
		)
	})
})

describe('Route Registrations', () => {
	test('Pre Route Handlers', async () => {
		await expect(callAPI(`${prefix}?test=pre`)).resolves.toMatchResponse({
			status: constants.HTTP_STATUS_ACCEPTED,
			data: {
				message: 'Terminated early for test purposes',
			},
		})
	})

	test('Child Route Registration', async () => {
		await expect(callAPI('/test/another/end')).resolves.toMatchResponse({
			status: constants.HTTP_STATUS_OK,
		})

		await expect(callAPI('/test/child/end')).resolves.toMatchResponse({
			status: constants.HTTP_STATUS_OK,
		})

		await expect(callAPI('/test/another/non')).rejects.toMatchResponse({
			status: constants.HTTP_STATUS_NOT_FOUND,
		})
	})

	test('GET', async () => {
		await expect(callAPI(prefix)).resolves.toMatchResponse({
			status: constants.HTTP_STATUS_OK,
			data: {
				message: expect.stringMatching(/Hello/i),
			},
		})

		const name = 'Tester'
		await expect(callAPI(`${prefix}/${name}`)).resolves.toMatchResponse({
			status: constants.HTTP_STATUS_OK,
			data: {
				message: expect.stringContaining(name),
			},
		})
	})

	test('POST', async () => {
		let name: string = 'Created Name'
		await expect(callAPI(prefix, { method: 'post', data: { name } })).resolves.toMatchResponse({
			status: constants.HTTP_STATUS_CREATED,
			data: {
				message: expect.stringContaining(name),
			},
		})
	})

	test('DELETE', async () => {
		await expect(callAPI(prefix, { method: 'delete' })).resolves.toMatchResponse({
			status: constants.HTTP_STATUS_OK,
		})
	})

	test('PATCH', async () => {
		let name: string = 'Patched Name'
		await expect(callAPI(prefix, { method: 'patch', data: { name } })).resolves.toMatchResponse({
			status: constants.HTTP_STATUS_OK,
			data: {
				message: expect.stringContaining(name),
			},
		})
	})

	test('PUT', async () => {
		let name: string = 'Put Name'
		await expect(callAPI(prefix, { method: 'put', data: { name } })).resolves.toMatchResponse({
			status: constants.HTTP_STATUS_OK,
			data: {
				message: expect.stringContaining(name),
			},
		})
	})

	test('PARAM', async () => {
		let name: string = 'Param Name'
		await expect(callAPI(`${prefix}/${name}?test=param`)).resolves.toMatchResponse({
			status: constants.HTTP_STATUS_ACCEPTED,
			data: {
				message: expect.stringContaining(name),
			},
		})
	})
})
