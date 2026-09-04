import { handleRenderError, TestError } from '@spec/helpers'
import { ProviderError } from '@src/errors'
import { useConfig } from '@src/hooks/useConfig'
import { StorageProvider, useStorage } from '@src/hooks/useStorage'
import { render } from '@testing-library/react-native'
import { PropsWithChildren } from 'react'
import { Text } from 'react-native'

var storage: ReturnType<typeof useStorage> | undefined
function StorageTester() {
	storage = useStorage()
	return <Text>Storage Test</Text>
}

function StorageWrapper({ children }: PropsWithChildren) {
	return <StorageProvider>{children}</StorageProvider>
}

describe('<StorageProvider />', () => {
	afterEach(() => {
		storage = undefined
	})

	test('useStorage throws', async () => {
		expect(() => render(<StorageTester />)).rejects.toThrow(ProviderError)
	})

	test('useStorage succeeds', async () => {
		await render(<StorageTester />, { wrapper: StorageWrapper }).catch(handleRenderError)

		// expect(storage).toBeDefined()
	})

	test('UserID Functions', async () => {
		await render(<StorageTester />, { wrapper: StorageWrapper }).catch(handleRenderError)

		if (!storage) throw new TestError("Storage not set in 'UserID Functions' test")

		const testID = 'userID'
		expect(storage.getUserID()).not.toBe(testID)
		expect(storage.getUserID()).toBeUndefined()

		storage.setUserID(testID)
		expect(storage.getUserID()).toBe(testID)

		const newID = `${testID}-changed`
		storage.setUserID(newID)
		expect(storage.getUserID()).not.toBe(testID)
		expect(storage.getUserID()).not.toBeUndefined()
		expect(storage.getUserID()).toBe(newID)
	})

	test('Config Functions', async () => {
		await render(<StorageTester />, { wrapper: StorageWrapper }).catch(handleRenderError)

		if (!storage) throw new TestError("Storage not set in 'UserID Functions' test")

		const testConfig = {
			value: 1,
			temp: 'values',
		}
		expect(storage.getConfig()).not.toBe(testConfig)
		expect(storage.getConfig()).toBeNull()

		storage.setConfig(testConfig)
		expect(storage.getConfig()).toMatchObject(testConfig)

		const newConfig = {
			...testConfig,
			temp: 'new values',
			value: 3,
		}
		storage.setConfig(newConfig)
		expect(storage.getConfig()).not.toMatchObject(testConfig)
		expect(storage.getConfig()).not.toBeUndefined()
		expect(storage.getConfig()).toMatchObject(newConfig)
	})
})
