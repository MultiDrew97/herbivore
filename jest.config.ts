import { merge } from 'lodash'
import { JestConfigWithTsJest, createDefaultEsmPreset, TsJestTransformerOptions } from 'ts-jest'

type JestTransformOptions = Required<Pick<TsJestTransformerOptions, 'tsconfig'>> &
	Pick<TsJestTransformerOptions, 'babelConfig'>
type HerbJestConfig = Omit<JestConfigWithTsJest, 'rootDir' | 'moduleNameMapper' | 'displayName'>

export default function createDefaultHerbConfig(options?: JestTransformOptions): HerbJestConfig {
	const baseOptions: TsJestTransformerOptions = {
		diagnostics: {
			pretty: true,
			ignoreCodes: ['151002'],
		},
	}

	// if (options) {
	// 	console.info('Applying custom Jest transformer options...')
	// 	merge(baseOptions, options)
	// }

	return {
		...createDefaultEsmPreset(merge(baseOptions, options)),
		errorOnDeprecated: true,
		detectLeaks: true,
		detectOpenHandles: true,
		preset: 'ts-jest',
		randomize: true,
		watchman: true,
		// setupFilesAfterEnv: ['./jest.setup.ts'],
		// moduleFileExtensions: ['ts', 'tsx', 'cjs', 'js', 'json'],
		transform: {
			'^.+\\.tsx?$': 'ts-jest',
		},
	}
}

// const baseConfig: JestConfigWithTsJest = {
// 	...createDefaultEsmPreset({}),
// 	errorOnDeprecated: true,
// 	displayName: { name: 'Herbivore/Core', color: 'blueBright' },
// 	detectLeaks: true,
// 	detectOpenHandles: true,
// 	moduleDirectories: ['node_modules'],
// 	moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
// 		prefix: '<rootDir>/',
// 	}),
// 	// onlyChanged: true,
// 	preset: 'ts-jest',
// 	randomize: true,
// 	rootDir: resolve(__dirname),
// 	setupFilesAfterEnv: ['./jest.setup.ts'],
// 	silent: silent,
// 	testEnvironment: 'node',
// 	/* testEnvironmentOptions: configDotenv({
// 		path: './.env.test',
// 		override: true,
// 	}).parsed, */
// 	transform: {
// 		'^.+\\.tsx?$': ['ts-jest', {}],
// 	},
// 	watchman: true,
// 	verbose: false,
// }

// export default baseConfig;
