import { Request, response, Response, RouterOptions } from 'express'
import { Server } from 'http'
import { baseAxiosOptions, callAxios, createTestServer, responseContaining } from '../../jest.helpers'
import { Controller, PREFIX, RegisterControllers, Route, ROUTE_OPTIONS, ROUTES } from '../src/routes'
import { createHerbAPI } from '../src'
import { constants } from 'http2'

let server: Server
const prefix: string = '/test'
const opts: RouterOptions = {}

@Controller(prefix, opts)
class TestController {
	name: string = ''
	@Route('get', '/:name')
	getSpecialName(req: Request, res: Response) {
		res.json({
			message: `Hello, ${req.params.name}!`,
		})
	}

	@Route('get', '/')
	getClassName(_: Request, res: Response) {
		res.json({
			message: `Hello, ${this.name}!`,
		})
	}

	@Route('post', '/')
	setName(req: Request, res: Response) {
		res.sendStatus(constants.HTTP_STATUS_CREATED).json({
			message: `Name ${req.body.name} posted`,
		})
	}

	@Route('delete', '/')
	clearName(_: Request, res: Response) {
		this.name = ''
		res.json({
			message: 'Name cleared!',
		})
	}

	@Route('patch', '/')
	updateName(req: Request, res: Response) {
		this.name = req.body.name
		res.json({
			message: `Name updated to ${this.name}`,
		})
	}

	@Route('put', '/')
	putName(req: Request, res: Response) {
		res.json({
			message: `Name ${req.body.name} has been put somewhere`,
		})
	}
}
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
	beforeAll((done) => {
		console.info('Prepping test server...')
		server = createTestServer(
			{
				paths: [TestController],
			},
			done
		)
	})

	afterAll((done) => {
		if (!server) {
			done()
			return
		}

		server.close((err) => {
			if (err) throw err
			done()
		})
	})

	test('GET', async () => {
		await expect(callAxios(prefix, baseAxiosOptions)).resolves.toMatchObject(
			responseContaining({
				message: expect.stringMatching(/Hello/i),
			})
		)

		const name = 'Tester'
		await expect(callAxios(`${prefix}/${name}`, baseAxiosOptions)).resolves.toMatchObject(
			responseContaining({
				message: expect.stringContaining(name),
			})
		)
	})

	test('POST', async () => {
		let name: string = 'Created Name'
		await expect(callAxios(prefix, { ...baseAxiosOptions, method: 'post', data: { name } })).resolves.toMatchObject(
			responseContaining(
				{
					message: expect.stringContaining(name),
				},
				constants.HTTP_STATUS_CREATED
			)
		)
	})

	test('DELETE', async () => {
		await expect(callAxios(prefix, { ...baseAxiosOptions, method: 'delete' })).resolves.toMatchObject(
			responseContaining({}, constants.HTTP_STATUS_OK)
		)
	})

	test('PATCH', async () => {
		let name: string = 'Patched Name'
		await expect(
			callAxios(prefix, { ...baseAxiosOptions, method: 'patch', data: { name } })
		).resolves.toMatchObject(
			responseContaining(
				{
					message: expect.stringContaining(name),
				},
				constants.HTTP_STATUS_OK
			)
		)
	})

	test('PUT', async () => {
		let name: string = 'Put Name'
		await expect(callAxios(prefix, { ...baseAxiosOptions, method: 'put', data: { name } })).resolves.toMatchObject(
			responseContaining(
				{
					message: expect.stringContaining(name),
				},
				constants.HTTP_STATUS_OK
			)
		)
	})
})
