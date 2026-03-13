import { TestProject } from 'vitest/node'

export default async function setup(_: TestProject) {
	console.info('Performing global setup...')

	return async () => {
		console.info('Performing global teardown...')
		console.log('Finished teardown')
	}
}
