import { defineConfig } from 'vitest/config'
import pkg from './package.json'

export default defineConfig({
	resolve: { tsconfigPaths: true },
	test: {
		name: 'HERBIVORE',
		// silent: true,
		// watch: false,
		// detectAsyncLeaks: true,
		projects: pkg.workspaces.map((w) => `./${w}/vitest.config.mts`),
	},
})
