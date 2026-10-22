import { herbRender } from '@spec/helpers'
import PrivacyProvider from '@src/hooks/usePrivacy'
import { PropsWithChildren } from 'react'
import { AppState, AppStateStatus, Text } from 'react-native'
import { vi } from 'vitest'

const stateSpy = vi.spyOn(AppState, 'addEventListener')

const hideHandler = vi.fn((state: AppStateStatus) => {
	console.info('Hiding privacy screen...')
	console.debug(`Current State - ${state}`)
})
const showHandler = vi.fn((state: AppStateStatus) => {
	console.info('Showing privacy screen...')
	console.debug(`Current State - ${state}`)
})

function PrivacyTester() {
	return <Text>Privacy Test</Text>
}

function PrivacyWrapper({ children }: PropsWithChildren) {
	return (
		<PrivacyProvider
			onShowPrivacy={showHandler}
			onHidePrivacy={hideHandler}>
			{children}
		</PrivacyProvider>
	)
}

describe('<PrivacyProvider />', () => {
	afterEach(() => {
		hideHandler.mockClear()
		showHandler.mockClear()
	})

	test('Hide Privacy', async () => {
		const app = await herbRender(<PrivacyTester />, PrivacyWrapper)

		expect(app).toBeDefined()

		stateSpy.mock.lastCall?.[1]?.('active')

		expect(hideHandler).toHaveBeenCalled()
		expect(showHandler).not.toHaveBeenCalled()
	})

	test('Show Privacy', async () => {
		const app = await herbRender(<PrivacyTester />, PrivacyWrapper)

		expect(app).toBeDefined()

		stateSpy.mock.lastCall?.[1]?.('background')

		expect(showHandler).toHaveBeenCalled()
		expect(hideHandler).not.toHaveBeenCalled()
	})
})
