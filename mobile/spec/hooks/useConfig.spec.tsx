import { ProviderError } from '@src/errors'
import { ConfigProvider, useConfig } from '@src/hooks/useConfig'
import { StorageKeys, StorageProvider, useStorage } from '@src/hooks/useStorage'
import { act, renderHook } from '@testing-library/react-native'
import { PropsWithChildren } from 'react'
import { vi } from 'vitest'

type UpdateFunction = Exclude<Omit<Parameters<typeof ConfigProvider>[0], 'children'>['onUpdate'], undefined>
const updateHandler = vi.fn<UpdateFunction>((cfg) => console.info('Config updated', cfg))

function ConfigWrapper({ children }: PropsWithChildren) {
	return (
		<StorageProvider>
			<ConfigProvider onUpdate={updateHandler}>{children}</ConfigProvider>
		</StorageProvider>
	)
}

describe('<ConfigProvider />', () => {
	test('useConfig throws', async () => {
		await expect(renderHook(useConfig)).rejects.toThrow(ProviderError)
		await expect(renderHook(useConfig, { wrapper: ConfigWrapper })).resolves.toBeDefined()
	})

	test('Read Config', async () => {
		const { result } = await renderHook(useConfig, { wrapper: ConfigWrapper })

		expect(result.current.current).toBeNull()
		const testConfig = {
			key: 'value',
		}
		await act(async () => {
			result.current.update(testConfig)
		})

		expect(result.current.current).toMatchObject(testConfig)
	})

	test('Update Config', async () => {
		const { result: configResult } = await renderHook(useConfig, { wrapper: ConfigWrapper })
		const { result: storageResult } = await renderHook(useStorage, { wrapper: ConfigWrapper })

		const testConfig = { key: 'value' }

		await act(() => configResult.current.update(testConfig))

		expect(JSON.parse(storageResult.current.getString(StorageKeys.Config) ?? 'null')).toMatchObject(testConfig)

		expect(updateHandler).toHaveBeenLastCalledWith(testConfig)
		expect(configResult.current.current).toMatchObject(testConfig)

		await act(() => configResult.current.update(null))

		expect(updateHandler).toHaveBeenLastCalledWith(null)
		expect(configResult.current.current).toBeNull()
	})
})
