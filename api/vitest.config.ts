import tsconfigPaths from 'vite-tsconfig-paths'
import { defineProject } from 'vitest/config'

export default defineProject({
	test: {
		name: { label: 'API', color: 'yellow' },
		globals: true,
		environment: 'node',
		setupFiles: ['./vitest.setup.ts'],
		globalSetup: ['./vitest.global-setup.ts'],
	},
	plugins: [
		tsconfigPaths({
			configNames: ['tsconfig.spec.json'],
		}),
	],
})
