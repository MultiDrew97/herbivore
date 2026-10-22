import { defineConfig } from 'eslint/config'
// import {} from 'eslint/core'
import { fixupConfigRules, fixupPluginRules } from '@eslint/compat'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactNative from 'eslint-plugin-react-native'
import tsLint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'
import baseLintConfig from '../eslint.config.mjs'
import esmLint from 'typescript-eslint'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all,
})

export default defineConfig([
	{
		files: ['**/*.[cm]?[tj]sx?'],
		// extends: [...baseLintConfig],
		extends: fixupConfigRules(
			compat.extends(
				'eslint:recommended',
				'plugin:react/recommended',
				'plugin:react-hooks/recommended',
				'plugin:react-native/all',
				'plugin:@typescript-eslint/recommended'
			)
		),

		plugins: {
			react: fixupPluginRules(react),
			'react-hooks': fixupPluginRules(reactHooks),
			'react-native': fixupPluginRules(reactNative),
		},

		languageOptions: {
			parser: tsParser,
			ecmaVersion: 'latest',
			sourceType: 'module',

			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
			},
		},

		settings: {
			react: {
				version: 'detect',
			},
		},

		rules: {
			'react-native/no-raw-text': [
				'error',
				{
					skip: ['ThemedText', 'NativeTabs.Trigger.Label', 'Stack.Screen.Title'],
				},
			],
			'react/react-in-jsx-scope': 'off',
			'react-native/no-inline-styles': 'warn',
			'react-native/no-unused-styles': 'warn',
			'react-native/no-color-literals': 'off',
			'react/prop-types': 'off',
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/no-require-imports': 'off',
		},
	},
])
