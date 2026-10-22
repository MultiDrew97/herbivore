import { defineProject, UserWorkspaceConfig } from 'vitest/config'
import { reactNative } from 'vitest-native'

export default defineProject({
	resolve: {
		tsconfigPaths: true,
	},
	test: {
		name: { label: 'MOBILE', color: 'cyan' },
		globals: true,
		setupFiles: ['./vitest.setup.ts'],
		globalSetup: ['./vitest.global-setup.mts'],
	},
	plugins: [reactNative({ platform: 'ios' })],
} as UserWorkspaceConfig)
