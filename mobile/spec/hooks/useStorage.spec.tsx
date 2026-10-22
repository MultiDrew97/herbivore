import { herbRender, noop, RenderError, TestError } from '@spec/helpers'
import { ProviderError } from '@src/errors'
import { StorageKeys, StorageProvider, useStorage } from '@src/hooks/useStorage'
import { act, renderHook, waitFor } from '@testing-library/react-native'
import { PropsWithChildren, useEffect } from 'react'
import { Text } from 'react-native'
import { vi } from 'vitest'

function StorageWrapper({ children }: PropsWithChildren) {
	return <StorageProvider>{children}</StorageProvider>
}

const key = 'key'
let value = 'value'
describe('<StorageProvider />', () => {
	afterEach(async () => {
		const { result } = await renderHook(useStorage, { wrapper: StorageWrapper })
	})
	test('useStorage: Used within proper provider', async () => {
		await expect(renderHook(useStorage)).rejects.toThrow(ProviderError)

		await expect(renderHook(useStorage, { wrapper: StorageWrapper })).resolves.toBeDefined()
	})

	test('useStorage: Set and retrieve values', async () => {
		const { result } = await renderHook(useStorage, { wrapper: StorageWrapper })

		expect(result.current.getAllKeys()).toHaveLength(0)
		expect(result.current.getString(key)).toBeUndefined()

		result.current.set(key, value)

		expect(result.current.getAllKeys()).toHaveLength(1)
		expect(result.current.getString(key)).toBeDefined()
		expect(result.current.getString(key)).toBe(value)

		result.current.set(key, 'new-value')

		expect(result.current.getString(key)).not.toBe(value)
		expect(result.current.getString(key)).toBe('new-value')
	})

	test('useStorage: Maintains update listeners', async () => {
		const { result, rerender } = await renderHook(useStorage, { wrapper: StorageWrapper })
		const listener = vi.fn((key) => {
			console.debug(`Value changed for '${key}' to ${result.current.getString(key)}`)
		})

		await waitFor(async () => {
			const sub = result.current.addOnValueChangedListener(listener)
			await rerender(undefined)
			result.current.set(key, value)
			value = 'new-value'
			result.current.set(key, value)
		})

		expect(listener).toHaveBeenCalledTimes(2)
	})

	test('UserID Functions', async () => {
		// await herbRender(<StorageTester />, StorageWrapper)
		// if (!storage) throw new TestError("Storage not set in 'UserID Functions' test")
		// const testID = 'userID'
		// expect(storage.getString(StorageKeys.UserID)).not.toBe(testID)
		// expect(storage.getString(StorageKeys.UserID)).toBeUndefined()
		// storage.set(StorageKeys.UserID, testID)
		// expect(storage.getString(StorageKeys.UserID)).toBe(testID)
		// const newID = `${testID}-changed`
		// storage.set(StorageKeys.UserID, newID)
		// expect(storage.getString(StorageKeys.UserID)).not.toBe(testID)
		// expect(storage.getString(StorageKeys.UserID)).not.toBeUndefined()
		// expect(storage.getString(StorageKeys.UserID)).toBe(newID)
	})

	test('Config Functions', async () => {
		// await herbRender(<StorageTester />, StorageWrapper)
		// if (!storage) throw new TestError("Storage not set in 'UserID Functions' test")
		// const testConfig = {
		// 	value: 1,
		// 	temp: 'values',
		// }
		// expect(storage.getString(StorageKeys.Config)).not.toBe(testConfig)
		// expect(storage.getString(StorageKeys.Config)).toBeUndefined()
		// storage.set(StorageKeys.Config, JSON.stringify(testConfig))
		// expect(JSON.parse(storage.getString(StorageKeys.Config) ?? 'null')).toMatchObject(testConfig)
		// const newConfig = {
		// 	...testConfig,
		// 	temp: 'new values',
		// 	value: 3,
		// }
		// storage.set(StorageKeys.Config, JSON.stringify(newConfig))
		// expect(storage.getString(StorageKeys.Config)).not.toMatchObject(testConfig)
		// expect(storage.getString(StorageKeys.Config)).not.toBeUndefined()
		// expect(JSON.parse(storage.getString(StorageKeys.Config) ?? 'undefined')).toMatchObject(newConfig)
	})
})
