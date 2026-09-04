import { StorageProvider } from '@src/hooks/useStorage'
import { render } from '@testing-library/react-native'
import { handleRenderError } from '@spec/helpers'
import { ConfigProvider, useConfig } from '@src/hooks/useConfig'
import { PropsWithChildren } from 'react'
import { Text } from 'react-native'
import { ProviderError, RenderError } from '@src/errors'
import { vi } from 'vitest'

let configContext: ReturnType<typeof useConfig> | undefined

function ConfigTester() {
	configContext = useConfig()
	return <Text>Config Test</Text>
}

type UpdateFunction = Omit<Parameters<typeof ConfigProvider>[0], 'children'>
const updateHandler = vi.fn<Exclude<UpdateFunction['onUpdate'], undefined>>((cfg) => {})
// const updateHandler = jest.fn<
// 	ReturnType<Exclude<UpdateFunction['onUpdate'], undefined>>,
// 	Parameters<Exclude<UpdateFunction['onUpdate'], undefined>>
// >((cfg) => {})

function ConfigWrapper({ children }: PropsWithChildren) {
	return (
		<StorageProvider>
			<ConfigProvider onUpdate={updateHandler}>{children}</ConfigProvider>
		</StorageProvider>
	)
}

describe('<ConfigProvider />', () => {
	afterEach(() => {
		configContext?.[1]?.(null)
		configContext = undefined
	})

	test('useConfig throws', async () => {
		expect(() => render(<ConfigTester />)).rejects.toThrow(ProviderError)
		expect(configContext).toBeUndefined()
	})

	test('Read Config', async () => {
		await render(<ConfigTester />, {
			wrapper: ConfigWrapper,
		}).catch(handleRenderError)

		if (!configContext) throw new Error("configContext not set in 'Config Reading' test")

		const [config] = configContext
		expect(config).toBeFalsy()
	})

	test('Update Config', async () => {
		await render(<ConfigTester />, {
			wrapper: ({ children }: PropsWithChildren) => (
				<StorageProvider>
					<ConfigProvider onUpdate={updateHandler}>{children}</ConfigProvider>
				</StorageProvider>
			),
		}).catch(handleRenderError)

		if (!configContext) throw new Error("configContext not set in 'Config Reading' test")

		const [_, sync] = configContext
		const testConfig: any = {
			setting1: 'value',
			setting2: 1,
		}
		sync(testConfig)

		expect(updateHandler).toHaveBeenCalled()
		expect(updateHandler).toHaveBeenLastCalledWith(testConfig)

		const newConfig: typeof testConfig = {
			...testConfig,
			setting1: 'new value',
			setting2: 2,
		}
		sync(newConfig)

		expect(updateHandler).toHaveBeenCalled()
		expect(updateHandler).not.toHaveBeenLastCalledWith(testConfig)
		expect(updateHandler).toHaveBeenLastCalledWith(newConfig)
	})
})
