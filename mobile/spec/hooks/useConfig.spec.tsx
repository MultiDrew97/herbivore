import { herbRender, RenderError } from '@spec/helpers'
import { ProviderError } from '@src/errors'
import { ConfigProvider, useConfig } from '@src/hooks/useConfig'
import { StorageKeys, StorageProvider, useStorage } from '@src/hooks/useStorage'
import { act, renderHook, waitFor } from '@testing-library/react-native'
import { PropsWithChildren } from 'react'
import { Text } from 'react-native'
import { vi } from 'vitest'

// let configContext: ReturnType<typeof useConfig> | undefined

// function ConfigTester() {
// 	// configContext = useConfig()
// 	return <Text>Config Test</Text>
// }
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
	// afterEach(() => {
	// 	configContext?.[1]?.(null)
	// 	configContext = undefined
	// })

	test('useConfig throws', async () => {
		await expect(renderHook(useConfig)).rejects.toThrow(ProviderError)
		await expect(renderHook(useConfig, { wrapper: ConfigWrapper })).resolves.toBeDefined()
	})

	test('Read Config', async () => {
		const { result } = await renderHook(useConfig, { wrapper: ConfigWrapper })

		const [config, sync] = result.current

		expect(config).toBeNull()
		const testConfig = {
			key: 'value',
		}
		await waitFor(() => {
			sync(testConfig)
		})

		expect(config).toMatchObject(testConfig)
	})

	test('Update Config', async () => {
		const { result: configResult } = await renderHook(useConfig, { wrapper: ConfigWrapper })
		const { result: storageResult } = await renderHook(useStorage, { wrapper: ConfigWrapper })

		const [config, sync] = configResult.current
		const testConfig = { key: 'value' }

		await waitFor(() => sync(testConfig))

		expect(JSON.parse(storageResult.current.getString(StorageKeys.Config) ?? 'null')).toMatchObject(testConfig)

		expect(updateHandler).toHaveBeenLastCalledWith(testConfig)
		expect(config).toMatchObject(testConfig)

		await waitFor(() => sync(null))

		expect(updateHandler).toHaveBeenLastCalledWith(null)
		expect(config).toBeNull()
	})
})
