import { join, resolve } from 'path'
import { JestConfigWithTsJest, pathsToModuleNameMapper } from 'ts-jest'
import createDefaultHerbConfig from '../../jest.config'

import { compilerOptions } from '../tsconfig.spec.json'

// const { compilerOptions } = require('../tsconfig.spec.json')

const jestConfig: JestConfigWithTsJest = {
	...createDefaultHerbConfig({
		tsconfig: join(__dirname, '../tsconfig.spec.json'),
	}),
	detectLeaks: false,
	displayName: { name: 'Herbivore/API', color: 'yellowBright' },
	moduleDirectories: ['node_modules'],
	rootDir: resolve(__dirname),
	setupFilesAfterEnv: ['./jest.setup.ts'],
	moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths ?? {}, {
		prefix: '<rootDir>/',
		useESM: true,
	}),
}

export default jestConfig
