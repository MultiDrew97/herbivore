import { type RouterOptions, type Response, type Request, type NextFunction } from 'express'
import { Controller, Route } from '@src/routes'
import { createServer } from 'http'
import { constants } from 'http2'
import { DEFAULT_PORT, DEFAULT_HOST } from '@base/helpers'
import { type HerbAPIConfig, createHerbAPI } from '@src'

export * from '@base/helpers'
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

export function createTestServer(apiConfig: HerbAPIConfig, onListening?: () => void) {
	return createServer(createHerbAPI(apiConfig))
		.on('close', () => {
			console.info('Test server has been closed')
		})
		.listen(DEFAULT_PORT, DEFAULT_HOST, () => {
			console.info(`Test server listening on port ${DEFAULT_PORT}`)
			onListening && onListening()
		})
}
