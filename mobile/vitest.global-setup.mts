import { TestProject } from 'vitest/node'

export default async function setup(project: TestProject) {
	console.info(`Performing global setup for ${project.config.name}...`)

	return async () => {
		console.info('Performing global teardown...')
		console.info('Finished teardown')
	}
}
