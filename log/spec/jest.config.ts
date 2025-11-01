import { join, resolve } from 'path'
import { JestConfigWithTsJest, pathsToModuleNameMapper } from 'ts-jest'
import createDefaultHerbConfig from '../../jest.config'

// import {compilerOptions} from '../tsconfig.spec.json' with {type: "json"}
const { compilerOptions } = require('../tsconfig.spec.json')

/*  */
const jestConfig: JestConfigWithTsJest = {
	...createDefaultHerbConfig({
		tsconfig: join(__dirname, '../tsconfig.spec.json'),
	}),
	displayName: { name: 'Herbivore/Log', color: 'greenBright' },
	moduleDirectories: ['node_modules'],
	rootDir: resolve(__dirname),
	setupFilesAfterEnv: ['./jest.setup.ts'],
	moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths ?? {}, {
		prefix: '<rootDir>/',
		useESM: true,
	}),
}

export default jestConfig
