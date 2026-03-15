import { AnotherController, closeTestServer, createTestServer, TestController } from '@spec/helpers'
import { TestProject } from 'vitest/node'

export default async function setup(_: TestProject) {
	console.info('Performing global setup...')
	const server = await createTestServer({ routes: [TestController] })

	return async () => {
		console.info('Performing global teardown...')
		await closeTestServer(server)
		console.log('Finished teardown')
	}
}
