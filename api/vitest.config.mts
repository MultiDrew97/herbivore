import { defineProject } from 'vitest/config'

export default defineProject({
	resolve: { tsconfigPaths: true },
	test: {
		name: { label: 'API', color: 'yellow' },
		globals: true,
		environment: 'node',
		setupFiles: ['../vitest.setup.ts', './vitest.setup.ts'],
		globalSetup: ['./vitest.global-setup.ts'],
	},
})
