import { Server } from 'http'
import { createTestServer } from '../../jest.helpers'
import { createHerbAPI } from '../src'
import { Controller, Route } from '../src/routes'
import { NextFunction, Request, Response } from 'express'

const path = '/test'
@Controller(path)
class TestController {
	@Route('get', '/:name')
	getTest(req: Request, res: Response, next: NextFunction) {
		res.json({
			message: `Hello, ${req.params.name}`,
		})
	}
}

test('API Creation', () => {
	// let server: Server
	// beforeAll((done) => {
	// 	server = createTestServer({ paths: [TestController] }, done)
	// })

	// afterAll((done) => {
	// 	if (!server) {
	// 		done()
	// 		return
	// 	}

	// 	server.close((err) => {
	// 		if (err) throw err
	// 		done()
	// 	})
	// })
	const api = createHerbAPI({ paths: [TestController] })
	// expect().toBeDefined()
})
