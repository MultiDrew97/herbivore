import { defineConfig } from 'eslint/config'
import tsParser from '@typescript-eslint/parser'
import { fixupConfigRules, fixupPluginRules } from '@eslint/compat'
import { fileURLToPath } from 'node:url'
import { FlatCompat } from '@eslint/eslintrc'
import path from 'node:path'
import js from '@eslint/js'
// import tsLint from '@typescript-eslint/eslint-plugin'
import esmLint from 'typescript-eslint'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all,
})
export default defineConfig({
	files: ['**/*.[cm]?[tj]sx?'],
	// extends: compat.extends(js.configs.recommended, esmLint.configs.recommendedTypeChecked),
	plugins: {
		// '@typescript-eslint': fixupPluginRules(tsLint),
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
	rules: {
		'no-unused-vars': 'off',
		// '@typescript-eslint/no-unused-vars': [
		// 	'warn',
		// 	{
		// 		argsIgnorePattern: '^_',
		// 		varsIgnorePattern: '^_',
		// 	},
		// ],
	},
})
