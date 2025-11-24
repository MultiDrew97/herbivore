import { DEFAULT_HOST, DEFAULT_PORT, waitFor } from '@base/helpers'
import { type HerbAPIConfig, createHerbAPI } from '@src'
import { Controller, Route } from '@src/routes'
import { type NextFunction, type Request, type Response, type RouterOptions } from 'express'
import { createServer, Server } from 'http'
import { constants } from 'http2'

export const prefix: string = '/test'
export const opts: RouterOptions = {}

@Controller(prefix, opts)
export class TestController {
	name: string = 'Test'
	@Route('get', '/')
	getClassName(_: Request, res: Response, next: NextFunction) {
		console.log('Get Name: ', this.name)
		res.json({
			message: `Hello, ${this.name}!`,
		})
	}

	@Route('get', '/:name')
	getSpecialName(req: Request, res: Response, next: NextFunction) {
		console.log('Get Param Name: ', req.params.name)
		res.json({
			message: `Hello, ${req.params.name}!`,
		})
	}

	@Route('post', '/')
	setName(req: Request, res: Response, next: NextFunction) {
		console.log('Posting Name: ', req.body.name)
		res.status(constants.HTTP_STATUS_CREATED).json({
			message: `Name ${req.body.name} posted`,
		})
	}

	@Route('delete', '/')
	clearName(_: Request, res: Response, next: NextFunction) {
		this.name = ''
		console.log('Clearing Name: ', this.name)
		res.json({
			message: 'Name cleared!',
		})
	}

	@Route('patch', '/')
	updateName(req: Request, res: Response, next: NextFunction) {
		this.name = req.body.name
		console.log('Updating Name: ', this.name)
		res.json({
			message: `Name updated to ${this.name}`,
		})
	}

	@Route('put', '/')
	putName(req: Request, res: Response, _next: NextFunction) {
		console.log('Putting Name somewhere')
		res.json({
			message: `Name ${req.body.name} has been put somewhere`,
		})
	}

	@Route('param', 'name')
	temp(req: Request, res: Response, next: NextFunction, name: string, key: string) {
		console.warn('Param Name: ', name)
		next()
	}
}

@Controller('/another', {
	children: [{ path: '/child', controller: TestController }, TestController],
})
export class AnotherController {
	@Route('get', '/')
	getTest(req: Request, res: Response, next: NextFunction) {
		res.sendStatus(constants.HTTP_STATUS_OK)
	}
}

export async function createTestServer(
	apiConfig: HerbAPIConfig,
	port: number = DEFAULT_PORT,
	host: string = DEFAULT_HOST,
	onListening?: () => void
) {
	const server = createServer(createHerbAPI(apiConfig))
		.on('close', () => {
			console.info('Test server has been closed')
		})
		.listen(port, host, () => {
			console.info(`Test server listening on port ${port}`)
			onListening && onListening()
		})

	await waitFor(() => {
		if (server.listening) return

		throw new Error('Not listening yet')
	})

	// await vitest.waitFor(() => {
	// 	if (!server || server.listening) return

	// 	throw new Error('Server not ready')
	// })

	return server
}

export async function closeTestServer(server: Server) {
	console.debug('Server Undefined?', !server)
	if (!server) return

	// function handleCloseError(err) {
	// 	if (!err) return

	// 	console.error(err.message)
	// 	server.close(handleCloseError)
	// }

	server.close(/* handleCloseError */)
	await waitFor(() => {
		if (!server.listening) return

		throw new Error('Server still running')
	})
}

export * from '@base/helpers'
