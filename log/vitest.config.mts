import tsconfigPaths from 'vite-tsconfig-paths'
import { defineProject } from 'vitest/config'

export default defineProject({
	// resolve: { tsconfigPaths: true },
	test: {
		name: { label: 'LOG', color: 'green' },
		globals: true,
	},
	plugins: [
		tsconfigPaths({
			configNames: ['tsconfig.spec.json'],
		}),
	],
})

// export default config
