import { join, resolve } from 'path'
import { type JestConfigWithTsJest, pathsToModuleNameMapper } from 'ts-jest'

import specConfig from './tsconfig.spec.json' with {type: "json"}

const config: JestConfigWithTsJest = {
	// ...baseConfig,
	displayName: { name: 'API', color: 'yellowBright' },
	rootDir: resolve(import.meta.dirname),
	setupFilesAfterEnv: [/* ...(baseConfig.setupFilesAfterEnv ?? []), */ '<rootDir>/jest.setup.ts'],
	moduleNameMapper: {
		// ...baseConfig.moduleNameMapper,
		...pathsToModuleNameMapper(specConfig.compilerOptions.paths, {
			prefix: '<rootDir>/',
			useESM: true,
		}),
	},
}
// import baseConfig from '@base/config'

export default config
