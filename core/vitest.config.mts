import { defineProject } from 'vitest/config'

export default defineProject({
	resolve: { tsconfigPaths: true },
	test: {
		name: { label: 'CORE', color: 'blue' },
		globals: true,
		setupFiles: ['../vitest.setup.ts', './vitest.setup.ts'],
	},
})
