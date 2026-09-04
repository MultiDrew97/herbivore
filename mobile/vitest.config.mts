import { defineProject, UserWorkspaceConfig } from 'vitest/config'
import { reactNative } from 'vitest-native'

export default defineProject({
	resolve: {
		tsconfigPaths: true,
		// alias: { ...jestCompatAliases() },
	},
	test: {
		name: { label: 'MOBILE', color: 'cyan' },
		globals: true,
		environment: 'node',
		setupFiles: ['../vitest.setup.ts', './vitest.setup.ts'],
		globalSetup: ['./vitest.global-setup.ts'],
		directory: './spec',
	},
	plugins: [reactNative()],
} as UserWorkspaceConfig)
