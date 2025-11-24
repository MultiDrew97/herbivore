import tsconfigPaths, { type PluginOptions } from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'
import pkg from './package.json'

export default defineConfig({
	test: {
		name: 'HERBIVORE',
		silent: 'passed-only',
		globals: true,
		setupFiles: ['./vitest.setup.ts'],
		watch: false,
		environment: 'node',
		fileParallelism: false,
		projects: pkg.workspaces.map((w) => `./${w}/vitest.config.ts`),
	},
	plugins: [
		tsconfigPaths({
			configNames: ['tsconfig.base.spec.json'],
		} as PluginOptions),
	],
})
