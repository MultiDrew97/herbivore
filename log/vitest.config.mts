import { defineProject } from 'vitest/config'

export default defineProject({
	resolve: { tsconfigPaths: true },
	test: {
		name: { label: 'LOG', color: 'green' },
		globals: true,
		setupFiles: ['../vitest.setup.ts', './vitest.setup.ts'],
	},
})
