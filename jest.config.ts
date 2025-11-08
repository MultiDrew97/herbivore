import { resolve } from 'path'
import { type TsJestTransformerOptions, type JestConfigWithTsJest, createDefaultEsmPreset, pathsToModuleNameMapper } from 'ts-jest'

import pkg from './package.json' with {type: "json"}

const config: JestConfigWithTsJest = {
	...createDefaultEsmPreset({
		tsconfig: '<rootDir>/tsconfig.spec.json',
		useESM: true,
		diagnostics: {
			pretty: true,
			// ignoreCodes: ['151002'],
		},
	} as TsJestTransformerOptions),
	preset: 'ts-jest',
	testEnvironment: 'node',
	verbose: true,
	silent: true,
	detectLeaks: true,
	detectOpenHandles: true,
	errorOnDeprecated: true,
	randomize: true,
	watchman: true,
	// globalSetup: resolve(import.meta.dirname, "./jest.setup.ts"),
	setupFilesAfterEnv: [resolve('./jest.setup.ts')],
	moduleDirectories: ['<rootDir>/node_modules'],
	projects: pkg.workspaces.map((w: string) => resolve(`./${w}/jest.config.ts`)),
	// moduleNameMapper: {
	// 	...pathsToModuleNameMapper(specConfig.compilerOptions.paths, {
	// 		useESM: true,
	// 		prefix: import.meta.dirname
	// 	})
	// }
}
export default config
