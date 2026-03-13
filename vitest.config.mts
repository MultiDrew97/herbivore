import tsconfigPaths, { type PluginOptions } from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'
import pkg from './package.json'

export default defineConfig({
	// resolve: { tsconfigPaths: true },
	test: {
		name: 'HERBIVORE',
		silent: 'passed-only',
		globals: true,
		setupFiles: ['./vitest.setup.ts'],
		environment: 'node',
		fileParallelism: false,
		watch: false,
		projects: pkg.workspaces.map((w) => `./${w}/vitest.config.mts`),
	},
	// plugins: [
	// 	tsconfigPaths({
	// 		configNames: ['tsconfig.base.spec.json'],
	// 	} as PluginOptions),
	// ],
})
