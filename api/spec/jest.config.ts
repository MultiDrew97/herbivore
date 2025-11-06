import { join, resolve } from 'path'
import { JestConfigWithTsJest, pathsToModuleNameMapper } from 'ts-jest'
import createDefaultHerbConfig from '../../jest.config'

import { compilerOptions } from '../tsconfig.spec.json'

// const { compilerOptions } = require('../tsconfig.spec.json')
const baseConfig = createDefaultHerbConfig({
	tsconfig: join(__dirname, '../tsconfig.spec.json'),
})

const jestConfig: JestConfigWithTsJest = {
	...baseConfig,
	displayName: { name: 'Herbivore/API', color: 'yellowBright' },
	moduleDirectories: ['node_modules'],
	rootDir: resolve(__dirname),
	setupFilesAfterEnv: [...(baseConfig.setupFilesAfterEnv ?? []), resolve(__dirname, './jest.setup.ts')],
	moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths ?? {}, {
		prefix: '<rootDir>/',
		useESM: true,
	}),
}

export default jestConfig
