import tsconfigPaths from 'vite-tsconfig-paths'
import { defineProject } from 'vitest/config'

export default defineProject({
	test: {
		name: { label: 'CORE', color: 'blue' },
		globals: true,
	},
	plugins: [
		tsconfigPaths({
			configNames: ['tsconfig.spec.json'],
		}),
	],
})

// export default config
