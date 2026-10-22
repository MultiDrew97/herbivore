import { ProviderError } from '@src/errors'
import { HerbUser, SessionProvider, useSession } from '@src/hooks/useSession'
import { StorageProvider } from '@src/hooks/useStorage'
import { act, renderHook } from '@testing-library/react-native'
import { PropsWithChildren } from 'react'

const user: HerbUser = {
	_id: '1',
}

type SessionWrapperProps = PropsWithChildren
function SessionWrapper({ children }: SessionWrapperProps) {
	return (
		<StorageProvider>
			<SessionProvider>{children}</SessionProvider>
		</StorageProvider>
	)
}

describe('<SessionProvider />', () => {
	test('useSession throws', async () => {
		await expect(renderHook(useSession)).rejects.toThrow(ProviderError)

		await expect(renderHook(useSession, { wrapper: SessionWrapper })).resolves.toBeDefined()
	})

	test('Login', async () => {
		const { result, rerender } = await renderHook(useSession, { wrapper: SessionWrapper })

		expect(result.current).toBeDefined()

		expect(result.current.userID).toBeNull()

		await act(async () => {
			await result.current.login(user)
			await rerender(undefined)
		})

		expect(result.current.userID).toBe(user._id)

		const newUser = {
			_id: 'new-id',
		}

		await result.current.login(newUser)
		expect(result.current.userID).toBe(newUser._id)
	})

	test('Logout', async () => {
		const { result } = await renderHook(useSession, { wrapper: SessionWrapper })

		await act(async () => {
			await result.current.logout()
		})

		expect(result.current.userID).toBeNull()
	})
})
