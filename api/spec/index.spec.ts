import { createHerbAPI } from '../src'
import { TestController } from './jest.helpers'

test('API Creation', () => {
	function create() {
		createHerbAPI({ paths: [TestController] })
	}

	expect(create).not.toThrow()

	expect(create).toBeDefined()
})
