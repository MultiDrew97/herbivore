import { RouterOptions, Response, Request } from 'express'
import { Controller, Route } from '../src/routes'
import { constants } from 'http2'

export const prefix: string = '/test'
export const opts: RouterOptions = {}

@Controller(prefix, opts)
export class TestController {
	name: string = 'Test'
	@Route('get', '/')
	getClassName(_: Request, res: Response) {
		console.log('Get Name: ', this.name)
		res.json({
			message: `Hello, ${this.name}!`,
		})
	}

	@Route('get', '/:name')
	getSpecialName(req: Request, res: Response) {
		console.log('Get Param Name: ', req.params.name)
		res.json({
			message: `Hello, ${req.params.name}!`,
		})
	}

	@Route('post', '/')
	setName(req: Request, res: Response) {
		console.log('Posting Name: ', req.body.name)
		res.status(constants.HTTP_STATUS_CREATED).json({
			message: `Name ${req.body.name} posted`,
		})
	}

	@Route('delete', '/')
	clearName(_: Request, res: Response) {
		this.name = ''
		console.log('Clearing Name: ', this.name)
		res.json({
			message: 'Name cleared!',
		})
	}

	@Route('patch', '/')
	updateName(req: Request, res: Response) {
		this.name = req.body.name
		console.log('Updating Name: ', this.name)
		res.json({
			message: `Name updated to ${this.name}`,
		})
	}

	@Route('put', '/')
	putName(req: Request, res: Response) {
		console.log('Putting Name somewhere')
		res.json({
			message: `Name ${req.body.name} has been put somewhere`,
		})
	}
}
