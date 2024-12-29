// import { configDotenv } from 'dotenv'
import { resolve } from 'path'
import { JestConfigWithTsJest, pathsToModuleNameMapper } from 'ts-jest'
import { compilerOptions } from '../tsconfig.json'

/**
 * Whether to silence console output during tests
 */
export const silent = true

/**
 *  The config for the jest test environment
 */
const jestConfig: JestConfigWithTsJest = {
	errorOnDeprecated: true,
	displayName: { name: 'Herbivore/Log', color: 'greenBright' },
	detectLeaks: false,
	detectOpenHandles: true,
	moduleDirectories: ['node_modules'],
	moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
		prefix: '<rootDir>/',
	}),
	// onlyChanged: true,
	preset: 'ts-jest',
	randomize: true,
	rootDir: resolve(__dirname),
	setupFilesAfterEnv: ['./jest.setup.ts'],
	silent: silent,
	testEnvironment: 'node',
	/* testEnvironmentOptions: configDotenv({
		path: './.env.test',
		override: true,
	}).parsed, */
	transform: {
		'^.+\\.tsx?$': ['ts-jest', {}],
	},
	watchman: true,
	verbose: false,
}

export default jestConfig
