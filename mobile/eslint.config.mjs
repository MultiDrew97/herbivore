import { fixupConfigRules, fixupPluginRules } from '@eslint/compat'
import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import tsParser from '@typescript-eslint/parser'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactNative from 'eslint-plugin-react-native'
import { defineConfig } from 'eslint/config'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import baseCfg from '../eslint.config.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all,
})

export default defineConfig([
	...baseCfg,
	{
		basePath: './src',
		files: ['**/*.{js,jsx,ts,tsx}'],
		extends: fixupConfigRules(
			compat.extends('plugin:react/recommended', 'plugin:react-hooks/recommended', 'plugin:react-native/all')
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
			// '@typescript-eslint/no-require-imports': 'off',
		},
	},
])
